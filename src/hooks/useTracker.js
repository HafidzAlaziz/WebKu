import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabaseClient';

export const useTracker = () => {
    const { t, i18n } = useTranslation();
    const [stats, setStats] = useState({
        totalViews: 0,
        todayViews: 0,
        totalOrders: 0,
        totalRevenue: 0,
        totalCancelled: 0,
        cancelledRevenue: 0,
        viewsHistory: [],
        recentOrders: [],
        currency: 'IDR',
        locale: 'id-ID'
    });
    const [loading, setLoading] = useState(true);

    const EXCHANGE_RATES = {
        'id': { rate: 1, currency: 'IDR', locale: 'id-ID' },
        'en': { rate: 15500, currency: 'USD', locale: 'en-US' },
        'ja': { rate: 105, currency: 'JPY', locale: 'ja-JP' },
        'es': { rate: 16800, currency: 'EUR', locale: 'es-ES' },
        'fr': { rate: 16800, currency: 'EUR', locale: 'fr-FR' }
    };

    const getCurrencyConfig = (lang) => EXCHANGE_RATES[lang] || EXCHANGE_RATES['en'];

    const parsePrice = (priceStr) => {
        if (!priceStr) return 0;
        if (typeof priceStr === 'number') return priceStr;
        // Remove "IDR", "Rp", dots, commas, and spaces
        const cleaned = priceStr.toString().replace(/[^\d]/g, '');
        return parseInt(cleaned, 10) || 0;
    };

    const getLocalizedDetail = (type, value) => {
        if (!value) return '-';
        const mapping = {
            'package': {
                'starter': 'package_starter',
                'professional': 'package_professional',
                'enterprise': 'package_enterprise'
            },
            'type': {
                'landing-page': 'type_landing',
                'company-profile': 'type_company',
                'ecommerce': 'type_ecommerce',
                'portfolio': 'type_portfolio',
                'umkm': 'type_umkm',
                'custom-system': 'type_custom',
                'other': 'type_other'
            }
        };

        const langKey = mapping[type]?.[value];
        if (!langKey) return value;

        const translated = t(`order_page.form.options.${langKey}`);
        // Remove price/description suffix like " - Rp 100rb"
        return translated.split(' - ')[0];
    };
    const getVisitorId = () => {
        let vid = localStorage.getItem('visitor_id');
        if (!vid) {
            vid = 'v-' + Math.random().toString(36).substr(2, 9) + '-' + Date.now().toString(36);
            localStorage.setItem('visitor_id', vid);
        }
        return vid;
    };

    // Fetch data from Supabase
    const fetchStats = async (input = 7) => {
        // Determine days to look back based on input
        let lookupDays = 7;
        let currentFilter = input;

        if (typeof input === 'number') {
            lookupDays = input;
        } else if (typeof input === 'object' && input !== null) {
            if (input.type === 'days') {
                lookupDays = input.value;
            } else if (input.type === 'month') {
                lookupDays = 31;
            } else if (input.type === 'year') {
                lookupDays = 365;
            }
        }

        try {
            console.log('Fetching stats from Supabase...');
            // Get all events to ensure we have the latest data for all calculations
            const { data, error } = await supabase
                .from('analytics_events')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Supabase error:', error);
                throw error;
            }

            console.log('Data received from Supabase:', data?.length || 0, 'rows');
            // Process data locally
            const views = data.filter(e => e.event_type === 'view');
            const orders = data.filter(e => e.event_type === 'order');

            const parsePrice = (val) => {
                if (!val) return 0;
                if (typeof val === 'number') return val;
                const numericStr = val.toString().replace(/[^0-9]/g, '');
                return parseInt(numericStr) || 0;
            };

            const config = getCurrencyConfig(i18n.language);

            // Calculate history with conversion
            const history = [];
            for (let i = lookupDays - 1; i >= 0; i--) {
                const date = new Date();
                date.setDate(date.getDate() - i);
                const dateStr = date.toISOString().split('T')[0];

                const dayEvents = data.filter(e => e.created_at.startsWith(dateStr));
                const uniqueDayVisitors = new Set(
                    dayEvents
                        .filter(e => e.event_type === 'view' && e.details?.visitor_id)
                        .map(e => e.details.visitor_id)
                ).size;

                // Fallback to legacy count if visitor_id is missing for older data
                const dayViews = uniqueDayVisitors || dayEvents.filter(e => e.event_type === 'view').length;

                const dailyOrders = dayEvents.filter(e => e.event_type === 'order');

                // Convert revenue to active currency
                const dayRevenueIdr = dailyOrders
                    .filter(o => o.details?.status !== 'cancelled')
                    .reduce((sum, o) => sum + parsePrice(o.details?.total), 0);

                const dayCancelledRevenueIdr = dailyOrders
                    .filter(o => o.details?.status === 'cancelled')
                    .reduce((sum, o) => sum + parsePrice(o.details?.total), 0);

                history.push({
                    date: dateStr,
                    views: dayViews,
                    orders: dailyOrders.length,
                    revenue: dayRevenueIdr / config.rate,
                    cancelledRevenue: (dayCancelledRevenueIdr / config.rate) * -1
                });
            }

            // Recent orders (with converted total)
            const recent = orders.slice(0, 10).map(o => {
                const orderDate = new Date(o.created_at);
                const isNewOrder = !o.details?.details ||
                    ['Order Button Click', 'Pesanan Baru', 'New Order'].includes(o.details.details);

                const totalIdr = parsePrice(o.details?.total);

                // Format details
                let displayDetails = '-';
                if (isNewOrder) {
                    displayDetails = t('dashboard.recent_orders.new_order_label');
                } else if (o.details.orderPackage && o.details.orderType) {
                    const pkg = getLocalizedDetail('package', o.details.orderPackage);
                    const type = getLocalizedDetail('type', o.details.orderType);
                    displayDetails = `${t('dashboard.recent_orders.order_form_prefix')}: ${pkg} - ${type}`;
                } else if (typeof o.details.details === 'string' && o.details.details.startsWith('Order Form:')) {
                    // Backwards compatibility for old string format
                    const parts = o.details.details.replace('Order Form: ', '').split(' - ');
                    if (parts.length === 2) {
                        const pkg = getLocalizedDetail('package', parts[0]);
                        const type = getLocalizedDetail('type', parts[1]);
                        displayDetails = `${t('dashboard.recent_orders.order_form_prefix')}: ${pkg} - ${type}`;
                    } else {
                        displayDetails = o.details.details;
                    }
                } else {
                    displayDetails = o.details.details || '-';
                }

                return {
                    id: o.id,
                    date: orderDate.toLocaleString(i18n.language, {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                    }),
                    details: displayDetails,
                    customerName: o.details?.customerName || '-',
                    total: totalIdr / config.rate,
                    status: o.details?.status || 'pending',
                    rawDetails: o.details
                };
            });

            // Calculate totals with conversion
            const activeOrders = orders.filter(o => o.details?.status !== 'cancelled');
            const cancelledOrders = orders.filter(o => o.details?.status === 'cancelled');

            const totalRevenueIdr = activeOrders.reduce((sum, o) => sum + parsePrice(o.details?.total), 0);
            const cancelledRevenueIdr = cancelledOrders.reduce((sum, o) => sum + parsePrice(o.details?.total), 0);

            // Calculate Today's Unique Views
            const todayStr = new Date().toISOString().split('T')[0];
            const todayViewsCount = new Set(
                views
                    .filter(e => e.created_at.split('T')[0] === todayStr && e.details?.visitor_id)
                    .map(e => e.details.visitor_id)
            ).size || views.filter(e => e.created_at.split('T')[0] === todayStr).length;

            setStats({
                totalViews: views.length,
                todayViews: todayViewsCount,
                totalOrders: orders.length,
                totalRevenue: totalRevenueIdr / config.rate,
                totalCancelled: cancelledOrders.length,
                cancelledRevenue: cancelledRevenueIdr / config.rate,
                viewsHistory: history,
                recentOrders: recent,
                currency: config.currency,
                locale: config.locale
            });
        } catch (err) {
            console.error('Fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, [i18n.language]);

    const trackView = async () => {
        try {
            const path = window.location.pathname;
            // Jangan hitung views untuk halaman dashboard atau login
            if (path.startsWith('/dashboard') || path.startsWith('/login')) {
                return;
            }

            const today = new Date().toISOString().split('T')[0];
            const storageKey = 'visitor_tracked_today';

            // Cek apakah sudah dilacak hari ini
            const lastTrackedDate = localStorage.getItem(storageKey);

            if (lastTrackedDate === today) {
                // Sudah dihitung hari ini, abaikan secara visual tapi biarkan ID tetap konsisten
                return;
            }

            // Simpan tanggal hari ini ke localStorage SEGERA (sync)
            localStorage.setItem(storageKey, today);

            // Kirim ke database dengan ID unik
            await supabase.from('analytics_events').insert([
                {
                    event_type: 'view',
                    details: {
                        path,
                        visitor_id: getVisitorId()
                    }
                }
            ]);

            // Bersihkan sisa-sisa key lama jika ada
            Object.keys(localStorage).forEach(key => {
                if (key.startsWith('tracked_views_')) {
                    localStorage.removeItem(key);
                }
            });
            localStorage.removeItem('last_view_date');
            sessionStorage.removeItem('view_tracked');
        } catch (err) {
            console.error('Error tracking view:', err);
        }
    };

    const trackOrder = async (details = "Order Button Click") => {
        try {
            await supabase.from('analytics_events').insert([
                {
                    event_type: 'order',
                    details: typeof details === 'object' ? { ...details, status: 'pending' } : { details, status: 'pending' }
                }
            ]);
            fetchStats();
        } catch (err) {
            console.error('Error tracking order:', err);
        }
    };

    const deleteOrder = async (id) => {
        try {
            const { error } = await supabase
                .from('analytics_events')
                .delete()
                .eq('id', id);

            if (error) throw error;
            fetchStats();
            return { success: true };
        } catch (err) {
            console.error('Error deleting order:', err);
            return { success: false, error: err.message };
        }
    };

    const updateOrderStatus = async (id, status, currentDetails) => {
        try {
            const { error } = await supabase
                .from('analytics_events')
                .update({
                    details: { ...currentDetails, status }
                })
                .eq('id', id);

            if (error) throw error;
            fetchStats();
            return { success: true };
        } catch (err) {
            console.error('Error updating status:', err);
            return { success: false, error: err.message };
        }
    };

    const updateOrder = async (id, updatedDetails) => {
        try {
            console.log('Attempting to update order:', id);
            const { data, error } = await supabase
                .from('analytics_events')
                .update({
                    details: updatedDetails
                })
                .eq('id', id)
                .select();

            if (error) {
                console.error('Supabase update error:', error);
                return { success: false, error: error.message };
            }

            if (!data || data.length === 0) {
                console.warn('Update successful but no rows affected (check ID type/existence)');
                return { success: false, error: 'No rows updated. Verify ID existence.' };
            }

            console.log('Order updated successfully:', data);
            fetchStats();
            return { success: true };
        } catch (err) {
            console.error('Unexpected update error:', err);
            return { success: false, error: err.message };
        }
    };

    return {
        stats,
        loading,
        trackView,
        trackOrder,
        deleteOrder,
        updateOrderStatus,
        updateOrder,
        refresh: fetchStats
    };
};
