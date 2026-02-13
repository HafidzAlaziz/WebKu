import { useState, useCallback, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export const usePortfolio = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchProjects = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const { data, error: fetchError } = await supabase
                .from('portfolio_projects')
                .select('*')
                .order('created_at', { ascending: false });

            if (fetchError) throw fetchError;
            setProjects(data || []);
        } catch (err) {
            console.error('Error fetching projects:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    const addProject = async (projectData) => {
        setLoading(true);
        try {
            const { data, error: insertError } = await supabase
                .from('portfolio_projects')
                .insert([projectData])
                .select();

            if (insertError) throw insertError;
            await fetchProjects();
            return { success: true, data };
        } catch (err) {
            console.error('Error adding project:', err);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    };

    const updateProject = async (id, updatedData) => {
        setLoading(true);
        try {
            const { data, error: updateError } = await supabase
                .from('portfolio_projects')
                .update(updatedData)
                .eq('id', id)
                .select();

            if (updateError) throw updateError;
            await fetchProjects();
            return { success: true, data };
        } catch (err) {
            console.error('Error updating project:', err);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    };

    const deleteProject = async (id) => {
        setLoading(true);
        try {
            const { error: deleteError } = await supabase
                .from('portfolio_projects')
                .delete()
                .eq('id', id);

            if (deleteError) throw deleteError;
            await fetchProjects();
            return { success: true };
        } catch (err) {
            console.error('Error deleting project:', err);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    };

    const uploadThumbnail = async (file) => {
        setLoading(true);
        try {
            // Create a unique file name
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
            const filePath = `thumbnails/${fileName}`;

            // Upload to Supabase Storage
            const { error: uploadError } = await supabase.storage
                .from('project-thumbnails')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('project-thumbnails')
                .getPublicUrl(filePath);

            return { success: true, url: publicUrl };
        } catch (err) {
            console.error('Error uploading image:', err);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    };

    const migrateProjects = async (projectsList) => {
        setLoading(true);
        try {
            const { data, error: migrationError } = await supabase
                .from('portfolio_projects')
                .upsert(projectsList, { onConflict: 'name_en' }) // Basic conflict resolution
                .select();

            if (migrationError) throw migrationError;
            await fetchProjects();
            return { success: true, count: data?.length };
        } catch (err) {
            console.error('Migration error:', err);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    };

    // Real-time subscription for portfolio projects
    useEffect(() => {
        const channel = supabase
            .channel('realtime_portfolio')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'portfolio_projects' }, payload => {
                const { eventType, new: newRecord, old: oldRecord } = payload;
                setProjects(prev => {
                    if (eventType === 'INSERT') {
                        return [newRecord, ...prev];
                    } else if (eventType === 'UPDATE') {
                        return prev.map(p => p.id === newRecord.id ? newRecord : p);
                    } else if (eventType === 'DELETE') {
                        return prev.filter(p => p.id !== oldRecord.id);
                    }
                    return prev;
                });
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    return {
        projects,
        loading,
        error,
        fetchProjects,
        addProject,
        updateProject,
        deleteProject,
        migrateProjects,
        uploadThumbnail
    };
};
