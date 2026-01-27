-- SQL to fix permissions for Supabase Storage bucket 'blog-images'

-- 1. Ensure the bucket is public (if not already)
-- Note: This is usually done in the Supabase UI, but some settings can be done via SQL if needed.

-- 2. Drop existing policies if they exist to avoid errors
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Public Upload" ON storage.objects;
DROP POLICY IF EXISTS "Public Update" ON storage.objects;
DROP POLICY IF EXISTS "Public Delete" ON storage.objects;

-- 3. Create policies for the 'blog-images' bucket
-- Policy: Allow anyone to view images
CREATE POLICY "Public Access" ON storage.objects FOR SELECT TO public USING (bucket_id = 'blog-images');

-- Policy: Allow anyone to upload images
CREATE POLICY "Public Upload" ON storage.objects FOR INSERT TO public WITH CHECK (bucket_id = 'blog-images');

-- Policy: Allow anyone to update images
CREATE POLICY "Public Update" ON storage.objects FOR UPDATE TO public USING (bucket_id = 'blog-images');

-- Policy: Allow anyone to delete images
CREATE POLICY "Public Delete" ON storage.objects FOR DELETE TO public USING (bucket_id = 'blog-images');
