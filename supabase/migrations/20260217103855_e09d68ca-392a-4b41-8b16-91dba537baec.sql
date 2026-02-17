
-- Create table for food scan history
CREATE TABLE public.food_scans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  food_name TEXT NOT NULL,
  calories NUMERIC NOT NULL DEFAULT 0,
  carbs NUMERIC NOT NULL DEFAULT 0,
  protein NUMERIC NOT NULL DEFAULT 0,
  fat NUMERIC NOT NULL DEFAULT 0,
  fiber NUMERIC NOT NULL DEFAULT 0,
  glycemic_index INTEGER DEFAULT 0,
  photo_url TEXT,
  ai_description TEXT,
  scan_type TEXT NOT NULL DEFAULT 'photo', -- 'photo', 'barcode'
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS but allow public access (no auth yet)
ALTER TABLE public.food_scans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read food_scans"
  ON public.food_scans FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert food_scans"
  ON public.food_scans FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public delete food_scans"
  ON public.food_scans FOR DELETE
  USING (true);

-- Create storage bucket for food photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('food-photos', 'food-photos', true);

-- Allow public upload and read for food photos
CREATE POLICY "Public read food photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'food-photos');

CREATE POLICY "Public upload food photos"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'food-photos');
