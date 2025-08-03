// Automotive Schema for Millenium Platform
import { sqliteTable, text, int, real } from "drizzle-orm/sqlite-core";

// Leads table for CRM functionality
export const leadsTable = sqliteTable("leads", {
  id: int().primaryKey({ autoIncrement: true }),
  webflowId: text("webflow_id").unique(),
  name: text().notNull(),
  email: text().notNull(),
  phone: text(),
  vehicleInterest: text("vehicle_interest"),
  message: text(),
  status: text().default("New"), // 'New', 'Contacted', 'Qualified', 'Converted'
  source: text().default("website"),
  score: int().default(0),
  createdAt: text("created_at").default("CURRENT_TIMESTAMP"),
  updatedAt: text("updated_at").default("CURRENT_TIMESTAMP"),
  syncedAt: text("synced_at")
});

// Lead interactions for analytics and scoring
export const leadInteractionsTable = sqliteTable("lead_interactions", {
  id: int().primaryKey({ autoIncrement: true }),
  leadId: int("lead_id").notNull(),
  action: text().notNull(), // 'page_view', 'configure', 'download', 'inquiry', 'test_drive'
  vehicleId: text("vehicle_id"),
  vehicleName: text("vehicle_name"),
  metadata: text(), // JSON string for additional data
  scoreValue: int("score_value").default(1),
  timestamp: text().default("CURRENT_TIMESTAMP")
});

// Vehicle inventory cache
export const inventoryCacheTable = sqliteTable("inventory_cache", {
  id: int().primaryKey({ autoIncrement: true }),
  webflowId: text("webflow_id").unique(),
  vehicleModelId: text("vehicle_model_id").notNull(),
  vehicleName: text("vehicle_name"),
  vin: text().unique(),
  status: text(), // 'In Stock', 'In Transit', 'Sold', 'Reserved'
  location: text(),
  stockCount: int("stock_count").default(0),
  price: real(),
  specialPrice: real("special_price"),
  lastUpdated: text("last_updated").default("CURRENT_TIMESTAMP")
});

// Saved configurations
export const savedConfigurationsTable = sqliteTable("saved_configurations", {
  id: int().primaryKey({ autoIncrement: true }),
  sessionId: text("session_id").notNull(),
  userId: text("user_id"),
  vehicleId: text("vehicle_id").notNull(),
  vehicleName: text("vehicle_name"),
  configuration: text().notNull(), // JSON string
  totalPrice: real("total_price"),
  monthlyPayment: real("monthly_payment"),
  createdAt: text("created_at").default("CURRENT_TIMESTAMP"),
  expiresAt: text("expires_at")
});

// Finance calculations cache
export const financeCalculationsTable = sqliteTable("finance_calculations", {
  id: int().primaryKey({ autoIncrement: true }),
  vehicleId: text("vehicle_id").notNull(),
  price: real().notNull(),
  downPayment: real("down_payment"),
  termMonths: int("term_months").notNull(),
  apr: real().notNull(),
  monthlyPayment: real("monthly_payment").notNull(),
  totalCost: real("total_cost"),
  calculatedAt: text("calculated_at").default("CURRENT_TIMESTAMP")
});

// Test drive requests
export const testDriveRequestsTable = sqliteTable("test_drive_requests", {
  id: int().primaryKey({ autoIncrement: true }),
  leadId: int("lead_id"),
  name: text().notNull(),
  email: text().notNull(),
  phone: text().notNull(),
  vehicleId: text("vehicle_id").notNull(),
  vehicleName: text("vehicle_name"),
  preferredDate: text("preferred_date"),
  preferredTime: text("preferred_time"),
  dealerLocation: text("dealer_location"),
  status: text().default("Pending"), // 'Pending', 'Confirmed', 'Completed', 'Cancelled'
  notes: text(),
  createdAt: text("created_at").default("CURRENT_TIMESTAMP")
});

// Analytics events
export const analyticsEventsTable = sqliteTable("analytics_events", {
  id: int().primaryKey({ autoIncrement: true }),
  eventType: text("event_type").notNull(),
  vehicleId: text("vehicle_id"),
  userSessionId: text("user_session_id"),
  pageUrl: text("page_url"),
  referrer: text(),
  userAgent: text("user_agent"),
  metadata: text(), // JSON string
  timestamp: text().default("CURRENT_TIMESTAMP")
});