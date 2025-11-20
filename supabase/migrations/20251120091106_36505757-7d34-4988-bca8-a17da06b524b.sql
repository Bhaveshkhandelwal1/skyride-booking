-- Create enum for taxi tiers
CREATE TYPE public.taxi_tier AS ENUM ('basic', 'premium', 'elite');

-- Create enum for booking status
CREATE TYPE public.booking_status AS ENUM ('requested', 'craft_assigned', 'en_route', 'arrived', 'in_flight', 'completed', 'cancelled');

-- Create tiers table
CREATE TABLE public.tiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  tier_type taxi_tier NOT NULL UNIQUE,
  rate_per_km DECIMAL(10, 2) NOT NULL,
  speed_kmh INTEGER NOT NULL,
  description TEXT,
  capacity INTEGER DEFAULT 4,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bookings table
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pickup_lat DECIMAL(10, 8) NOT NULL,
  pickup_lng DECIMAL(11, 8) NOT NULL,
  destination_lat DECIMAL(10, 8) NOT NULL,
  destination_lng DECIMAL(11, 8) NOT NULL,
  distance_km DECIMAL(10, 2) NOT NULL,
  fare_amount DECIMAL(10, 2) NOT NULL,
  tier_type taxi_tier NOT NULL,
  status booking_status DEFAULT 'requested',
  craft_id TEXT,
  user_name TEXT,
  user_phone TEXT,
  estimated_arrival_minutes INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on bookings (public access for MVP, no auth required)
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert bookings (MVP - no auth)
CREATE POLICY "Anyone can create bookings"
  ON public.bookings
  FOR INSERT
  WITH CHECK (true);

-- Allow anyone to read bookings (MVP - no auth)
CREATE POLICY "Anyone can view bookings"
  ON public.bookings
  FOR SELECT
  USING (true);

-- Allow anyone to update bookings (MVP - no auth)
CREATE POLICY "Anyone can update bookings"
  ON public.bookings
  FOR UPDATE
  USING (true);

-- Enable RLS on tiers (read-only for users)
ALTER TABLE public.tiers ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read tiers
CREATE POLICY "Anyone can view tiers"
  ON public.tiers
  FOR SELECT
  USING (true);

-- Insert default tier data
INSERT INTO public.tiers (name, tier_type, rate_per_km, speed_kmh, description, capacity) VALUES
  ('Basic', 'basic', 50.00, 120, 'Low-cost, short-range craft for everyday commutes', 4),
  ('Premium', 'premium', 85.00, 180, 'Faster, quieter aircraft with enhanced comfort', 4),
  ('Elite', 'elite', 150.00, 250, 'High-speed executive craft with luxury amenities', 6);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for bookings updated_at
CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();