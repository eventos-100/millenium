-- migrations/001_init.sql
-- Initial schema for automotive website

-- Leads table for CRM functionality
CREATE TABLE IF NOT EXISTS leads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  webflow_id TEXT UNIQUE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  vehicle_interest TEXT,
  message TEXT,
  status TEXT DEFAULT 'New' CHECK (status IN ('New', 'Contacted', 'Qualified', 'Converted')),
  source TEXT DEFAULT 'website',
  score INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  synced_at DATETIME
);

-- Lead interactions for analytics and scoring
CREATE TABLE IF NOT EXISTS lead_interactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lead_id INTEGER NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('page_view', 'configure', 'download', 'inquiry', 'test_drive')),
  vehicle_id TEXT,
  vehicle_name TEXT,
  metadata TEXT, -- JSON string for additional data
  score_value INTEGER DEFAULT 1,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE
);

-- Vehicle inventory cache
CREATE TABLE IF NOT EXISTS inventory_cache (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  webflow_id TEXT UNIQUE,
  vehicle_model_id TEXT NOT NULL,
  vehicle_name TEXT,
  vin TEXT UNIQUE,
  status TEXT CHECK (status IN ('In Stock', 'In Transit', 'Sold', 'Reserved')),
  location TEXT,
  stock_count INTEGER DEFAULT 0,
  price DECIMAL(10,2),
  special_price DECIMAL(10,2),
  last_updated DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Saved configurations
CREATE TABLE IF NOT EXISTS saved_configurations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT NOT NULL,
  user_id TEXT,
  vehicle_id TEXT NOT NULL,
  vehicle_name TEXT,
  configuration TEXT NOT NULL, -- JSON string
  total_price DECIMAL(10,2),
  monthly_payment DECIMAL(10,2),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  expires_at DATETIME
);

-- Finance calculations cache
CREATE TABLE IF NOT EXISTS finance_calculations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  vehicle_id TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  down_payment DECIMAL(10,2),
  term_months INTEGER NOT NULL,
  apr DECIMAL(5,2) NOT NULL,
  monthly_payment DECIMAL(10,2) NOT NULL,
  total_cost DECIMAL(10,2),
  calculated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Test drive requests
CREATE TABLE IF NOT EXISTS test_drive_requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lead_id INTEGER,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  vehicle_id TEXT NOT NULL,
  vehicle_name TEXT,
  preferred_date DATE,
  preferred_time TEXT,
  dealer_location TEXT,
  status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Confirmed', 'Completed', 'Cancelled')),
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE SET NULL
);

-- Analytics events
CREATE TABLE IF NOT EXISTS analytics_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_type TEXT NOT NULL,
  vehicle_id TEXT,
  user_session_id TEXT,
  page_url TEXT,
  referrer TEXT,
  user_agent TEXT,
  metadata TEXT, -- JSON string
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_created ON leads(created_at);

CREATE INDEX idx_interactions_lead ON lead_interactions(lead_id);
CREATE INDEX idx_interactions_action ON lead_interactions(action);
CREATE INDEX idx_interactions_timestamp ON lead_interactions(timestamp);

CREATE INDEX idx_inventory_status ON inventory_cache(status);
CREATE INDEX idx_inventory_vehicle ON inventory_cache(vehicle_model_id);

CREATE INDEX idx_configs_session ON saved_configurations(session_id);
CREATE INDEX idx_configs_user ON saved_configurations(user_id);
CREATE INDEX idx_configs_expires ON saved_configurations(expires_at);

CREATE INDEX idx_test_drives_status ON test_drive_requests(status);
CREATE INDEX idx_test_drives_date ON test_drive_requests(preferred_date);

CREATE INDEX idx_analytics_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_timestamp ON analytics_events(timestamp);

-- Create triggers for updated_at
CREATE TRIGGER update_leads_timestamp 
AFTER UPDATE ON leads
BEGIN
  UPDATE leads SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER update_inventory_timestamp 
AFTER UPDATE ON inventory_cache
BEGIN
  UPDATE inventory_cache SET last_updated = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;
