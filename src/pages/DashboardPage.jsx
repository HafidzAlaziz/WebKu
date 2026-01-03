import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    BarChart3,
    Users,
    ShoppingCart,
    TrendingUp,
    Clock,
    AlertCircle,
    RefreshCcw
} from 'lucide-react';
import { useTracker } from '../hooks/useTracker';
import TrafficChart from '../components/TrafficChart';
import Navbar from '../components/Navbar';
import { useTranslation } from 'react-i18next';

const DashboardPage = () => {
    const { t } = useTranslation();
    const { stats, loading, refresh } = useTracker();

    // Filter State
    const [filterType, setFilterType] = useState('7d'); // 7d, 30d, month, year
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    const refreshData = async () => {
        setIsRefreshing(true);
        let filter = { type: 'days', value: 7 };

        if (filterType === '7d') filter = { type: 'days', value: 7 };
        else if (filterType === '30d') filter = { type: 'days', value: 30 };
        else if (filterType === 'month') filter = { type: 'month', value: { year: selectedYear, month: selectedMonth } };
        else if (filterType === 'year') filter = { type: 'year', value: selectedYear };

        // Force chart re-render by updating key
        setRefreshKey(prev => prev + 1);

        await refresh(filter);

        // Add a small delay for visual feedback if it's too fast
        setTimeout(() => setIsRefreshing(false), 500);
    };

    useEffect(() => {
        refreshData();
        const interval = setInterval(refreshData, 30000);
        return () => clearInterval(interval);
    }, [filterType, selectedYear, selectedMonth]);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-24 pb-12 px-6">
                <div className="container mx-auto max-w-6xl">

                    {/* Header */}
                    <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-10 gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                                {t('dashboard.header.title')}
                            </h1>
                            <p className="text-slate-600 dark:text-slate-400">
                                {t('dashboard.header.subtitle')}
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-2 items-center">
                            {/* Filter Type Select */}
                            <select
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-sm rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="7d">Last 7 Days</option>
                                <option value="30d">Last 30 Days</option>
                                <option value="month">Specific Month</option>
                                <option value="year">Specific Year</option>
                            </select>

                            {/* Year Select (Visible for Month/Year modes) */}
                            {(filterType === 'month' || filterType === 'year') && (
                                <select
                                    value={selectedYear}
                                    onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                                    className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-sm rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(year => (
                                        <option key={year} value={year}>{year}</option>
                                    ))}
                                </select>
                            )}

                            {/* Month Select (Visible for Month mode) */}
                            {filterType === 'month' && (
                                <select
                                    value={selectedMonth}
                                    onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                                    className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-sm rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((m, i) => (
                                        <option key={i} value={i}>{m}</option>
                                    ))}
                                </select>
                            )}

                            <button
                                onClick={() => refreshData()}
                                disabled={isRefreshing}
                                className={`px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors flex items-center gap-2 ${isRefreshing ? 'opacity-75 cursor-not-allowed' : ''}`}
                            >
                                <RefreshCcw size={18} className={isRefreshing ? 'animate-spin' : ''} />
                                <span className="hidden sm:inline">
                                    {isRefreshing ? t('dashboard.actions.refreshing') || 'Refreshing...' : t('dashboard.actions.refresh')}
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* Content Wrapper for Refresh Animation */}
                    <div className={`transition-opacity duration-300 ${isRefreshing ? 'opacity-50' : 'opacity-100'}`}>
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                            {/* Total Views */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-blue-600 dark:text-blue-400">
                                        <Users size={24} />
                                    </div>
                                    <span className="text-xs font-semibold text-green-500 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">
                                        {t('dashboard.stats.live')}
                                    </span>
                                </div>
                                <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                                    {stats.totalViews}
                                </h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    {t('dashboard.stats.total_views')}
                                </p>
                            </motion.div>

                            {/* Total Orders */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl text-purple-600 dark:text-purple-400">
                                        <ShoppingCart size={24} />
                                    </div>
                                </div>
                                <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                                    {stats.totalOrders}
                                </h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    {t('dashboard.stats.total_orders')}
                                </p>
                            </motion.div>

                            {/* Conversion Rate */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl text-amber-600 dark:text-amber-400">
                                        <BarChart3 size={24} />
                                    </div>
                                </div>
                                <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                                    {stats.totalViews > 0
                                        ? ((stats.totalOrders / stats.totalViews) * 100).toFixed(1)
                                        : 0
                                    }%
                                </h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    {t('dashboard.stats.conversion_rate')}
                                </p>
                            </motion.div>
                        </div>

                        {/* Main Chart */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div
                                className={`lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 ${isRefreshing ? 'animate-pulse' : ''}`}
                            >
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
                                    {t('dashboard.charts.traffic_overview')}
                                </h3>
                                <TrafficChart key={refreshKey} data={stats.viewsHistory} />
                            </div>

                            {/* Recent Activity */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 }}
                                className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700"
                            >
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                                    <Clock size={20} className="text-slate-400" />
                                    {t('dashboard.recent_orders.title')}
                                </h3>
                                <div className="space-y-4">
                                    {stats.recentOrders.length === 0 ? (
                                        <div className="text-center py-8 text-slate-400">
                                            {t('dashboard.recent_orders.empty')}
                                        </div>
                                    ) : (
                                        stats.recentOrders.map((order) => (
                                            <div key={order.id} className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
                                                <div className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-lg shrink-0">
                                                    <ShoppingCart size={16} />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                                                        {t('dashboard.recent_orders.new_order_label')}
                                                    </p>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                                        {order.details}
                                                    </p>
                                                    <p className="text-[10px] text-slate-400 mt-1">
                                                        {order.date}
                                                    </p>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* Note */}
                    <div className="mt-8 p-4 bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200 rounded-xl flex items-start gap-3 text-sm">
                        <AlertCircle className="shrink-0 mt-0.5" size={18} />
                        <p>
                            {t('dashboard.footer.note')}
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default DashboardPage;
