
-- Create insulin_logs table
CREATE TABLE public.insulin_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  insulin_type TEXT NOT NULL,
  insulin_name TEXT,
  dose_units NUMERIC NOT NULL,
  meal_context TEXT NOT NULL DEFAULT 'aucun',
  blood_glucose NUMERIC,
  notes TEXT
);

-- Enable Row Level Security
ALTER TABLE public.insulin_logs ENABLE ROW LEVEL SECURITY;

-- Public read access (consistent with food_scans)
CREATE POLICY "Allow public read insulin_logs"
  ON public.insulin_logs
  FOR SELECT
  USING (true);

-- Public insert access
CREATE POLICY "Allow public insert insulin_logs"
  ON public.insulin_logs
  FOR INSERT
  WITH CHECK (true);

-- Public delete access
CREATE POLICY "Allow public delete insulin_logs"
  ON public.insulin_logs
  FOR DELETE
  USING (true);
