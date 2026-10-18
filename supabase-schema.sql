-- ====================================================================
-- SKRIP SQL SUPABASE: RIWAYAT PESERTA TWIBBON LKMM-D 2026
-- Salin dan jalankan skrip ini di SQL Editor dashboard Supabase Anda.
-- ====================================================================

-- 1. Buat tabel participants untuk mencatat nama dan link foto peserta
CREATE TABLE IF NOT EXISTS public.participants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL DEFAULT 'Peserta LKMM-D',
  image_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Aktifkan Row Level Security (RLS) pada tabel participants
ALTER TABLE public.participants ENABLE ROW LEVEL SECURITY;

-- 3. Kebijakan RLS: Siapapun (publik) boleh membaca daftar peserta
CREATE POLICY "Public participants are viewable by everyone" 
ON public.participants
FOR SELECT 
USING (true);

-- 4. Kebijakan RLS: Siapapun (publik) boleh menambahkan data peserta saat unduh twibbon
CREATE POLICY "Public can insert participant" 
ON public.participants
FOR INSERT 
WITH CHECK (true);

-- ====================================================================
-- PENGATURAN STORAGE BUCKET 'twibbons'
-- ====================================================================

-- 5. Buat Storage Bucket publik bernama 'twibbons'
INSERT INTO storage.buckets (id, name, public)
VALUES ('twibbons', 'twibbons', true)
ON CONFLICT (id) DO NOTHING;

-- 6. Kebijakan Storage: Siapapun boleh melihat foto twibbon di bucket
CREATE POLICY "Public Access Twibbons"
ON storage.objects
FOR SELECT
USING (bucket_id = 'twibbons');

-- 7. Kebijakan Storage: Siapapun boleh mengunggah foto twibbon terkompresi ke bucket
CREATE POLICY "Public Upload Twibbons"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'twibbons');
