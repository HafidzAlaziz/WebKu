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
        if (/Android/i.test(ua)) {
            let model = '';
            const androidMatch = ua.match(/Android[^;]+;\s*([^;)]+)\s*(?:Build\/|\))/i);
            if (androidMatch && androidMatch[1]) {
                const rawModel = androidMatch[1].trim();
                if (rawModel.length > 2 && !/^\d+$/.test(rawModel)) {
                    model = rawModel;
                }
            }
            if (model) {
                if (model.startsWith('SM-')) return `Samsung ${model}`;
                if (model.startsWith('RMX')) return `Realme ${model}`;
                if (model.startsWith('CPH') || model.startsWith('PCH')) return `Oppo ${model}`;
                if (model.startsWith('M2') || model.match(/^Redmi|^Mi\s/i)) return `Xiaomi ${model}`;
                if (model.match(/^V\d{4}/)) return `Vivo ${model}`;
                if (model.startsWith('X') && /X\d{3}/.test(model)) return `Infinix ${model}`;
                if (model.match(/Pixel|Nexus/i)) return `Google ${model}`;
            }
            const brands = [
                { name: 'Samsung', regex: /Samsung|SM-/i },
                { name: 'Xiaomi', regex: /Xiaomi|Redmi|Mi\s/i },
                { name: 'Oppo', regex: /Oppo/i },
                { name: 'Vivo', regex: /Vivo/i },
                { name: 'Realme', regex: /Realme/i },
                { name: 'Infinix', regex: /Infinix/i },
                { name: 'Asus', regex: /Asus/i },
                { name: 'Lenovo', regex: /Lenovo/i },
                { name: 'Huawei', regex: /Huawei|Honor/i },
                { name: 'OnePlus', regex: /OnePlus/i },
                { name: 'Tecno', regex: /Tecno/i },
                { name: 'Itel', regex: /Itel/i },
                { name: 'Advan', regex: /Advan/i },
                { name: 'Evercoss', regex: /Evercoss/i },
                { name: 'Sony', regex: /Sony|Xperia/i },
                { name: 'HTC', regex: /HTC/i },
                { name: 'LG', regex: /LG/i },
                { name: 'Meizu', regex: /Meizu/i },
                { name: 'Nokia', regex: /Nokia/i },
                { name: 'Pixel', regex: /Pixel/i, prefix: 'Google' },
                { name: 'Nexus', regex: /Nexus/i, prefix: 'Google' }
            ];
            for (const brand of brands) {
                if (brand.regex.test(ua)) {
                    const prefix = brand.prefix || brand.name;
                    return model ? `${prefix} ${model}` : `HP ${prefix}`;
                }
            }
            return model ? model : 'Perangkat Android';
        }
        if (/iPhone/i.test(ua)) return 'iPhone';
        if (/iPad/i.test(ua)) return 'iPad';
        if (/Windows/i.test(ua)) {
            if (/Windows NT 10.0/i.test(ua)) return 'PC Windows 10/11';
            if (/Windows NT 6.3/i.test(ua)) return 'PC Windows 8.1';
            if (/Windows NT 6.2/i.test(ua)) return 'PC Windows 8';
            if (/Windows NT 6.1/i.test(ua)) return 'PC Windows 7';
            return 'PC Windows';
        }
        if (/Macintosh|Mac OS X/i.test(ua)) {
            const macVersion = ua.match(/Mac OS X (\d+)[._](\d+)/);
            if (macVersion) {
                const major = parseInt(macVersion[1]);
                const minor = parseInt(macVersion[2]);
                if (major >= 10 && minor >= 15) return 'Mac (macOS Catalina+)';
                if (major >= 10 && minor >= 12) return 'Mac (macOS Sierra+)';
            }
            return 'Mac (macOS)';
        }
        if (/Linux/i.test(ua)) {
            if (/Ubuntu/i.test(ua)) return 'PC Linux (Ubuntu)';
            if (/Fedora/i.test(ua)) return 'PC Linux (Fedora)';
            if (/Debian/i.test(ua)) return 'PC Linux (Debian)';
            return 'PC Linux';
        }
        if (/(tablet|playbook|silk)|(android(?!.*mobile))/i.test(ua)) return 'Tablet';
        if (/(mobi|ipod|phone|blackberry|opera mini|fennec|minimo|symbian|psp|series60|windows ce|nokia|treo|palm)/i.test(ua)) return 'Ponsel';
        return "Desktop";
    };

    const getBrowserInfo = (ua) => {
        if (/Edg/i.test(ua)) return 'Edge';
        if (/Chrome/i.test(ua)) return 'Chrome';
        if (/Firefox/i.test(ua)) return 'Firefox';
        if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) return 'Safari';
        if (/Opera|OPR/i.test(ua)) return 'Opera';
        if (/MSIE|Trident/i.test(ua)) return 'IE';
        if (/UCBrowser/i.test(ua)) return 'UC Browser';
        if (/Instagram/i.test(ua)) return 'Instagram In-App';
        return "Browser Lain";
    };

    const getOSInfo = (ua) => {
        if (/Android/i.test(ua)) return 'Android';
        if (/iOS|iPhone|iPad|iPod/i.test(ua)) return 'iOS';
        if (/Windows/i.test(ua)) {
            if (/Windows NT 10.0/i.test(ua)) return 'Windows 10/11';
            if (/Windows NT 6.3/i.test(ua)) return 'Windows 8.1';
            if (/Windows NT 6.2/i.test(ua)) return 'Windows 8';
            if (/Windows NT 6.1/i.test(ua)) return 'Windows 7';
            return 'Windows';
        }
        if (/Macintosh|Mac OS X/i.test(ua)) return 'macOS';
        if (/Linux/i.test(ua)) return 'Linux';
        return "OS Lain";
    };

    const fetchStats = async (input = 7) => {
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
            const { data: aeData, error: aeError } = await supabase
                .from('analytics_events')
                .select('*')
                .order('created_at', { ascending: false });

            const { data: ordersData, error: ordersError } = await supabase
                .from('orders')
                .select('*')
                .order('created_at', { ascending: false });

            if (aeError) {
                console.error('Supabase analytics_events error:', aeError);
                throw aeError;
            }
            const safeOrdersData = ordersData || [];

            const parsePriceLocal = (val) => {
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

            const mergedOrdersMap = new Map();
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
                        total: parsePriceLocal(rawDetails.total),
                        status: normalizeStatus(rawDetails.status),
                        orderPackage: rawDetails.orderPackage || rawDetails.package,
                        orderType: rawDetails.orderType || rawDetails.websiteType,
                        ...rawDetails
                    }
                });
            });

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

            const processedVisitors = viewsData.map(v => {
                const details = v.details || {};
                const ua = details.user_agent;
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
            const history = [];
            const getDayKey = (d) => d.toISOString().split('T')[0];

            if (currentFilter === 'weekly' || (typeof input === 'object' && input.type === 'weekly') || input === '7d') {
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
                    const dayViews = uniqueDayVisitors || dayEvents.filter(e => e.event_type === 'view').length;
                    const dailyOrders = dayEvents.filter(e => e.event_type === 'order');
                    const dayRevenueIdr = dailyOrders
                        .filter(o => o.details?.status !== 'cancelled')
                        .reduce((sum, o) => sum + parsePriceLocal(o.details?.total), 0);
                    const dayCancelledRevenueIdr = dailyOrders
                        .filter(o => o.details?.status === 'cancelled')
                        .reduce((sum, o) => sum + parsePriceLocal(o.details?.total), 0);
                    history.push({
                        date: dateStr,
                        views: dayViews,
                        orders: dailyOrders.length,
                        revenue: (dayRevenueIdr + dayCancelledRevenueIdr) / config.rate,
                        cancelledRevenue: dayCancelledRevenueIdr / config.rate
                    });
                }
            } else if (currentFilter === 'monthly' || (typeof input === 'object' && input.type === 'monthly') || input === '30d') {
                const currentYear = new Date().getFullYear();
                for (let i = 0; i < 12; i++) {
                    const dateStr = `${currentYear}-${(i + 1).toString().padStart(2, '0')}`;
                    const monthEvents = data.filter(e => e.created_at.startsWith(dateStr));
                    const uniqueMonthVisitors = new Set(
                        monthEvents
                            .filter(e => e.event_type === 'view' && e.details?.visitor_id)
                            .map(e => e.details.visitor_id)
                    ).size;
                    const monthViews = uniqueMonthVisitors || monthEvents.filter(e => e.event_type === 'view').length;
                    const monthlyOrders = monthEvents.filter(e => e.event_type === 'order');
                    const monthRevenueIdr = monthlyOrders
                        .filter(o => o.details?.status !== 'cancelled')
                        .reduce((sum, o) => sum + parsePriceLocal(o.details?.total), 0);
                    const monthCancelledRevenueIdr = monthlyOrders
                        .filter(o => o.details?.status === 'cancelled')
                        .reduce((sum, o) => sum + parsePriceLocal(o.details?.total), 0);
                    history.push({
                        date: dateStr,
                        views: monthViews,
                        orders: monthlyOrders.length,
                        revenue: monthRevenueIdr / config.rate,
                        cancelledRevenue: monthCancelledRevenueIdr / config.rate
                    });
                }
            } else if (currentFilter === 'yearly' || (typeof input === 'object' && input.type === 'yearly') || input === 'year') {
                const currentYear = new Date().getFullYear();
                const startYear = 2024;
                for (let y = startYear; y <= currentYear; y++) {
                    const dateStr = y.toString();
                    const yearEvents = data.filter(e => e.created_at.startsWith(dateStr));
                    const uniqueYearVisitors = new Set(
                        yearEvents
                            .filter(e => e.event_type === 'view' && e.details?.visitor_id)
                            .map(e => e.details.visitor_id)
                    ).size;
                    const yearViews = uniqueYearVisitors || yearEvents.filter(e => e.event_type === 'view').length;
                    const yearOrders = yearEvents.filter(e => e.event_type === 'order');
                    const yearRevenueIdr = yearOrders
                        .filter(o => o.details?.status !== 'cancelled')
                        .reduce((sum, o) => sum + parsePriceLocal(o.details?.total), 0);
                    const yearCancelledRevenueIdr = yearOrders
                        .filter(o => o.details?.status === 'cancelled')
                        .reduce((sum, o) => sum + parsePriceLocal(o.details?.total), 0);
                    history.push({
                        date: dateStr,
                        views: yearViews,
                        orders: yearOrders.length,
                        revenue: yearRevenueIdr / config.rate,
                        cancelledRevenue: yearCancelledRevenueIdr / config.rate
                    });
                }
            } else {
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
                    const dayViews = uniqueDayVisitors || dayEvents.filter(e => e.event_type === 'view').length;
                    const dailyOrders = dayEvents.filter(e => e.event_type === 'order');
                    const dayRevenueIdr = dailyOrders
                        .filter(o => o.details?.status !== 'cancelled')
                        .reduce((sum, o) => sum + parsePriceLocal(o.details?.total), 0);
                    const dayCancelledRevenueIdr = dailyOrders
                        .filter(o => o.details?.status === 'cancelled')
                        .reduce((sum, o) => sum + parsePriceLocal(o.details?.total), 0);
                    history.push({
                        date: dateStr,
                        views: dayViews,
                        orders: dailyOrders.length,
                        revenue: (dayRevenueIdr + dayCancelledRevenueIdr) / config.rate,
                        cancelledRevenue: dayCancelledRevenueIdr / config.rate
                    });
                }
            }

            const mapOrder = (o) => {
                const orderDate = new Date(o.created_at);
                const isNewOrder = !o.details?.details ||
                    ['Order Button Click', 'Pesanan Baru', 'New Order'].includes(o.details?.details);
                const totalIdr = parsePriceLocal(o.details?.total);
                let displayDetails = '-';
                if (isNewOrder) {
                    displayDetails = t('dashboard.recent_orders.new_order_label');
                } else if (o.details?.orderPackage && o.details?.orderType) {
                    const pkg = getLocalizedDetail('package', o.details?.orderPackage);
                    const type = getLocalizedDetail('type', o.details?.orderType);
                    displayDetails = `${t('dashboard.recent_orders.order_form_prefix')}: ${pkg} - ${type}`;
                } else if (typeof o.details?.details === 'string' && o.details?.details.startsWith('Order Form:')) {
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

            const pendingOrders = orders.filter(o => o.details?.status === 'pending');
            const completedOrders = orders.filter(o => o.details?.status === 'completed');
            const cancelledOrders = orders.filter(o => o.details?.status === 'cancelled');
            const pendingRevenueIdr = pendingOrders.reduce((sum, o) => sum + parsePriceLocal(o.details?.total), 0);
            const completedRevenueIdr = completedOrders.reduce((sum, o) => sum + parsePriceLocal(o.details?.total), 0);
            const cancelledRevenueIdr = cancelledOrders.reduce((sum, o) => sum + parsePriceLocal(o.details?.total), 0);
            const lastHistoryPoint = history[history.length - 1];
            const todayViewsCount = lastHistoryPoint?.views || 0;

            setStats({
                loading: false,
                totalViews: views.length,
                todayViews: todayViewsCount,
                totalOrders: orders.length,
                totalRevenue: (completedRevenueIdr + pendingRevenueIdr) / config.rate,
                netRevenue: completedRevenueIdr / config.rate,
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
        const ordersChannel = supabase
            .channel('realtime_orders')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'orders' }, payload => {
                fetchStats();
            })
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'orders' }, payload => {
                fetchStats();
            })
            .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'orders' }, payload => {
                fetchStats();
            })
            .subscribe();

        const aeChannel = supabase
            .channel('realtime_ae')
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'analytics_events',
                filter: 'event_type=eq.order'
            }, payload => {
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

    useEffect(() => {
        fetchStats();
    }, [i18n.language]);

    const trackView = async () => {
        try {
            const path = window.location.pathname;
            if (path.startsWith('/dashboard') || path.startsWith('/login')) return;

            const today = new Date().toISOString().split('T')[0];
            const storageKey = 'visitor_tracked_today';
            const lastTrackedDate = localStorage.getItem(storageKey);
            if (lastTrackedDate === today) return;

            localStorage.setItem(storageKey, today);
            const ua = navigator.userAgent;
            let finalDevice = getDeviceType(ua);

            if (navigator.userAgentData && navigator.userAgentData.getHighEntropyValues) {
                try {
                    const uaData = await navigator.userAgentData.getHighEntropyValues(['model', 'platform', 'platformVersion']);
                    if (uaData.model) {
                        let realModel = uaData.model.trim();
                        if (!/Samsung|Xiaomi|Oppo|Vivo|Realme|Infinix/i.test(realModel)) {
                            if (realModel.startsWith('SM-')) realModel = `Samsung ${realModel}`;
                            else if (realModel.startsWith('RMX')) realModel = `Realme ${realModel}`;
                            else if (realModel.startsWith('CPH') || realModel.startsWith('PCH')) realModel = `Oppo ${realModel}`;
                            else if (realModel.startsWith('V') && /\d{4}/.test(realModel)) realModel = `Vivo ${realModel}`;
                            else if (realModel.startsWith('X') && /\d{3}/.test(realModel)) realModel = `Infinix ${realModel}`;
                            else if (realModel.startsWith('M2')) realModel = `Xiaomi ${realModel}`;
                        }
                        if (realModel.length > 1 && realModel !== 'K') {
                            finalDevice = realModel;
                        }
                    }
                } catch (e) {
                    console.warn('❌ Client Hints failed:', e);
                }
            }

            await supabase.from('analytics_events').insert([
                {
                    event_type: 'view',
                    details: {
                        path,
                        visitor_id: getVisitorId(),
                        device: finalDevice,
                        browser: getBrowserInfo(ua),
                        os: getOSInfo(ua),
                        user_agent: ua,
                        language: navigator.language,
                        screen: `${window.screen.width}x${window.screen.height}`,
                        referrer: document.referrer
                    }
                }
            ]);

            Object.keys(localStorage).forEach(key => {
                if (key.startsWith('tracked_views_')) localStorage.removeItem(key);
            });
            localStorage.removeItem('last_view_date');
            sessionStorage.removeItem('view_tracked');
        } catch (err) {
            console.error('Error tracking view:', err);
        }
    };

    const trackOrder = async (details = "Order Button Click") => {
        try {
            if (typeof details === 'object' && details !== null) {
                const orderData = {
                    customer_name: details.customerName || 'Unknown',
                    customer_email: details.customerEmail || 'noemail@example.com',
                    customer_phone: details.customerPhone,
                    customer_company: details.customerCompany,
                    service_package: details.orderPackage,
                    website_type: details.websiteType,
                    tech_stack: details.techStack,
                    message: details.message,
                    total: parsePrice(details.total),
                    status: details.status || 'pending'
                };
                await supabase.from('orders').insert([orderData]);
            } else {
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
            const { error: error1 } = await supabase.from('orders').delete().eq('id', id);
            const { error: error2 } = await supabase.from('analytics_events').delete().eq('id', id).eq('event_type', 'order');
            if (originTable === 'orders' && error1) throw error1;
            if (originTable === 'analytics_events' && error2) throw error2;
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
                const { error: err } = await supabase.from('analytics_events').update({ details: newDetails }).eq('id', id);
                error = err;
            } else {
                const { error: err } = await supabase.from('orders').update({ status }).eq('id', id);
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
            let error;
            let data;
            if (originTable === 'analytics_events') {
                const { data: d, error: err } = await supabase.from('analytics_events').update({ details: updatedDetails }).eq('id', id).select();
                data = d;
                error = err;
            } else {
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
                const { data: d, error: err } = await supabase.from('orders').update(orderData).eq('id', id).select();
                data = d;
                error = err;
            }
            if (error) throw error;
            if (!data || data.length === 0) throw new Error('No rows updated');
            fetchStats();
            return { success: true };
        } catch (err) {
            console.error('Update error:', err);
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
