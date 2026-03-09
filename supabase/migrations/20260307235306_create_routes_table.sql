/*
  # Create Routes and App Settings Tables

  1. New Tables
    - `routes`
      - `id` (uuid, primary key) - Unique route identifier
      - `user_id` (uuid, not null) - Links to auth.users
      - `name` (text, not null) - Route name (e.g., "To Work", "Home from Work")
      - `start_location_type` (text, not null) - Either 'coords' or 'city'
      - `start_location_label` (text, not null) - Display label for start
      - `start_latitude` (numeric) - Start latitude (optional, for coords)
      - `start_longitude` (numeric) - Start longitude (optional, for coords)
      - `start_city_name` (text) - Start city name (optional, for city type)
      - `end_location_type` (text, not null) - Either 'coords' or 'city'
      - `end_location_label` (text, not null) - Display label for end
      - `end_latitude` (numeric) - End latitude (optional, for coords)
      - `end_longitude` (numeric) - End longitude (optional, for coords)
      - `end_city_name` (text) - End city name (optional, for city type)
      - `commute_start_hour` (integer, not null) - Start hour of commute window (0-23)
      - `commute_end_hour` (integer, not null) - End hour of commute window (0-23)
      - `max_wind_speed` (numeric, default 30) - Route-specific wind threshold
      - `max_wind_gust` (numeric, default 50) - Route-specific gust threshold
      - `max_rain_probability` (numeric, default 40) - Route-specific rain prob threshold
      - `max_rain_intensity` (numeric, default 2) - Route-specific rain intensity threshold
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())
    
    - `app_settings`
      - `id` (uuid, primary key) - Same as user_id for simplicity
      - `user_id` (uuid, unique, not null) - Links to auth.users
      - `notification_time` (text, default '18:00')
      - `weekdays_only` (boolean, default true)
      - `morning_alert_enabled` (boolean, default true)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

  2. Security
    - Enable RLS on both tables
    - Users can only access their own routes
    - Users can only access their own app settings

  3. Indexes
    - Index on user_id for fast route lookups
    
  4. Migration Notes
    - This creates a new routes-based architecture
    - Existing user_settings will remain for backwards compatibility
    - App-level settings are now in app_settings table
    - Each route has its own location and commute window settings
*/

-- Create routes table
CREATE TABLE IF NOT EXISTS routes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name text NOT NULL,
  start_location_type text NOT NULL CHECK (start_location_type IN ('coords', 'city')),
  start_location_label text NOT NULL,
  start_latitude numeric,
  start_longitude numeric,
  start_city_name text,
  end_location_type text NOT NULL CHECK (end_location_type IN ('coords', 'city')),
  end_location_label text NOT NULL,
  end_latitude numeric,
  end_longitude numeric,
  end_city_name text,
  commute_start_hour integer NOT NULL CHECK (commute_start_hour >= 0 AND commute_start_hour <= 23),
  commute_end_hour integer NOT NULL CHECK (commute_end_hour >= 0 AND commute_end_hour <= 23),
  max_wind_speed numeric DEFAULT 30 NOT NULL,
  max_wind_gust numeric DEFAULT 50 NOT NULL,
  max_rain_probability numeric DEFAULT 40 NOT NULL,
  max_rain_intensity numeric DEFAULT 2 NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create app_settings table
CREATE TABLE IF NOT EXISTS app_settings (
  id uuid PRIMARY KEY,
  user_id uuid UNIQUE NOT NULL,
  notification_time text DEFAULT '18:00' NOT NULL,
  weekdays_only boolean DEFAULT true NOT NULL,
  morning_alert_enabled boolean DEFAULT true NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_routes_user_id ON routes(user_id);
CREATE INDEX IF NOT EXISTS idx_app_settings_user_id ON app_settings(user_id);

-- Enable RLS
ALTER TABLE routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;

-- Routes policies
CREATE POLICY "Users can view own routes"
  ON routes FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own routes"
  ON routes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own routes"
  ON routes FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own routes"
  ON routes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- App settings policies
CREATE POLICY "Users can view own app settings"
  ON app_settings FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own app settings"
  ON app_settings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own app settings"
  ON app_settings FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own app settings"
  ON app_settings FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);