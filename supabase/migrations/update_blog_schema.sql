-- Migration to add missing columns to blog_posts
ALTER TABLE blog_posts 
ADD COLUMN IF NOT EXISTS author_id UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending';

-- Update existing rows to have a status if they don't
UPDATE blog_posts SET status = 'approved' WHERE status IS NULL;

-- Add index for author_id for faster lookups in "My Articles"
CREATE INDEX IF NOT EXISTS idx_blog_posts_author_id ON blog_posts(author_id);
