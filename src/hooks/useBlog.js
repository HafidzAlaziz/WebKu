import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';

export const useBlog = () => {
    const [posts, setPosts] = useState([]);
    const [pendingPosts, setPendingPosts] = useState([]); // New state for pending posts
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch only approved posts for public view
    const fetchPosts = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const { data, error: fetchError } = await supabase
                .from('blog_posts')
                .select('*')
                .eq('status', 'approved') // Only approved posts
                .order('date', { ascending: false });

            if (fetchError) throw fetchError;
            setPosts(data || []);
        } catch (err) {
            console.error('Error fetching blog posts:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch all posts (or specifically pending) for admin
    const fetchPendingPosts = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const { data, error: fetchError } = await supabase
                .from('blog_posts')
                .select('*')
                .eq('status', 'pending')
                .order('date', { ascending: false });

            if (fetchError) throw fetchError;
            setPendingPosts(data || []);
        } catch (err) {
            console.error('Error fetching pending posts:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchPostBySlug = useCallback(async (slug) => {
        setLoading(true);
        setError(null);
        try {
            const { data, error: fetchError } = await supabase
                .from('blog_posts')
                .select('*')
                .eq('slug', slug)
                .single();

            if (fetchError) throw fetchError;
            return data;
        } catch (err) {
            console.error('Error fetching blog post:', err);
            setError(err['message']);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const addPost = async (postData) => {
        setLoading(true);
        try {
            // Default status is 'pending' unless specified (e.g. by admin)
            const newPost = {
                ...postData,
                status: postData.status || 'pending'
            };

            const { data, error: insertError } = await supabase
                .from('blog_posts')
                .insert([newPost])
                .select();

            if (insertError) throw insertError;

            // If it was approved, refresh public list
            if (newPost.status === 'approved') {
                await fetchPosts();
            } else {
                // If pending, refresh pending list (if we are admin watching it)
                await fetchPendingPosts();
            }

            return { success: true, data };
        } catch (err) {
            console.error('Error adding blog post:', err);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    };

    const updatePost = async (id, updatedData) => {
        setLoading(true);
        try {
            const { data, error: updateError } = await supabase
                .from('blog_posts')
                .update(updatedData)
                .eq('id', id)
                .select();

            if (updateError) throw updateError;

            // Refresh both lists to be safe
            await fetchPosts();
            await fetchPendingPosts();

            return { success: true, data };
        } catch (err) {
            console.error('Error updating blog post:', err);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    };

    const updatePostStatus = async (id, status) => {
        return await updatePost(id, { status });
    };

    const deletePost = async (id) => {
        setLoading(true);
        try {
            const { error: deleteError } = await supabase
                .from('blog_posts')
                .delete()
                .eq('id', id);

            if (deleteError) throw deleteError;

            await fetchPosts();
            await fetchPendingPosts();

            return { success: true };
        } catch (err) {
            console.error('Error deleting blog post:', err);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    };

    const uploadImage = async (file) => {
        setLoading(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
            const filePath = `blog/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('blog-images')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('blog-images')
                .getPublicUrl(filePath);

            return { success: true, url: publicUrl };
        } catch (err) {
            console.error('Error uploading image:', err);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    };

    return {
        posts,
        pendingPosts,
        loading,
        error,
        fetchPosts,
        fetchPendingPosts, // Export this
        fetchPostBySlug,
        addPost,
        updatePost,
        updatePostStatus, // Export this
        deletePost,
        uploadImage
    };
};
