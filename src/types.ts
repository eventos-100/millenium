/**
 * TypeScript definitions for Webflow Cloud Worker
 */

declare global {
  interface CloudflareEnv {
    // Database
    DB: D1Database;
    
    // KV Storage
    CACHE: KVNamespace;
    SESSIONS: KVNamespace;
    
    // R2 Storage
    MEDIA: R2Bucket;
    
    // Environment Variables
    WEBFLOW_SITE_ID: string;
    WEBFLOW_API_TOKEN: string;
    WEBFLOW_API_URL: string;
  }
}

// API Request/Response Types
export interface LeadCreateRequest {
  name: string;
  email: string;
  phone?: string;
  vehicle_interest?: string;
  message?: string;
  source?: string;
}

export interface LeadCreateResponse {
  success: boolean;
  lead_id: number;
  session_id: string;
}

export interface ConfigurationSaveRequest {
  session_id: string;
  vehicle_id: string;
  vehicle_name?: string;
  configuration: VehicleConfiguration;
  total_price?: number;
  monthly_payment?: number;
}

export interface ConfigurationSaveResponse {
  success: boolean;
  configuration_id: number;
}

export interface VehicleConfiguration {
  model: string;
  trim: string;
  exterior_color: string;
  interior_color: string;
  packages: string[];
  options: string[];
  accessories: string[];
}

export interface TestDriveRequest {
  name: string;
  email: string;
  phone: string;
  vehicle_id: string;
  vehicle_name?: string;
  preferred_date?: string;
  preferred_time?: string;
  dealer_location?: string;
  notes?: string;
}

export interface TestDriveResponse {
  success: boolean;
  request_id: number;
  lead_id: number;
}

export interface MediaUploadResponse {
  success: boolean;
  filename: string;
  url: string;
  size: number;
  type: string;
}

export interface AnalyticsEvent {
  event_type: 'page_view' | 'configure' | 'download' | 'inquiry' | 'test_drive';
  vehicle_id?: string;
  user_session_id?: string;
  page_url?: string;
  referrer?: string;
  metadata?: Record<string, any>;
}

export interface InventoryItem {
  webflow_id?: string;
  vehicle_model_id: string;
  vehicle_name?: string;
  vin?: string;
  status: 'In Stock' | 'In Transit' | 'Sold' | 'Reserved';
  location?: string;
  stock_count?: number;
  price?: number;
  special_price?: number;
}

// Database Schema Types
export interface Lead {
  id: number;
  webflow_id?: string;
  name: string;
  email: string;
  phone?: string;
  vehicle_interest?: string;
  message?: string;
  status: 'New' | 'Contacted' | 'Qualified' | 'Converted';
  source: string;
  score: number;
  created_at: string;
  updated_at: string;
  synced_at?: string;
}

export interface LeadInteraction {
  id: number;
  lead_id: number;
  action: 'page_view' | 'configure' | 'download' | 'inquiry' | 'test_drive';
  vehicle_id?: string;
  vehicle_name?: string;
  metadata?: string; // JSON string
  score_value: number;
  timestamp: string;
}

export interface SavedConfiguration {
  id: number;
  session_id: string;
  user_id?: string;
  vehicle_id: string;
  vehicle_name?: string;
  configuration: string; // JSON string
  total_price?: number;
  monthly_payment?: number;
  created_at: string;
  expires_at: string;
}

export interface FinanceCalculation {
  id: number;
  vehicle_id: string;
  price: number;
  down_payment?: number;
  term_months: number;
  apr: number;
  monthly_payment: number;
  total_cost?: number;
  calculated_at: string;
}

export interface TestDriveRequestDB {
  id: number;
  lead_id?: number;
  name: string;
  email: string;
  phone: string;
  vehicle_id: string;
  vehicle_name?: string;
  preferred_date?: string;
  preferred_time?: string;
  dealer_location?: string;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
  notes?: string;
  created_at: string;
}

export interface InventoryCache {
  id: number;
  webflow_id?: string;
  vehicle_model_id: string;
  vehicle_name?: string;
  vin?: string;
  status: 'In Stock' | 'In Transit' | 'Sold' | 'Reserved';
  location?: string;
  stock_count: number;
  price?: number;
  special_price?: number;
  last_updated: string;
}

export interface AnalyticsEventDB {
  id: number;
  event_type: string;
  vehicle_id?: string;
  user_session_id?: string;
  page_url?: string;
  referrer?: string;
  user_agent?: string;
  metadata?: string; // JSON string
  timestamp: string;
}

// Webflow API Types
export interface WebflowCollectionItem {
  id: string;
  name: string;
  slug: string;
  [key: string]: any;
}

export interface WebflowCollection {
  id: string;
  displayName: string;
  singularName: string;
  slug: string;
  fields: WebflowField[];
}

export interface WebflowField {
  id: string;
  slug: string;
  displayName: string;
  type: string;
  isRequired: boolean;
  isEditable: boolean;
}

export {};
