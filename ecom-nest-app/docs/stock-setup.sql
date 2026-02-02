-- =====================================================
-- Stock Module Database Setup
-- =====================================================
-- Run this SQL in your Supabase SQL Editor to set up
-- the stocks table and storage bucket for stock images
-- =====================================================

-- =====================================================
-- 1. Create stocks table
-- =====================================================

CREATE TABLE IF NOT EXISTS public.stocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,

  -- Ownership / relationships
  supplier_id UUID NULL,  -- Future: separate suppliers table

  -- Core product data
  title TEXT NOT NULL,
  description TEXT,
  sku TEXT,
  marketplace TEXT[] CHECK (
    marketplace <@ ARRAY['AMAZON','EBAY','TIKTOK','SHOPIFY','OTHER']::TEXT[]
  ),
  online_marketplace_url TEXT,

  -- Variation labels (optional)
  size_label TEXT,    -- e.g. '38 × 70 cm'
  color_label TEXT,   -- e.g. 'Blue, White'

  -- Stock status & quantity
  stock_status TEXT NOT NULL CHECK (stock_status IN ('DRAFT', 'IN_STOCK', 'OUT_OF_STOCK', 'DISCONTINUED', 'ARCHIVED')),
  quantity INTEGER DEFAULT 0,

  -- Pricing
  price NUMERIC(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'GBP',

  -- Images (single main image for now, extensible to multiple later)
  main_image_path TEXT,  -- Path/key in Supabase Storage bucket
  main_image_url TEXT,   -- Public URL cached for quick frontend use

  -- Metadata
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 2. Create indexes for performance
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_stocks_user_id ON public.stocks(user_id);
CREATE INDEX IF NOT EXISTS idx_stocks_user_marketplace ON public.stocks(user_id, marketplace);
CREATE INDEX IF NOT EXISTS idx_stocks_user_status ON public.stocks(user_id, stock_status);
CREATE INDEX IF NOT EXISTS idx_stocks_created_at ON public.stocks(created_at DESC);

-- =====================================================
-- 3. Enable Row Level Security (RLS)
-- =====================================================

ALTER TABLE public.stocks ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own stocks
CREATE POLICY "Users can view their own stocks"
  ON public.stocks
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own stocks
CREATE POLICY "Users can insert their own stocks"
  ON public.stocks
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own stocks
CREATE POLICY "Users can update their own stocks"
  ON public.stocks
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own stocks
CREATE POLICY "Users can delete their own stocks"
  ON public.stocks
  FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- 4. Create updated_at trigger
-- =====================================================

-- Create trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to stocks table
DROP TRIGGER IF EXISTS set_updated_at ON public.stocks;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.stocks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- 5. Create Storage Bucket for Stock Images
-- =====================================================
-- Note: This needs to be done via Supabase Dashboard or Storage API
-- Go to Storage > Create Bucket > Name: "stock-images" > Public: Yes
-- 
-- Or run this if you have storage admin access:
-- 
-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('stock-images', 'stock-images', true)
-- ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 6. Storage Policies for stock-images bucket
-- =====================================================
-- Note: After creating the bucket, set up these policies in Supabase Dashboard
-- or execute these statements:


DROP POLICY IF EXISTS "Users can upload stock images to their own folder" ON storage.objects;
CREATE POLICY "Users can upload stock images to their own folder"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'stock-images' AND
    (storage.foldername(name))[1] = 'user' AND
    (storage.foldername(name))[2] = auth.uid()::text
  );


DROP POLICY IF EXISTS "Users can update their own stock images" ON storage.objects;
CREATE POLICY "Users can update their own stock images"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'stock-images' AND
    (storage.foldername(name))[1] = 'user' AND
    (storage.foldername(name))[2] = auth.uid()::text
  );


DROP POLICY IF EXISTS "Users can delete their own stock images" ON storage.objects;
CREATE POLICY "Users can delete their own stock images"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'stock-images' AND
    (storage.foldername(name))[1] = 'user' AND
    (storage.foldername(name))[2] = auth.uid()::text
  );


DROP POLICY IF EXISTS "Anyone can view stock images" ON storage.objects;
CREATE POLICY "Anyone can view stock images"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'stock-images');

-- =====================================================
-- Setup Complete!
-- =====================================================
-- You can now:
-- 1. Create stock items via POST /stocks
-- 2. Upload images to the stock-images bucket
-- 3. List, update, and delete stocks
-- =====================================================
