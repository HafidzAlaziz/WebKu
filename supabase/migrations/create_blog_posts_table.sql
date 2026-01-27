-- Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT NOT NULL,
    keywords TEXT,
    content TEXT NOT NULL,
    category TEXT NOT NULL,
    image TEXT,
    author TEXT NOT NULL,
    date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    translations JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_date ON blog_posts(date DESC);

-- Enable RLS
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public blog posts are viewable by everyone" ON blog_posts;
DROP POLICY IF EXISTS "Everyone can insert blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Everyone can update blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Everyone can delete blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Authenticated users can insert blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Authenticated users can update blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Authenticated users can delete blog posts" ON blog_posts;

-- Policy: Anyone can read published posts
CREATE POLICY "Public blog posts are viewable by everyone"
    ON blog_posts FOR SELECT
    USING (true);

-- Policy: Allow everyone to insert (Simplest for this project)
CREATE POLICY "Everyone can insert blog posts"
    ON blog_posts FOR INSERT
    WITH CHECK (true);

-- Policy: Allow everyone to update
CREATE POLICY "Everyone can update blog posts"
    ON blog_posts FOR UPDATE
    USING (true);

-- Policy: Allow everyone to delete
CREATE POLICY "Everyone can delete blog posts"
    ON blog_posts FOR DELETE
    USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_blog_posts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_blog_posts_updated_at_trigger ON blog_posts;
CREATE TRIGGER update_blog_posts_updated_at_trigger
    BEFORE UPDATE ON blog_posts
    FOR EACH ROW
    EXECUTE FUNCTION update_blog_posts_updated_at();
