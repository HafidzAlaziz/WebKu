import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export const useTracker = () => {
    const [stats, setStats] = useState({
        totalViews: 0,
        totalOrders: 0,
        viewsHistory: [],
        recentOrders: []
    });
    const [loading, setLoading] = useState(true);

    // Fetch data from Supabase
    const fetchStats = async (input = 7) => {
        // Determine days to look back based on input
        let days = 7;
        if (typeof input === 'number') {
            days = input;
        } else if (typeof input === 'object' && input !== null) {
            if (input.type === 'days') {
                days = input.value;
            } else if (input.type === 'month') {
                days = 30; // Approximation for month view to prevent crash
            } else if (input.type === 'year') {
                days = 365; // Approximation for year view to prevent crash
            }
        }
        try {
            // Get all events
            const { data, error } = await supabase
                .from('analytics_events')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching stats:', error);
                return;
            }

            // Process data locally (for simple analytics)
            const views = data.filter(e => e.event_type === 'view');
            const orders = data.filter(e => e.event_type === 'order');

            // Calculate history based on 'days' argument
            const history = [];
            for (let i = days - 1; i >= 0; i--) {
                const date = new Date();
                date.setDate(date.getDate() - i);
                const dateStr = date.toISOString().split('T')[0];

                // Format date (e.g., "Jan 1" or "01/01" depending on days)
                // Use raw date for localized formatting in component
                const displayDate = dateStr;

                const dayViews = views.filter(v => v.created_at.startsWith(dateStr)).length;
                const dayOrders = orders.filter(o => o.created_at.startsWith(dateStr)).length;

                history.push({
                    date: displayDate,
                    views: dayViews,
                    orders: dayOrders
                });
            }

            // Recent orders
            const recent = orders.slice(0, 5).map(o => ({
                id: o.id,
                date: new Date(o.created_at).toLocaleString(),
                details: o.details?.details || 'Order Button Click'
            }));

            setStats({
                totalViews: views.length,
                totalOrders: orders.length,
                viewsHistory: history,
                recentOrders: recent
            });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchStats();

        // Optional: Realtime subscription could go here
    }, []);

    const trackView = async () => {
        // Prevent duplicate views in dev hot-reload usually, but simple approach for now
        // Checking session storage to track 'unique' session views if needed, 
        // but for now we just track every hit as a view
        try {
            if (sessionStorage.getItem('view_tracked')) return;

            await supabase.from('analytics_events').insert([
                { event_type: 'view', details: { path: window.location.pathname } }
            ]);

            sessionStorage.setItem('view_tracked', 'true');
        } catch (err) {
            console.error('Error tracking view:', err);
        }
    };

    const trackOrder = async (details = "Order Button Click") => {
        try {
            await supabase.from('analytics_events').insert([
                { event_type: 'order', details: { details } }
            ]);
            // Refresh stats to show immediate update if on dashboard
            fetchStats();
        } catch (err) {
            console.error('Error tracking order:', err);
        }
    };

    return {
        stats,
        loading,
        trackView,
        trackOrder,
        refresh: fetchStats
    };
};
