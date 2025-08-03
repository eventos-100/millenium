/**
 * Millenium Automotive - Enhanced Webflow Cloud Worker with SQLite
 */

import { drizzle } from "drizzle-orm/d1";
import { eq } from "drizzle-orm";
import * as schema from "./db/schema";
import { usersTable, leadsTable, testDriveRequestsTable, savedConfigurationsTable, analyticsEventsTable } from "./db/schema";

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
      // Initialize Drizzle ORM
      const db = drizzle(env.DB, { schema });

      // API Routes
      if (pathname.startsWith('/api/')) {
        const response = await handleApiRoute(request, env, db, pathname);
        return addCorsHeaders(response, corsHeaders);
      }

      // Health check
      if (pathname === '/health') {
        return new Response(JSON.stringify({ 
          status: 'healthy',
          timestamp: new Date().toISOString(),
          site_id: env.WEBFLOW_SITE_ID,
          database: 'connected'
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // Default response
      return new Response('Millenium Automotive - Webflow Cloud API', {
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

async function handleApiRoute(request: Request, env: Env, db: any, pathname: string): Promise<Response> {
  const segments = pathname.split('/').filter(Boolean);
  const endpoint = segments[1]; // api/[endpoint]

  switch (endpoint) {
    case 'users':
      return handleUsers(request, db);
    case 'leads':
      return handleLeads(request, env, db);
    case 'configurations':
      return handleConfigurations(request, env, db);
    case 'test-drive':
      return handleTestDrive(request, db);
    case 'analytics':
      return handleAnalytics(request, db);
    default:
      return new Response(JSON.stringify({ error: 'Endpoint not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
  }
}

// Users API - Following Webflow Cloud documentation pattern
async function handleUsers(request: Request, db: any): Promise<Response> {
  const method = request.method;

  switch (method) {
    case 'POST':
      return createUser(request, db);
    case 'GET':
      return getUsers(request, db);
    default:
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { 'Content-Type': 'application/json' }
      });
  }
}

async function createUser(request: Request, db: any): Promise<Response> {
  try {
    const { name, age, email } = await request.json();

    // Validate required fields
    if (!name || !email || !age) {
      return new Response(JSON.stringify({ 
        error: 'Name, email, and age are required' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Insert the new user into the usersTable
    const newUser = await db
      .insert(usersTable)
      .values({ name, age, email })
      .returning();

    // Return the created user
    return new Response(JSON.stringify(newUser[0]), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Create user error:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to create user',
      message: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function getUsers(request: Request, db: any): Promise<Response> {
  try {
    const users = await db.select().from(usersTable);
    
    return new Response(JSON.stringify(users), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Get users error:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to fetch users' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Enhanced Leads management with SQLite
async function handleLeads(request: Request, env: Env, db: any): Promise<Response> {
  const method = request.method;

  switch (method) {
    case 'POST':
      return createLead(request, env, db);
    case 'GET':
      return getLeads(request, db);
    default:
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { 'Content-Type': 'application/json' }
      });
  }
}

async function createLead(request: Request, env: Env, db: any): Promise<Response> {
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

    // Insert into SQLite database
    const newLead = await db
      .insert(leadsTable)
      .values({ 
        name, 
        email, 
        phone, 
        vehicleInterest: vehicle_interest, 
        message, 
        source 
      })
      .returning();

    // Cache in KV for quick access
    const leadData = {
      id: newLead[0].id,
      name,
      email,
      phone,
      vehicle_interest,
      source,
      created_at: new Date().toISOString()
    };

    await env.CACHE.put(`lead:${newLead[0].id}`, JSON.stringify(leadData), {
      expirationTtl: 86400 // 24 hours
    });

    return new Response(JSON.stringify({ 
      success: true,
      lead_id: newLead[0].id,
      lead: newLead[0]
    }), {
      status: 201,
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

async function getLeads(request: Request, db: any): Promise<Response> {
  try {
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const status = url.searchParams.get('status');

    let query = db.select().from(leadsTable);
    
    if (status) {
      query = query.where(eq(leadsTable.status, status));
    }

    const leads = await query.limit(limit);

    return new Response(JSON.stringify({
      leads,
      pagination: {
        limit,
        total: leads.length
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

// Configuration management with SQLite
async function handleConfigurations(request: Request, env: Env, db: any): Promise<Response> {
  const method = request.method;

  switch (method) {
    case 'POST':
      return saveConfiguration(request, env, db);
    case 'GET':
      return getConfiguration(request, env, db);
    default:
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { 'Content-Type': 'application/json' }
      });
  }
}

async function saveConfiguration(request: Request, env: Env, db: any): Promise<Response> {
  try {
    const data = await request.json();
    const { session_id, vehicle_id, vehicle_name, configuration, total_price, monthly_payment } = data;

    // Save to SQLite
    const savedConfig = await db
      .insert(savedConfigurationsTable)
      .values({
        sessionId: session_id,
        vehicleId: vehicle_id,
        vehicleName: vehicle_name,
        configuration: JSON.stringify(configuration),
        totalPrice: total_price,
        monthlyPayment: monthly_payment,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
      })
      .returning();

    // Also store in KV for quick access
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
      configuration_id: savedConfig[0].id
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
}

async function getConfiguration(request: Request, env: Env, db: any): Promise<Response> {
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
      // Fallback to SQLite database
      const configs = await db
        .select()
        .from(savedConfigurationsTable)
        .where(eq(savedConfigurationsTable.sessionId, session_id))
        .limit(1);
      
      if (configs.length > 0) {
        const config = configs[0];
        configData = JSON.stringify({
          vehicle_id: config.vehicleId,
          vehicle_name: config.vehicleName,
          configuration: JSON.parse(config.configuration),
          total_price: config.totalPrice,
          monthly_payment: config.monthlyPayment,
          saved_at: config.createdAt
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

// Test drive requests with SQLite
async function handleTestDrive(request: Request, db: any): Promise<Response> {
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

    // Create test drive request in SQLite
    const newRequest = await db
      .insert(testDriveRequestsTable)
      .values({
        name,
        email,
        phone,
        vehicleId: vehicle_id,
        vehicleName: vehicle_name,
        preferredDate: preferred_date,
        preferredTime: preferred_time,
        dealerLocation: dealer_location,
        notes
      })
      .returning();

    return new Response(JSON.stringify({ 
      success: true,
      request_id: newRequest[0].id,
      request: newRequest[0]
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

// Analytics with SQLite
async function handleAnalytics(request: Request, db: any): Promise<Response> {
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

    // Insert analytics event into SQLite
    await db
      .insert(analyticsEventsTable)
      .values({
        eventType: event_type,
        vehicleId: vehicle_id,
        userSessionId: user_session_id,
        pageUrl: page_url,
        referrer,
        userAgent,
        metadata: JSON.stringify(metadata)
      });

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