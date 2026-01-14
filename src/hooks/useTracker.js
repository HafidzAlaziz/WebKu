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
        completedOrders: 0,
        completedRevenue: 0,
        pendingOrders: 0,
        pendingRevenue: 0,
        viewsHistory: [],
        recentOrders: [],
        allOrders: [],
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

    const getDeviceType = (ua) => {
        // 1. Android Mobile - Try to get specific model
        // Format often: ...; Model Build/...
        const androidMatch = ua.match(/Android.+;\s*([^;]+?)\s*Build\//);
        if (androidMatch && androidMatch[1]) {
            return androidMatch[1]; // e.g. "SM-G991B", "Pixel 6"
        }

        // 2. iOS
        if (/iPhone/i.test(ua)) return 'iPhone';
        if (/iPad/i.test(ua)) return 'iPad';

        // 3. Specific Brands (fallback if regex above misses but brand keyword exists)
        if (/Samsung|SM-/i.test(ua)) return 'Samsung Device';
        if (/Xiaomi|Redmi|Mi /i.test(ua)) return 'Xiaomi Device';
        if (/Oppo/i.test(ua)) return 'Oppo Device';
        if (/Vivo/i.test(ua)) return 'Vivo Device';

        // 4. General Mobile/Tablet
        if (/Android/i.test(ua)) return 'Android Device';
        if (/(tablet|playbook|silk)|(android(?!.*mobile))/i.test(ua)) return 'Tablet';
        if (/(mobi|ipod|phone|blackberry|opera mini|fennec|minimo|symbian|psp|series60|windows ce|nokia|treo|palm)/i.test(ua)) return 'Mobile';

        // 5. Desktop
        if (/Macintosh/i.test(ua)) return 'MacBook/iMac';
        if (/Windows/i.test(ua)) return 'Windows PC';
        if (/Linux/i.test(ua) && !/Android/i.test(ua)) return 'Linux PC';

        return "Desktop";
    };

    const getBrowserInfo = (ua) => {
        if (/Edg/i.test(ua)) return 'Edge';
        if (/Chrome/i.test(ua)) return 'Chrome';
        if (/Firefox/i.test(ua)) return 'Firefox';
        if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) return 'Safari';
        if (/Opera|OPR/i.test(ua)) return 'Opera';
        if (/MSIE|Trident/i.test(ua)) return 'IE';
        return "Browser Lain";
    };

    const getOSInfo = (ua) => {
        if (/Windows/i.test(ua)) return 'Windows';
        if (/Macintosh|Mac OS X/i.test(ua)) return 'macOS';
        if (/Linux/i.test(ua)) return 'Linux';
        if (/Android/i.test(ua)) return 'Android';
        if (/iOS|iPhone|iPad|iPod/i.test(ua)) return 'iOS';
        return "OS Lain";
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

            // 1. Fetch ALL from analytics_events (Views + Legacy Orders)
            const { data: aeData, error: aeError } = await supabase
                .from('analytics_events')
                .select('*')
                .order('created_at', { ascending: false });

            // 2. Fetch Orders from new orders table
            const { data: ordersData, error: ordersError } = await supabase
                .from('orders')
                .select('*')
                .order('created_at', { ascending: false });

            if (aeError) {
                console.error('Supabase analytics_events error:', aeError);
                throw aeError;
            }
            if (ordersError) {
                console.warn('Supabase orders table error (might not exist yet):', ordersError);
            }

            // orders table might not exist in some environments yet, handle gracefully
            const safeOrdersData = ordersData || [];

            const parsePrice = (val) => {
                if (val === undefined || val === null) return 0;
                if (typeof val === 'number') return val;
                const str = String(val);
                const numericStr = str.replace(/[^0-9]/g, '');
                return parseInt(numericStr) || 0;
            };

            const normalizeStatus = (raw) => {
                if (!raw) return 'pending';
                const s = String(raw).toLowerCase().trim();
                if (['selesai', 'done', 'success', 'completed'].includes(s)) return 'completed';
                if (['dibatalkan', 'cancel', 'failed', 'cancelled', 'dihapus'].includes(s)) return 'cancelled';
                if (['menunggu', 'waiting', 'pending', '', 'baru', 'proses'].includes(s)) return 'pending';
                return s;
            };

            // 3. Process and Merge Data
            const mergedOrdersMap = new Map();

            // First, process legacy orders from analytics_events
            (aeData || []).filter(e => e.event_type === 'order').forEach(o => {
                const rawDetails = (typeof o.details === 'object' && o.details !== null)
                    ? o.details
                    : { details: o.details };

                mergedOrdersMap.set(o.id, {
                    id: o.id,
                    event_type: 'order',
                    originTable: 'analytics_events',
                    created_at: o.created_at,
                    details: {
                        customerName: rawDetails.customerName || 'Unknown',
                        customerEmail: rawDetails.customerEmail || 'noemail@example.com',
                        customerPhone: rawDetails.customerPhone,
                        customerCompany: rawDetails.customerCompany,
                        websiteType: rawDetails.websiteType || rawDetails.orderType,
                        techStack: rawDetails.techStack,
                        message: rawDetails.message || rawDetails.details,
                        total: parsePrice(rawDetails.total),
                        status: normalizeStatus(rawDetails.status),
                        orderPackage: rawDetails.orderPackage || rawDetails.package,
                        orderType: rawDetails.orderType || rawDetails.websiteType,
                        ...rawDetails // keep original details for compatibility
                    }
                });
            });

            // Then, process and OVERWRITE/ADD with data from dedicated orders table
            safeOrdersData.forEach(o => {
                mergedOrdersMap.set(o.id, {
                    id: o.id,
                    event_type: 'order',
                    originTable: 'orders',
                    created_at: o.created_at,
                    details: {
                        customerName: o.customer_name,
                        customerEmail: o.customer_email,
                        customerPhone: o.customer_phone,
                        customerCompany: o.customer_company,
                        websiteType: o.website_type,
                        techStack: o.tech_stack,
                        message: o.message,
                        total: o.total,
                        status: normalizeStatus(o.status),
                        orderPackage: o.service_package,
                        orderType: o.website_type
                    }
                });
            });

            const orders = Array.from(mergedOrdersMap.values()).sort((a, b) =>
                new Date(b.created_at) - new Date(a.created_at)
            );

            const viewsData = (aeData || []).filter(e => e.event_type === 'view');
            const views = viewsData.map(v => ({ ...v, event_type: 'view' }));
            const data = [...views, ...orders];

            // Process unique visitors with details
            const processedVisitors = viewsData.map(v => {
                const details = v.details || {};
                const ua = details.user_agent;

                // Jika ada user_agent, parse ulang agar lebih spesifik (walaupun data lama)
                const device = ua ? getDeviceType(ua) : (details.device || 'Desktop');
                const browser = ua ? getBrowserInfo(ua) : (details.browser || 'Unknown');
                const os = ua ? getOSInfo(ua) : (details.os || 'Unknown');

                return {
                    id: v.id,
                    visitor_id: details.visitor_id,
                    path: details.path,
                    device: device,
                    browser: browser,
                    os: os,
                    created_at: v.created_at,
                    date: new Date(v.created_at).toLocaleString(i18n.language, {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                    })
                };
            }).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

            const config = getCurrencyConfig(i18n.language);

            // Calculate history with conversion
            const history = [];

            // Helper to format date keys for aggregation
            const getDayKey = (d) => d.toISOString().split('T')[0];
            const getMonthKey = (d) => d.toISOString().substring(0, 7); // YYYY-MM
            const getYearKey = (d) => d.getFullYear().toString();

            if (currentFilter === 'weekly' || (typeof input === 'object' && input.type === 'weekly') || input === '7d') {
                // Weekly: Last 7 Days (rolling window)
                for (let i = 6; i >= 0; i--) {
                    const date = new Date();
                    date.setDate(date.getDate() - i);
                    const dateStr = getDayKey(date);

                    const dayEvents = data.filter(e => e.created_at.startsWith(dateStr));
                    const uniqueDayVisitors = new Set(
                        dayEvents
                            .filter(e => e.event_type === 'view' && e.details?.visitor_id)
                            .map(e => e.details.visitor_id)
                    ).size;
                    // Fallback
                    const dayViews = uniqueDayVisitors || dayEvents.filter(e => e.event_type === 'view').length;
                    const dailyOrders = dayEvents.filter(e => e.event_type === 'order');

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
                        revenue: (dayRevenueIdr + dayCancelledRevenueIdr) / config.rate,
                        cancelledRevenue: dayCancelledRevenueIdr / config.rate
                    });
                }
            } else if (currentFilter === 'monthly' || (typeof input === 'object' && input.type === 'monthly') || input === '30d') {
                // Monthly: Jan - Dec of current year
                const currentYear = new Date().getFullYear();
                for (let i = 0; i < 12; i++) {
                    const dateStr = `${currentYear}-${(i + 1).toString().padStart(2, '0')}`;

                    const monthEvents = data.filter(e => e.created_at.startsWith(dateStr));

                    // Views
                    const uniqueMonthVisitors = new Set(
                        monthEvents
                            .filter(e => e.event_type === 'view' && e.details?.visitor_id)
                            .map(e => e.details.visitor_id)
                    ).size;
                    const monthViews = uniqueMonthVisitors || monthEvents.filter(e => e.event_type === 'view').length;

                    // Orders
                    const monthlyOrders = monthEvents.filter(e => e.event_type === 'order');

                    const monthRevenueIdr = monthlyOrders
                        .filter(o => o.details?.status !== 'cancelled')
                        .reduce((sum, o) => sum + parsePrice(o.details?.total), 0);

                    const monthCancelledRevenueIdr = monthlyOrders
                        .filter(o => o.details?.status === 'cancelled')
                        .reduce((sum, o) => sum + parsePrice(o.details?.total), 0);

                    history.push({
                        date: dateStr,
                        views: monthViews,
                        orders: monthlyOrders.length,
                        revenue: monthRevenueIdr / config.rate, // Treat cancelled as 0 income
                        cancelledRevenue: monthCancelledRevenueIdr / config.rate
                    });
                }
            } else if (currentFilter === 'yearly' || (typeof input === 'object' && input.type === 'yearly') || input === 'year') {
                // Yearly: 2024 - Current Year (Dynamic start if needed, but per request "20--" to now)
                // Let's start from 2024 as base or 2023? Assuming project started recently, 2024 is safe.
                // Or let's scan data to find min year?
                // Per user request "20-- sampai 20sekarang". Let's do 2024 to Current Year + 1 maybe?
                // Let's just do fixed range 2024 - Current Year for now, or last 5 years.
                // "20-- sampai 20sekarang" implies a range. Let's do 2024 to `currentYear`.

                const currentYear = new Date().getFullYear();
                const startYear = 2024; // Base year for the app

                for (let y = startYear; y <= currentYear; y++) {
                    const dateStr = y.toString();

                    const yearEvents = data.filter(e => e.created_at.startsWith(dateStr));

                    // Views
                    const uniqueYearVisitors = new Set(
                        yearEvents
                            .filter(e => e.event_type === 'view' && e.details?.visitor_id)
                            .map(e => e.details.visitor_id)
                    ).size;
                    const yearViews = uniqueYearVisitors || yearEvents.filter(e => e.event_type === 'view').length;

                    // Orders
                    const yearOrders = yearEvents.filter(e => e.event_type === 'order');

                    const yearRevenueIdr = yearOrders
                        .filter(o => o.details?.status !== 'cancelled')
                        .reduce((sum, o) => sum + parsePrice(o.details?.total), 0);

                    const yearCancelledRevenueIdr = yearOrders
                        .filter(o => o.details?.status === 'cancelled')
                        .reduce((sum, o) => sum + parsePrice(o.details?.total), 0);

                    history.push({
                        date: dateStr,
                        views: yearViews,
                        orders: yearOrders.length,
                        revenue: yearRevenueIdr / config.rate, // Treat cancelled as 0 income
                        cancelledRevenue: yearCancelledRevenueIdr / config.rate
                    });
                }
            } else {
                // Fallback: Last N Days (default 7)
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
                        revenue: (dayRevenueIdr + dayCancelledRevenueIdr) / config.rate,
                        cancelledRevenue: dayCancelledRevenueIdr / config.rate
                    });
                }
            }

            // Recent orders (with converted total)
            const mapOrder = (o) => {
                const orderDate = new Date(o.created_at);
                const isNewOrder = !o.details?.details ||
                    ['Order Button Click', 'Pesanan Baru', 'New Order'].includes(o.details?.details);

                const totalIdr = parsePrice(o.details?.total);

                // Format details
                let displayDetails = '-';
                if (isNewOrder) {
                    displayDetails = t('dashboard.recent_orders.new_order_label');
                } else if (o.details?.orderPackage && o.details?.orderType) {
                    const pkg = getLocalizedDetail('package', o.details?.orderPackage);
                    const type = getLocalizedDetail('type', o.details?.orderType);
                    displayDetails = `${t('dashboard.recent_orders.order_form_prefix')}: ${pkg} - ${type}`;
                } else if (typeof o.details?.details === 'string' && o.details?.details.startsWith('Order Form:')) {
                    // Backwards compatibility for old string format
                    const parts = o.details?.details.replace('Order Form: ', '').split(' - ');
                    if (parts.length === 2) {
                        const pkg = getLocalizedDetail('package', parts[0]);
                        const type = getLocalizedDetail('type', parts[1]);
                        displayDetails = `${t('dashboard.recent_orders.order_form_prefix')}: ${pkg} - ${type}`;
                    } else {
                        displayDetails = o.details?.details || '-';
                    }
                } else {
                    displayDetails = o.details?.details || '-';
                }

                return {
                    id: o.id,
                    created_at: o.created_at,
                    date: orderDate.toLocaleString(i18n.language, {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                    }),
                    details: displayDetails,
                    customerName: o.details?.customerName || '-',
                    customerEmail: o.details?.customerEmail,
                    customerPhone: o.details?.customerPhone,
                    customerCompany: o.details?.customerCompany,
                    websiteType: o.details?.orderType || o.details?.websiteType,
                    orderPackage: o.details?.orderPackage,
                    techStack: o.details?.techStack,
                    message: o.details?.message,
                    total: totalIdr / config.rate,
                    status: o.details?.status,
                    rawDetails: o.details,
                    fromOrdersTable: true,
                    originTable: o.originTable
                };
            };
            // 4. Calculate summary stats
            const pendingOrders = orders.filter(o => o.details?.status === 'pending');
            const completedOrders = orders.filter(o => o.details?.status === 'completed');
            const cancelledOrders = orders.filter(o => o.details?.status === 'cancelled');

            const pendingRevenueIdr = pendingOrders.reduce((sum, o) => sum + parsePrice(o.details?.total), 0);
            const completedRevenueIdr = completedOrders.reduce((sum, o) => sum + parsePrice(o.details?.total), 0);
            const cancelledRevenueIdr = cancelledOrders.reduce((sum, o) => sum + parsePrice(o.details?.total), 0);

            // Calculate Today's Unique Views
            const todayStr = new Date().toISOString().split('T')[0];
            const lastHistoryPoint = history[history.length - 1];
            const todayViewsCount = lastHistoryPoint?.views || 0;

            setStats({
                loading: false,
                totalViews: views.length,
                todayViews: todayViewsCount,
                totalOrders: orders.length,
                totalRevenue: (completedRevenueIdr + pendingRevenueIdr) / config.rate, // Gross Potential Revenue (excluding cancelled)
                netRevenue: completedRevenueIdr / config.rate, // Actual Cash In
                completedOrders: completedOrders.length,
                completedRevenue: completedRevenueIdr / config.rate,
                pendingOrders: pendingOrders.length,
                pendingRevenue: pendingRevenueIdr / config.rate,
                totalCancelled: cancelledOrders.length,
                cancelledRevenue: cancelledRevenueIdr / config.rate,
                viewsHistory: history,
                recentOrders: orders.slice(0, 10).map(mapOrder),
                allOrders: orders.map(mapOrder),
                visitors: processedVisitors,
                currency: config.currency,
                locale: config.locale,
                todayRevenue: lastHistoryPoint?.revenue || 0
            });
        } catch (err) {
            console.error('Fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // 1. Listen for new orders in the specialized table
        const ordersChannel = supabase
            .channel('realtime_orders')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'orders' }, payload => {
                console.log('Real-time notification: New order received!', payload);
                fetchStats();
            })
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'orders' }, payload => {
                fetchStats();
            })
            .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'orders' }, payload => {
                fetchStats();
            })
            .subscribe();

        // 2. Listen for new orders in the legacy analytics_events table
        const aeChannel = supabase
            .channel('realtime_ae')
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'analytics_events',
                filter: 'event_type=eq.order'
            }, payload => {
                console.log('Real-time notification: New legacy order received!', payload);
                fetchStats();
            })
            .on('postgres_changes', {
                event: 'UPDATE',
                schema: 'public',
                table: 'analytics_events',
                filter: 'event_type=eq.order'
            }, payload => {
                fetchStats();
            })
            .on('postgres_changes', {
                event: 'DELETE',
                schema: 'public',
                table: 'analytics_events',
                filter: 'event_type=eq.order'
            }, payload => {
                fetchStats();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(ordersChannel);
            supabase.removeChannel(aeChannel);
        };
    }, []);

    // Initial fetch
    useEffect(() => {
        fetchStats();
    }, [i18n.language]);

    // Helper function to parse User Agent
    const parseUserAgent = (ua) => {
        let device = 'Desktop';
        let browser = 'Unknown';
        let os = 'Unknown';

        // OS detection
        if (/Windows/i.test(ua)) os = 'Windows';
        else if (/Macintosh|Mac OS X/i.test(ua)) os = 'macOS';
        else if (/Linux/i.test(ua)) os = 'Linux';
        else if (/Android/i.test(ua)) os = 'Android';
        else if (/iOS|iPhone|iPad|iPod/i.test(ua)) os = 'iOS';

        // Device model detection (More specific)
        if (/iPhone/i.test(ua)) device = 'iPhone';
        else if (/iPad/i.test(ua)) device = 'iPad';
        else if (/Samsung|SM-/i.test(ua)) device = 'Samsung';
        else if (/Huawei/i.test(ua)) device = 'Huawei';
        else if (/Xiaomi|Redmi|Mi /i.test(ua)) device = 'Xiaomi';
        else if (/Oppo/i.test(ua)) device = 'Oppo';
        else if (/Vivo/i.test(ua)) device = 'Vivo';
        else if (/Macintosh/i.test(ua)) device = 'MacBook/iMac';
        else if (/Windows/i.test(ua)) device = 'Windows PC';
        else if (/Linux/i.test(ua) && !/Android/i.test(ua)) device = 'Linux PC';
        else if (/Android/i.test(ua)) device = 'Android Phone';
        else if (/(tablet|playbook|silk)|(android(?!.*mobile))/i.test(ua)) device = 'Tablet';
        else if (/(mobi|ipod|phone|blackberry|opera mini|fennec|minimo|symbian|psp|series60|windows ce|nokia|treo|palm)/i.test(ua)) device = 'Mobile';

        // Browser detection
        if (/Edg/i.test(ua)) browser = 'Edge';
        else if (/Chrome/i.test(ua)) browser = 'Chrome';
        else if (/Firefox/i.test(ua)) browser = 'Firefox';
        else if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) browser = 'Safari';
        else if (/Opera|OPR/i.test(ua)) browser = 'Opera';
        else if (/MSIE|Trident/i.test(ua)) browser = 'IE';

        return { device, browser, os };
    };

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

            // Kirim ke database dengan ID unik dan info perangkat
            const ua = navigator.userAgent;
            await supabase.from('analytics_events').insert([
                {
                    event_type: 'view',
                    details: {
                        path,
                        visitor_id: getVisitorId(),
                        device: getDeviceType(ua),
                        browser: getBrowserInfo(ua),
                        os: getOSInfo(ua),
                        user_agent: ua,
                        language: navigator.language,
                        screen: `${window.screen.width}x${window.screen.height}`,
                        referrer: document.referrer
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
            // Check if details is an object (from the order form) or just a string
            if (typeof details === 'object' && details !== null) {
                const orderData = {
                    customer_name: details.customerName || 'Unknown',
                    customer_email: details.customerEmail || 'noemail@example.com',
                    customer_phone: details.customerPhone,
                    customer_company: details.customerCompany,
                    service_package: details.orderPackage, // Use service_package column
                    website_type: details.websiteType,
                    tech_stack: details.techStack,
                    message: details.message,
                    total: parsePrice(details.total),
                    status: details.status || 'pending'
                };

                await supabase.from('orders').insert([orderData]);
            } else {
                // For simple button clicks, we can still track to orders table with minimal info
                await supabase.from('orders').insert([{
                    customer_name: 'Visitor',
                    customer_email: 'visitor@example.com',
                    message: typeof details === 'string' ? details : 'Order Button Click',
                    total: 0,
                    status: 'pending'
                }]);
            }
            fetchStats();
        } catch (err) {
            console.error('Error tracking order:', err);
        }
    };

    const deleteOrder = async (id, originTable = 'orders') => {
        try {
            // Attempt to delete from BOTH tables to ensure no "zombie" data remains
            // (If data was duplicated during migration, deleting only one source causes the other to reappear)

            // 1. Delete from orders table
            const { error: error1 } = await supabase
                .from('orders')
                .delete()
                .eq('id', id);

            // 2. Delete from analytics_events table (legacy)
            const { error: error2 } = await supabase
                .from('analytics_events')
                .delete()
                .eq('id', id)
                .eq('event_type', 'order'); // Safety check

            // If both failed, then we have a problem. If at least one worked, it's mostly fine.
            // But we should report error if the INTENDED table failed.
            if (originTable === 'orders' && error1) throw error1;
            if (originTable === 'analytics_events' && error2) throw error2;

            // If we are here, at least the primary deletion target was likely successful (or didn't exist)
            fetchStats();
            return { success: true };
        } catch (err) {
            console.error('Error deleting order:', err);
            return { success: false, error: err.message };
        }
    };

    const updateOrderStatus = async (id, status, currentDetails, originTable = 'orders') => {
        try {
            let error;
            if (originTable === 'analytics_events') {
                const newDetails = { ...currentDetails, status };
                const { error: err } = await supabase
                    .from('analytics_events')
                    .update({ details: newDetails })
                    .eq('id', id);
                error = err;
            } else {
                const { error: err } = await supabase
                    .from('orders')
                    .update({ status })
                    .eq('id', id);
                error = err;
            }

            if (error) throw error;
            fetchStats();
            return { success: true };
        } catch (err) {
            console.error('Error updating status:', err);
            return { success: false, error: err.message };
        }
    };

    const updateOrder = async (id, updatedDetails, originTable = 'orders') => {
        try {
            console.log('Attempting to update order:', id, 'in table:', originTable);

            let error;
            let data;

            if (originTable === 'analytics_events') {
                // If it's the legacy table, we update the entire details JSON
                const { data: d, error: err } = await supabase
                    .from('analytics_events')
                    .update({ details: updatedDetails })
                    .eq('id', id)
                    .select();
                data = d;
                error = err;
            } else {
                // Map the frontend structure back to table columns
                const orderData = {
                    customer_name: updatedDetails.customerName,
                    customer_email: updatedDetails.customerEmail,
                    customer_phone: updatedDetails.customerPhone || updatedDetails.customer_phone,
                    customer_company: updatedDetails.customerCompany || updatedDetails.customer_company,
                    service_package: updatedDetails.orderPackage || updatedDetails.service_package,
                    website_type: updatedDetails.websiteType || updatedDetails.website_type,
                    tech_stack: updatedDetails.techStack || updatedDetails.tech_stack,
                    message: updatedDetails.message,
                    total: parsePrice(updatedDetails.total),
                    status: updatedDetails.status
                };

                const { data: d, error: err } = await supabase
                    .from('orders')
                    .update(orderData)
                    .eq('id', id)
                    .select();
                data = d;
                error = err;
            }

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
