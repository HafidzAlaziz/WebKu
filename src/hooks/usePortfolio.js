import { useState, useCallback } from 'react';
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

    return {
        projects,
        loading,
        error,
        fetchProjects,
        addProject,
        updateProject,
        deleteProject,
        migrateProjects
    };
};
