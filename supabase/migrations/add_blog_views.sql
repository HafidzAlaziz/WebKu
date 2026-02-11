-- Migration to add views tracking
ALTER TABLE blog_posts 
ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0;

-- Create table to track unique views per device per day
CREATE TABLE IF NOT EXISTS blog_post_views (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
    visitor_id TEXT NOT NULL,
    view_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(post_id, visitor_id, view_date)
);

-- Index for faster checks
CREATE INDEX IF NOT EXISTS idx_blog_post_views_lookup ON blog_post_views(post_id, visitor_id, view_date);

-- Policy to allow anyone to insert a view (or we can use a function)
-- For simplicity, let's just use broad RLS for now or disable it for this table
ALTER TABLE blog_post_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous inserts for blog views"
ON blog_post_views FOR INSERT
WITH CHECK (true);

CREATE POLICY "Allow public read for blog views"
ON blog_post_views FOR SELECT
USING (true);

-- RPC function for atomic increment
CREATE OR REPLACE FUNCTION increment_blog_views(post_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE blog_posts
    SET views = COALESCE(views, 0) + 1
    WHERE id = post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
