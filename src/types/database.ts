// src/types/database.ts
// Database types for Webflow Auto-1000 project

export interface Lead {
  id?: number;
  webflow_id?: string;
  name: string;
  email: string;
  phone?: string;
  vehicle_interest?: string;
  message?: string;
  status: 'New' | 'Contacted' | 'Qualified' | 'Converted';
  source?: string;
  score?: number;
  created_at?: string;
  updated_at?: string;
  synced_at?: string;
}

export interface LeadInteraction {
  id?: number;
  lead_id: number;
  action: 'page_view' | 'configure' | 'download' | 'inquiry' | 'test_drive';
  vehicle_id?: string;
  vehicle_name?: string;
  metadata?: Record<string, any>;
  score_value?: number;
  timestamp?: string;
}

export interface InventoryItem {
  id?: number;
  webflow_id?: string;
  vehicle_model_id: string;
  vehicle_name?: string;
  vin?: string;
  status?: 'In Stock' | 'In Transit' | 'Sold' | 'Reserved';
  location?: string;
  stock_count?: number;
  price?: number;
  special_price?: number;
  last_updated?: string;
}

export interface SavedConfiguration {
  id?: number;
  session_id: string;
  user_id?: string;
  vehicle_id: string;
  vehicle_name?: string;
  configuration: VehicleConfiguration;
  total_price?: number;
  monthly_payment?: number;
  created_at?: string;
  expires_at?: string;
}

export interface VehicleConfiguration {
  model: string;
  color: string;
  interior: string;
  wheels: string;
  packages: string[];
  options: string[];
  accessories: string[];
}

export interface FinanceCalculation {
  id?: number;
  vehicle_id: string;
  price: number;
  down_payment?: number;
  term_months: number;
  apr: number;
  monthly_payment: number;
  total_cost?: number;
  calculated_at?: string;
}

export interface TestDriveRequest {
  id?: number;
  lead_id?: number;
  name: string;
  email: string;
  phone: string;
  vehicle_id: string;
  vehicle_name?: string;
  preferred_date?: string;
  preferred_time?: string;
  dealer_location?: string;
  status?: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
  notes?: string;
  created_at?: string;
}

export interface AnalyticsEvent {
  id?: number;
  event_type: string;
  vehicle_id?: string;
  user_session_id?: string;
  page_url?: string;
  referrer?: string;
  user_agent?: string;
  metadata?: Record<string, any>;
  timestamp?: string;
}

// Webflow Collection Types
export interface WebflowVehicle {
  _id: string;
  name: string;
  slug: string;
  'hero-image'?: WebflowImage;
  'interior-image'?: WebflowImage;
  'exterior-image'?: WebflowImage;
  'feature-image'?: WebflowImage;
  'action-image'?: WebflowImage;
  'gallery-images'?: WebflowImage[];
  year?: number;
  price?: string;
  milage?: string;
  description?: string;
  color?: string;
  features?: string;
  'interior-features'?: string;
  'performance-description'?: string;
  'safety-features'?: string;
  'driving-experience'?: string;
  brand?: string;
  'vehicle-type'?: string[];
}

export interface WebflowImage {
  fileId: string;
  url: string;
  alt?: string;
}

export interface WebflowLead {
  _id?: string;
  name: string;
  email: string;
  phone?: string;
  'vehicle-interest'?: string;
  message?: string;
  'lead-status'?: string;
  'created-date'?: string;
}

export interface WebflowInventory {
  _id?: string;
  name: string;
  'vehicle-model': string;
  vin?: string;
  'availability-status'?: string;
  location?: string;
  'stock-count'?: number;
}

export interface WebflowSpecification {
  _id?: string;
  name: string;
  vehicle: string;
  'acceleration-0-60'?: string;
  'top-speed-mph'?: number;
  'quarter-mile'?: string;
  'range-miles'?: number;
  horsepower?: number;
  torque?: number;
  'engine-type'?: string;
  transmission?: string;
  'drag-coefficient'?: string;
  'weight-lbs'?: number;
}
