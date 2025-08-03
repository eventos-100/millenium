/**
 * Webflow Cloud Storage Implementation
 * Main worker entry point for automotive site
 */

export interface Env {
  // Database binding
  DB: D1Database;
  
  // KV Storage bindings
  CACHE: KVNamespace;
  SESSIONS: KVNamespace;
  
  // R2 Object storage
  MEDIA: R2Bucket;
  
  // Environment variables
  WEBFLOW_SITE_ID: string;
  WEBFLOW_API_TOKEN: string;
  WEBFLOW_API_URL: string;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const { pathname } = url;

    // CORS headers for all responses
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // API Routes
      if (pathname.startsWith('/api/')) {
        const response = await handleApiRoute(request, env, pathname);
        return addCorsHeaders(response, corsHeaders);
      }

      // Health check
      if (pathname === '/health') {
        return new Response(JSON.stringify({ 
          status: 'healthy',
          timestamp: new Date().toISOString(),
          site_id: env.WEBFLOW_SITE_ID
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // Default response
      return new Response('Webflow Auto Storage API', {
        headers: corsHeaders
      });

    } catch (error) {
      console.error('Worker error:', error);
      return new Response(JSON.stringify({ 
        error: 'Internal server error',
        message: error.message 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  },
};

async function handleApiRoute(request: Request, env: Env, pathname: string): Promise<Response> {
  const segments = pathname.split('/').filter(Boolean);
  const endpoint = segments[1]; // api/[endpoint]

  switch (endpoint) {
    case 'leads':
      return handleLeads(request, env);
    case 'configurations':
      return handleConfigurations(request, env);
    case 'test-drive':
      return handleTestDrive(request, env);
    case 'media':
      return handleMedia(request, env);
    case 'analytics':
      return handleAnalytics(request, env);
    case 'inventory':
      return handleInventory(request, env);
    default:
      return new Response(JSON.stringify({ error: 'Endpoint not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
  }
}

// Lead management endpoints
async function handleLeads(request: Request, env: Env): Promise<Response> {
  const method = request.method;

  switch (method) {
    case 'POST':
      return createLead(request, env);
    case 'GET':
      return getLeads(request, env);
    case 'PUT':
      return updateLead(request, env);
    default:
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { 'Content-Type': 'application/json' }
      });
  }
}

async function createLead(request: Request, env: Env): Promise<Response> {
  try {
    const data = await request.json();
    const { name, email, phone, vehicle_interest, message, source = 'website' } = data;

    // Validate required fields
    if (!name || !email) {
      return new Response(JSON.stringify({ 
        error: 'Name and email are required' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Generate session ID for tracking
    const sessionId = crypto.randomUUID();

    // Insert into database
    const result = await env.DB.prepare(`
      INSERT INTO leads (name, email, phone, vehicle_interest, message, source)
      VALUES (?, ?, ?, ?, ?, ?)
    `).bind(name, email, phone, vehicle_interest, message, source).run();

    if (!result.success) {
      throw new Error('Failed to save lead');
    }

    // Cache lead data in KV for quick access
    const leadData = {
      id: result.meta.last_row_id,
      name,
      email,
      phone,
      vehicle_interest,
      source,
      created_at: new Date().toISOString()
    };

    await env.CACHE.put(`lead:${result.meta.last_row_id}`, JSON.stringify(leadData), {
      expirationTtl: 86400 // 24 hours
    });

    return new Response(JSON.stringify({ 
      success: true,
      lead_id: result.meta.last_row_id,
      session_id: sessionId
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Create lead error:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to create lead',
      message: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function getLeads(request: Request, env: Env): Promise<Response> {
  try {
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const offset = parseInt(url.searchParams.get('offset') || '0');
    const status = url.searchParams.get('status');

    let query = 'SELECT * FROM leads';
    const params = [];

    if (status) {
      query += ' WHERE status = ?';
      params.push(status);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const result = await env.DB.prepare(query).bind(...params).all();

    return new Response(JSON.stringify({
      leads: result.results,
      pagination: {
        limit,
        offset,
        total: result.results.length
      }
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Get leads error:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to fetch leads' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function updateLead(request: Request, env: Env): Promise<Response> {
  try {
    const data = await request.json();
    const { id, status, score } = data;

    if (!id) {
      return new Response(JSON.stringify({ error: 'Lead ID required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const result = await env.DB.prepare(`
      UPDATE leads SET status = ?, score = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `).bind(status, score, id).run();

    if (!result.success) {
      throw new Error('Failed to update lead');
    }

    // Update cache
    await env.CACHE.delete(`lead:${id}`);

    return new Response(JSON.stringify({ 
      success: true,
      updated: result.meta.changes 
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Update lead error:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to update lead' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Configuration management
async function handleConfigurations(request: Request, env: Env): Promise<Response> {
  const method = request.method;

  switch (method) {
    case 'POST':
      return saveConfiguration(request, env);
    case 'GET':
      return getConfiguration(request, env);
    default:
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { 'Content-Type': 'application/json' }
      });
  }
}

async function saveConfiguration(request: Request, env: Env): Promise<Response> {
  try {
    const data = await request.json();
    const { session_id, vehicle_id, vehicle_name, configuration, total_price, monthly_payment } = data;

    if (!session_id || !vehicle_id || !configuration) {
      return new Response(JSON.stringify({ 
        error: 'Session ID, vehicle ID, and configuration are required' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Save to database
    const result = await env.DB.prepare(`
      INSERT OR REPLACE INTO saved_configurations 
      (session_id, vehicle_id, vehicle_name, configuration, total_price, monthly_payment, expires_at)
      VALUES (?, ?, ?, ?, ?, ?, datetime('now', '+30 days'))
    `).bind(
      session_id, 
      vehicle_id, 
      vehicle_name, 
      JSON.stringify(configuration), 
      total_price, 
      monthly_payment
    ).run();

    // Store in KV for quick access
    await env.SESSIONS.put(`config:${session_id}:${vehicle_id}`, JSON.stringify({
      vehicle_id,
      vehicle_name,
      configuration,
      total_price,
      monthly_payment,
      saved_at: new Date().toISOString()
    }), {
      expirationTtl: 2592000 // 30 days
    });

    return new Response(JSON.stringify({ 
      success: true,
      configuration_id: result.meta.last_row_id
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Save configuration error:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to save configuration' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}async function getConfiguration(request: Request, env: Env): Promise<Response> {
  try {
    const url = new URL(request.url);
    const session_id = url.searchParams.get('session_id');
    const vehicle_id = url.searchParams.get('vehicle_id');

    if (!session_id) {
      return new Response(JSON.stringify({ error: 'Session ID required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Try KV first for speed
    const key = vehicle_id ? `config:${session_id}:${vehicle_id}` : `config:${session_id}`;
    let configData = await env.SESSIONS.get(key);

    if (!configData) {
      // Fallback to database
      let query = 'SELECT * FROM saved_configurations WHERE session_id = ?';
      const params = [session_id];

      if (vehicle_id) {
        query += ' AND vehicle_id = ?';
        params.push(vehicle_id);
      }

      query += ' AND expires_at > datetime("now") ORDER BY created_at DESC';

      const result = await env.DB.prepare(query).bind(...params).all();
      
      if (result.results.length > 0) {
        const config = result.results[0];
        configData = JSON.stringify({
          vehicle_id: config.vehicle_id,
          vehicle_name: config.vehicle_name,
          configuration: JSON.parse(config.configuration),
          total_price: config.total_price,
          monthly_payment: config.monthly_payment,
          saved_at: config.created_at
        });
      }
    }

    if (!configData) {
      return new Response(JSON.stringify({ error: 'Configuration not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(configData, {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Get configuration error:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to get configuration' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Test drive request handling
async function handleTestDrive(request: Request, env: Env): Promise<Response> {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const data = await request.json();
    const { 
      name, email, phone, vehicle_id, vehicle_name, 
      preferred_date, preferred_time, dealer_location, notes 
    } = data;

    if (!name || !email || !phone || !vehicle_id) {
      return new Response(JSON.stringify({ 
        error: 'Name, email, phone, and vehicle ID are required' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Check if lead exists
    let leadResult = await env.DB.prepare('SELECT id FROM leads WHERE email = ?').bind(email).first();
    let leadId = null;

    if (!leadResult) {
      // Create new lead
      const newLead = await env.DB.prepare(`
        INSERT INTO leads (name, email, phone, vehicle_interest, source)
        VALUES (?, ?, ?, ?, 'test_drive')
      `).bind(name, email, phone, vehicle_name).run();
      
      leadId = newLead.meta.last_row_id;
    } else {
      leadId = leadResult.id;
    }

    // Create test drive request
    const result = await env.DB.prepare(`
      INSERT INTO test_drive_requests 
      (lead_id, name, email, phone, vehicle_id, vehicle_name, 
       preferred_date, preferred_time, dealer_location, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      leadId, name, email, phone, vehicle_id, vehicle_name,
      preferred_date, preferred_time, dealer_location, notes
    ).run();

    // Add interaction tracking
    await env.DB.prepare(`
      INSERT INTO lead_interactions (lead_id, action, vehicle_id, vehicle_name, score_value)
      VALUES (?, 'test_drive', ?, ?, 5)
    `).bind(leadId, vehicle_id, vehicle_name).run();

    return new Response(JSON.stringify({ 
      success: true,
      request_id: result.meta.last_row_id,
      lead_id: leadId
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Test drive request error:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to create test drive request' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Media upload handling
async function handleMedia(request: Request, env: Env): Promise<Response> {
  const method = request.method;

  switch (method) {
    case 'POST':
      return uploadMedia(request, env);
    case 'GET':
      return getMedia(request, env);
    case 'DELETE':
      return deleteMedia(request, env);
    default:
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { 'Content-Type': 'application/json' }
      });
  }
}

async function uploadMedia(request: Request, env: Env): Promise<Response> {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const category = formData.get('category') as string || 'general';
    const vehicle_id = formData.get('vehicle_id') as string;

    if (!file) {
      return new Response(JSON.stringify({ error: 'No file provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const extension = file.name.split('.').pop();
    const filename = `${category}/${vehicle_id || 'general'}/${timestamp}.${extension}`;

    // Upload to R2
    await env.MEDIA.put(filename, file.stream(), {
      httpMetadata: {
        contentType: file.type,
        contentDisposition: `inline; filename="${file.name}"`
      }
    });

    // Generate public URL (this would need to be configured in your R2 setup)
    const publicUrl = `https://your-r2-domain.com/${filename}`;

    return new Response(JSON.stringify({ 
      success: true,
      filename,
      url: publicUrl,
      size: file.size,
      type: file.type
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Media upload error:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to upload media' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function getMedia(request: Request, env: Env): Promise<Response> {
  try {
    const url = new URL(request.url);
    const filename = url.searchParams.get('filename');

    if (!filename) {
      return new Response(JSON.stringify({ error: 'Filename required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const object = await env.MEDIA.get(filename);

    if (!object) {
      return new Response(JSON.stringify({ error: 'File not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(object.body, {
      headers: {
        'Content-Type': object.httpMetadata?.contentType || 'application/octet-stream',
        'Content-Length': object.size.toString(),
        'Cache-Control': 'public, max-age=86400' // 24 hours
      }
    });

  } catch (error) {
    console.error('Get media error:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to get media' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function deleteMedia(request: Request, env: Env): Promise<Response> {
  try {
    const url = new URL(request.url);
    const filename = url.searchParams.get('filename');

    if (!filename) {
      return new Response(JSON.stringify({ error: 'Filename required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    await env.MEDIA.delete(filename);

    return new Response(JSON.stringify({ 
      success: true,
      message: 'File deleted successfully'
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Delete media error:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to delete media' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Analytics event tracking
async function handleAnalytics(request: Request, env: Env): Promise<Response> {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const data = await request.json();
    const { event_type, vehicle_id, user_session_id, page_url, referrer, metadata } = data;

    if (!event_type) {
      return new Response(JSON.stringify({ error: 'Event type required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get user agent from headers
    const userAgent = request.headers.get('User-Agent') || '';

    // Insert analytics event
    await env.DB.prepare(`
      INSERT INTO analytics_events 
      (event_type, vehicle_id, user_session_id, page_url, referrer, user_agent, metadata)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(
      event_type, 
      vehicle_id, 
      user_session_id, 
      page_url, 
      referrer, 
      userAgent, 
      JSON.stringify(metadata)
    ).run();

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Analytics error:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to track event' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Inventory management
async function handleInventory(request: Request, env: Env): Promise<Response> {
  const method = request.method;

  switch (method) {
    case 'GET':
      return getInventory(request, env);
    case 'POST':
      return updateInventory(request, env);
    default:
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { 'Content-Type': 'application/json' }
      });
  }
}

async function getInventory(request: Request, env: Env): Promise<Response> {
  try {
    const url = new URL(request.url);
    const vehicle_id = url.searchParams.get('vehicle_id');
    const status = url.searchParams.get('status');

    let query = 'SELECT * FROM inventory_cache WHERE 1=1';
    const params = [];

    if (vehicle_id) {
      query += ' AND vehicle_model_id = ?';
      params.push(vehicle_id);
    }

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    query += ' ORDER BY last_updated DESC';

    const result = await env.DB.prepare(query).bind(...params).all();

    return new Response(JSON.stringify({
      inventory: result.results
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Get inventory error:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to fetch inventory' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function updateInventory(request: Request, env: Env): Promise<Response> {
  try {
    const data = await request.json();
    const { 
      webflow_id, vehicle_model_id, vehicle_name, vin, 
      status, location, stock_count, price, special_price 
    } = data;

    if (!vehicle_model_id) {
      return new Response(JSON.stringify({ error: 'Vehicle model ID required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const result = await env.DB.prepare(`
      INSERT OR REPLACE INTO inventory_cache 
      (webflow_id, vehicle_model_id, vehicle_name, vin, status, location, stock_count, price, special_price)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      webflow_id, vehicle_model_id, vehicle_name, vin,
      status, location, stock_count, price, special_price
    ).run();

    return new Response(JSON.stringify({ 
      success: true,
      updated: result.meta.changes
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Update inventory error:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to update inventory' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Utility function to add CORS headers to responses
function addCorsHeaders(response: Response, corsHeaders: Record<string, string>): Response {
  const newHeaders = new Headers(response.headers);
  Object.entries(corsHeaders).forEach(([key, value]) => {
    newHeaders.set(key, value);
  });
  
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders
  });
}