CREATE TABLE `users_table` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`age` integer NOT NULL,
	`email` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_table_email_unique` ON `users_table` (`email`);--> statement-breakpoint
CREATE TABLE `analytics_events` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`event_type` text NOT NULL,
	`vehicle_id` text,
	`user_session_id` text,
	`page_url` text,
	`referrer` text,
	`user_agent` text,
	`metadata` text,
	`timestamp` text DEFAULT 'CURRENT_TIMESTAMP'
);
--> statement-breakpoint
CREATE TABLE `finance_calculations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`vehicle_id` text NOT NULL,
	`price` real NOT NULL,
	`down_payment` real,
	`term_months` integer NOT NULL,
	`apr` real NOT NULL,
	`monthly_payment` real NOT NULL,
	`total_cost` real,
	`calculated_at` text DEFAULT 'CURRENT_TIMESTAMP'
);
--> statement-breakpoint
CREATE TABLE `inventory_cache` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`webflow_id` text,
	`vehicle_model_id` text NOT NULL,
	`vehicle_name` text,
	`vin` text,
	`status` text,
	`location` text,
	`stock_count` integer DEFAULT 0,
	`price` real,
	`special_price` real,
	`last_updated` text DEFAULT 'CURRENT_TIMESTAMP'
);
--> statement-breakpoint
CREATE UNIQUE INDEX `inventory_cache_webflow_id_unique` ON `inventory_cache` (`webflow_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `inventory_cache_vin_unique` ON `inventory_cache` (`vin`);--> statement-breakpoint
CREATE TABLE `lead_interactions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`lead_id` integer NOT NULL,
	`action` text NOT NULL,
	`vehicle_id` text,
	`vehicle_name` text,
	`metadata` text,
	`score_value` integer DEFAULT 1,
	`timestamp` text DEFAULT 'CURRENT_TIMESTAMP'
);
--> statement-breakpoint
CREATE TABLE `leads` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`webflow_id` text,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text,
	`vehicle_interest` text,
	`message` text,
	`status` text DEFAULT 'New',
	`source` text DEFAULT 'website',
	`score` integer DEFAULT 0,
	`created_at` text DEFAULT 'CURRENT_TIMESTAMP',
	`updated_at` text DEFAULT 'CURRENT_TIMESTAMP',
	`synced_at` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `leads_webflow_id_unique` ON `leads` (`webflow_id`);--> statement-breakpoint
CREATE TABLE `saved_configurations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`session_id` text NOT NULL,
	`user_id` text,
	`vehicle_id` text NOT NULL,
	`vehicle_name` text,
	`configuration` text NOT NULL,
	`total_price` real,
	`monthly_payment` real,
	`created_at` text DEFAULT 'CURRENT_TIMESTAMP',
	`expires_at` text
);
--> statement-breakpoint
CREATE TABLE `test_drive_requests` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`lead_id` integer,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text NOT NULL,
	`vehicle_id` text NOT NULL,
	`vehicle_name` text,
	`preferred_date` text,
	`preferred_time` text,
	`dealer_location` text,
	`status` text DEFAULT 'Pending',
	`notes` text,
	`created_at` text DEFAULT 'CURRENT_TIMESTAMP'
);
