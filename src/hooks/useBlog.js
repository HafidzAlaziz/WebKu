import { useState, useCallback, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';

export const useBlog = () => {
    const [posts, setPosts] = useState([]);
    const [pendingPosts, setPendingPosts] = useState([]);
    const [myArticles, setMyArticles] = useState([]); // New state for user's own articles
    const [myArticlesCounts, setMyArticlesCounts] = useState({ approved: 0, rejected: 0, pending: 0, total: 0 });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch My Articles
    const fetchMyArticles = useCallback(async (userId) => {
        if (!userId) {
            setMyArticles([]);
            return;
        }
        try {
            const { data, error: fetchError } = await supabase
                .from('blog_posts')
                .select('*')
                .eq('author_id', userId)
                .order('created_at', { ascending: false });

            if (fetchError) throw fetchError;
            setMyArticles(data || []);
        } catch (err) {
            console.error('Error fetching user articles:', err);
        }
    }, []);

    // Fetch My Articles Count with detail
    const fetchMyArticlesCounts = useCallback(async (userId) => {
        if (!userId) {
            setMyArticlesCounts({ approved: 0, rejected: 0, pending: 0, total: 0 });
            return;
        }

        try {
            const { data, error: fetchError } = await supabase
                .from('blog_posts')
                .select('status')
                .eq('author_id', userId);

            if (fetchError) throw fetchError;

            const counts = (data || []).reduce((acc, post) => {
                acc[post.status] = (acc[post.status] || 0) + 1;
                acc.total += 1;
                return acc;
            }, { approved: 0, rejected: 0, pending: 0, total: 0 });

            setMyArticlesCounts(counts);
            return counts;
        } catch (err) {
            console.error('Error fetching my articles count:', err);
            return { approved: 0, rejected: 0, pending: 0, total: 0 };
        }
    }, []);


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
            const newPost = {
                ...postData,
                status: postData.status || 'pending',
                created_at: new Date().toISOString()
            };

            const { data, error: insertError } = await supabase
                .from('blog_posts')
                .insert([newPost])
                .select();

            if (insertError) throw insertError;

            // Optimistic update
            const insertedPost = data[0];
            if (insertedPost.status === 'approved') {
                setPosts(prev => [insertedPost, ...prev]);
            } else if (insertedPost.status === 'pending') {
                setPendingPosts(prev => [insertedPost, ...prev]);
            }

            // Always update user's own articles if applicable
            supabase.auth.getSession().then(({ data: { session } }) => {
                if (session?.user?.id === insertedPost.author_id) {
                    setMyArticles(prev => [insertedPost, ...prev]);
                    fetchMyArticlesCounts(session.user.id);
                }
            });

            return { success: true, data: insertedPost };
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

            const updatedPost = data[0];

            // Optimistic updates for all lists
            setPosts(prev => {
                if (updatedPost.status === 'approved') {
                    const filtered = prev.filter(p => p.id !== id);
                    return [updatedPost, ...filtered].sort((a, b) => new Date(b.date) - new Date(a.date));
                }
                return prev.filter(p => p.id !== id);
            });

            setPendingPosts(prev => {
                if (updatedPost.status === 'pending') {
                    const filtered = prev.filter(p => p.id !== id);
                    return [updatedPost, ...filtered].sort((a, b) => new Date(b.date) - new Date(a.date));
                }
                return prev.filter(p => p.id !== id);
            });

            setMyArticles(prev => prev.map(p => p.id === id ? updatedPost : p));

            // Refresh counts
            supabase.auth.getSession().then(({ data: { session } }) => {
                if (session?.user?.id) fetchMyArticlesCounts(session.user.id);
            });

            return { success: true, data: updatedPost };
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

            // Optimistic deletion
            setPosts(prev => prev.filter(p => p.id !== id));
            setPendingPosts(prev => prev.filter(p => p.id !== id));
            setMyArticles(prev => prev.filter(p => p.id !== id));

            supabase.auth.getSession().then(({ data: { session } }) => {
                if (session?.user?.id) fetchMyArticlesCounts(session.user.id);
            });

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
            const fileName = `${Math.random().toString(36).substring(2)} -${Date.now()}.${fileExt} `;
            const filePath = `blog / ${fileName} `;

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

    const incrementView = async (postId) => {
        try {
            // Get visitor_id from localStorage (consistent with useTracker)
            let visitorId = localStorage.getItem('visitor_id');
            if (!visitorId) {
                visitorId = 'v-' + Math.random().toString(36).substr(2, 9) + '-' + Date.now().toString(36);
                localStorage.setItem('visitor_id', visitorId);
            }

            const today = new Date().toISOString().split('T')[0];

            // Try to insert a unique view record
            const { error: viewError } = await supabase
                .from('blog_post_views')
                .insert([
                    { post_id: postId, visitor_id: visitorId, view_date: today }
                ]);

            if (viewError) {
                // If it fails due to unique constraint, it means already viewed today
                if (viewError.code === '23505') return { success: true, alreadyCounted: true };
                throw viewError;
            }

            // If insert was successful, increment the count in blog_posts
            const { error: updateError } = await supabase.rpc('increment_blog_views', { post_id: postId });

            // Fallback strategy if RPC is not available
            if (updateError) {
                const { data: post } = await supabase
                    .from('blog_posts')
                    .select('views')
                    .eq('id', postId)
                    .single();

                await supabase
                    .from('blog_posts')
                    .update({ views: (post?.views || 0) + 1 })
                    .eq('id', postId);
            }

            return { success: true };
        } catch (err) {
            console.error('Error incrementing view:', err);
            return { success: false, error: err.message };
        }
    };

    // Real-time subscription for my articles
    useEffect(() => {
        let subscription;
        let authListener;

        const setup = async (userId) => {
            if (!userId) {
                setMyArticles([]);
                setMyArticlesCounts({ approved: 0, rejected: 0, pending: 0, total: 0 });
                return;
            }

            // Initial fetch
            await fetchMyArticlesCounts(userId);
            await fetchMyArticles(userId);

            // Clean previous subscription if any
            if (subscription) {
                supabase.removeChannel(subscription);
            }

            subscription = supabase
                .channel(`my-blog-posts-${userId}`)
                .on('postgres_changes', {
                    event: '*',
                    schema: 'public',
                    table: 'blog_posts',
                    filter: `author_id=eq.${userId}`
                }, async (payload) => {
                    const { eventType, new: newRecord, old: oldRecord } = payload;

                    if (eventType === 'INSERT') {
                        setMyArticles(prev => {
                            if (prev.some(p => p.id === newRecord.id)) return prev;
                            return [newRecord, ...prev];
                        });
                    } else if (eventType === 'UPDATE') {
                        setMyArticles(prev => prev.map(p => p.id === newRecord.id ? newRecord : p));
                    } else if (eventType === 'DELETE') {
                        setMyArticles(prev => prev.filter(p => p.id !== oldRecord.id));
                    }

                    // Update counts when anything changes
                    await fetchMyArticlesCounts(userId);
                })
                .subscribe();
        };

        // Get initial session and setup
        const init = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setup(session?.user?.id);
        };

        init();

        // Listen for auth changes to re-setup
        const { data: { subscription: authSub } } = supabase.auth.onAuthStateChange((_event, session) => {
            setup(session?.user?.id);
        });
        authListener = authSub;

        return () => {
            if (subscription) supabase.removeChannel(subscription);
            if (authListener) authListener.unsubscribe();
        };
    }, [fetchMyArticlesCounts, fetchMyArticles]);

    // Real-time subscription for ALL blog posts (for Admins and public view)
    useEffect(() => {
        let subscription;

        const handlePayload = (payload) => {
            const { eventType, new: newRecord, old: oldRecord } = payload;

            if (eventType === 'INSERT') {
                if (newRecord.status === 'approved') {
                    setPosts(prev => {
                        if (prev.some(p => p.id === newRecord.id)) return prev;
                        return [newRecord, ...prev];
                    });
                } else if (newRecord.status === 'pending') {
                    setPendingPosts(prev => {
                        if (prev.some(p => p.id === newRecord.id)) return prev;
                        return [newRecord, ...prev];
                    });
                }
            } else if (eventType === 'UPDATE') {
                // Remove from both lists first, then re-add to the correct one
                setPosts(prev => prev.filter(p => p.id !== newRecord.id));
                setPendingPosts(prev => prev.filter(p => p.id !== newRecord.id));

                if (newRecord.status === 'approved') {
                    setPosts(prev => [newRecord, ...prev].sort((a, b) => new Date(b.date) - new Date(a.date)));
                } else if (newRecord.status === 'pending') {
                    setPendingPosts(prev => [newRecord, ...prev].sort((a, b) => new Date(b.date) - new Date(a.date)));
                }
            } else if (eventType === 'DELETE') {
                setPosts(prev => prev.filter(p => p.id !== oldRecord.id));
                setPendingPosts(prev => prev.filter(p => p.id !== oldRecord.id));
            }

            // Also refresh counts if the user is logged in
            supabase.auth.getSession().then(({ data: { session } }) => {
                if (session?.user?.id) {
                    fetchMyArticlesCounts(session.user.id);
                    fetchMyArticles(session.user.id);
                }
            });
        };

        const setupGlobalSubscription = () => {
            subscription = supabase
                .channel('global-blog-posts')
                .on('postgres_changes', {
                    event: '*',
                    schema: 'public',
                    table: 'blog_posts'
                }, (payload) => {
                    handlePayload(payload);
                })
                .subscribe();
        };

        setupGlobalSubscription();

        return () => {
            if (subscription) supabase.removeChannel(subscription);
        };
    }, [fetchMyArticlesCounts, fetchMyArticles]);

    return {
        posts,
        pendingPosts,
        myArticles,
        myArticlesCounts,
        loading,
        error,
        fetchPosts,
        fetchPendingPosts,
        fetchPostBySlug,
        addPost,
        updatePost,
        updatePostStatus,
        deletePost,
        uploadImage,
        incrementView,
        fetchMyArticlesCounts,
        fetchMyArticles
    };
};
