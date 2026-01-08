import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BarChart3,
    Users,
    ShoppingCart,
    TrendingUp,
    Clock,
    AlertCircle,
    LogOut,
    Trash2,
    ChevronDown,
    ExternalLink,
    Banknote,
    Briefcase,
    Mail,
    Phone,
    Search
} from 'lucide-react';


import { useTracker } from '../hooks/useTracker';
import TrafficChart from '../components/TrafficChart';
import ProjectManager from '../components/ProjectManager';
import Navbar from '../components/Navbar';
import { useTranslation } from 'react-i18next';

const DashboardPage = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const { stats, loading, refresh, deleteOrder, updateOrderStatus, updateOrder } = useTracker();

    // Filter State
    const [filterType, setFilterType] = useState('7d'); // 7d, 30d, month, year
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [isDeleting, setIsDeleting] = useState(null);
    const [editingOrder, setEditingOrder] = useState(null); // The order object being edited
    const [showUpdateSuccess, setShowUpdateSuccess] = useState(false);
    const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
    const [showLogoutSuccess, setShowLogoutSuccess] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [showEditConfirm, setShowEditConfirm] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [orderToDelete, setOrderToDelete] = useState(null);
    const [orderStatusFilter, setOrderStatusFilter] = useState('all');
    const [orderSearchQuery, setOrderSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('overview'); // overview, projects

    const refreshData = async () => {
        let filter = { type: 'days', value: 7 };

        if (filterType === '7d') filter = { type: 'days', value: 7 };
        else if (filterType === '30d') filter = { type: 'days', value: 30 };
        else if (filterType === 'month') filter = { type: 'month', value: { year: selectedYear, month: selectedMonth } };
        else if (filterType === 'year') filter = { type: 'year', value: selectedYear };

        await refresh(filter);
    };

    const triggerSuccess = () => {
        setShowUpdateSuccess(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(() => setShowUpdateSuccess(false), 3000);
    };

    const triggerDeleteSuccess = () => {
        setShowDeleteSuccess(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(() => setShowDeleteSuccess(false), 3000);
    };

    const handleDelete = (id) => {
        setOrderToDelete(id);
        setShowDeleteConfirm(true);
    };

    const confirmDelete = async () => {
        if (!orderToDelete) return;
        setIsDeleting(orderToDelete);
        const res = await deleteOrder(orderToDelete);
        if (res.success) {
            triggerDeleteSuccess();
            refreshData();
        }
        setIsDeleting(null);
        setShowDeleteConfirm(false);
        setOrderToDelete(null);
    };

    const handleStatusChange = async (id, status, currentDetails) => {
        const res = await updateOrderStatus(id, status, currentDetails);
        if (res.success) {
            triggerSuccess();
            refreshData();
        }
    };

    const handleSaveEdit = async (e) => {
        e.preventDefault();
        const res = await updateOrder(editingOrder.id, editingOrder.rawDetails);
        if (res.success) {
            setEditingOrder(null);
            setShowEditConfirm(false);
            triggerSuccess();
            refreshData();
        } else {
            alert(t('dashboard.recent_orders.actions.update_failed') || 'Failed to save changes. Please check your connection or database permissions.');
        }
    };

    const handleCloseEdit = () => {
        // Compare current editing state with original if needed, 
        // but user asked for confirmation when clicking the "top icon/close"
        setShowEditConfirm(true);
    };

    const confirmDiscardChanges = () => {
        setEditingOrder(null);
        setShowEditConfirm(false);
    };

    const handleConfirmLogout = () => {
        setShowLogoutConfirm(false);
        setShowLogoutSuccess(true);
        setTimeout(() => {
            sessionStorage.removeItem('isAuthenticated');
            navigate('/');
        }, 2000);
    };

    const updateEditingField = (field, value) => {
        setEditingOrder(prev => ({
            ...prev,
            rawDetails: {
                ...prev.rawDetails,
                [field]: value
            }
        }));
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400';
            case 'cancelled': return 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400';
            default: return 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400';
        }
    };

    useEffect(() => {
        refreshData();
        const interval = setInterval(refreshData, 30000);
        return () => clearInterval(interval);
    }, [filterType, selectedYear, selectedMonth, i18n.language]);

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
                            <div className="relative group">
                                <select
                                    value={filterType}
                                    onChange={(e) => setFilterType(e.target.value)}
                                    className="appearance-none bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-sm rounded-lg pl-3 pr-10 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none hover:border-blue-500 transition-all cursor-pointer"
                                >
                                    <option value="7d">{t('dashboard.filters.last_7_days')}</option>
                                    <option value="30d">{t('dashboard.filters.last_30_days')}</option>
                                    <option value="month">{t('dashboard.filters.specific_month')}</option>
                                    <option value="year">{t('dashboard.filters.specific_year')}</option>
                                </select>
                                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:translate-y-[-30%] transition-transform" />
                            </div>

                            {/* Year Select (Visible for Month/Year modes) */}
                            {(filterType === 'month' || filterType === 'year') && (
                                <select
                                    value={selectedYear}
                                    onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                                    className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-sm rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500 outline-none"
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
                                    className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-sm rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                >
                                    {t('dashboard.months', { returnObjects: true }).map((m, i) => (
                                        <option key={i} value={i}>{m}</option>
                                    ))}
                                </select>
                            )}

                            <button
                                onClick={() => setShowLogoutConfirm(true)}
                                className="px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors flex items-center gap-2"
                                title={t('dashboard.header.logout')}
                            >
                                <LogOut size={18} />
                                <span className="hidden sm:inline">{t('dashboard.header.logout')}</span>
                            </button>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-2 mb-8 bg-white dark:bg-slate-800 p-1.5 rounded-2xl w-fit shadow-sm border border-slate-100 dark:border-slate-700">
                        <button
                            onClick={() => setActiveTab('overview')}
                            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'overview'
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900'
                                }`}
                        >
                            <TrendingUp size={18} />
                            {t('dashboard.portfolio.tabs.overview')}
                        </button>
                        <button
                            onClick={() => setActiveTab('projects')}
                            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'projects'
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900'
                                }`}
                        >
                            <Briefcase size={18} />
                            {t('dashboard.portfolio.tabs.portfolio')}
                        </button>
                    </div>

                    {/* Content Wrapper */}
                    <div className="transition-opacity duration-300 opacity-100">
                        {activeTab === 'overview' ? (
                            <>
                                {/* Stats Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-10">
                                    {/* Total Views */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 }}
                                        className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-blue-600 dark:text-blue-400">
                                                <Users size={24} />
                                            </div>
                                            <span className="text-xs font-semibold text-green-500 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full animate-pulse">
                                                {t('dashboard.stats.live')}
                                            </span>
                                        </div>
                                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                                            {new Intl.NumberFormat(stats.locale, {
                                                notation: 'compact',
                                                compactDisplay: 'short'
                                            }).format(stats.todayViews || 0)}
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
                                        className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl text-purple-600 dark:text-purple-400">
                                                <ShoppingCart size={24} />
                                            </div>
                                        </div>
                                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                                            {new Intl.NumberFormat(stats.locale, {
                                                notation: 'compact',
                                                compactDisplay: 'short'
                                            }).format(stats.totalOrders || 0)}
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
                                        className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl text-amber-600 dark:text-amber-400">
                                                <BarChart3 size={24} />
                                            </div>
                                        </div>
                                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                                            {new Intl.NumberFormat(stats.locale, {
                                                style: 'percent',
                                                minimumFractionDigits: 1,
                                                maximumFractionDigits: 1
                                            }).format(stats.totalViews > 0 ? (stats.totalOrders / stats.totalViews) : 0)}
                                        </h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">
                                            {t('dashboard.stats.conversion_rate')}
                                        </p>
                                    </motion.div>

                                    {/* Total Revenue */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4 }}
                                        className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl text-emerald-600 dark:text-emerald-400">
                                                <Banknote size={24} />
                                            </div>
                                        </div>
                                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1 truncate" title={new Intl.NumberFormat(stats.locale, { style: 'currency', currency: stats.currency }).format(stats.totalRevenue || 0)}>
                                            {new Intl.NumberFormat(stats.locale, {
                                                style: 'currency',
                                                currency: stats.currency,
                                                notation: 'compact',
                                                maximumFractionDigits: 1
                                            }).format(stats.totalRevenue || 0)}
                                        </h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">
                                            {t('dashboard.stats.total_revenue')}
                                        </p>
                                    </motion.div>

                                    {/* Cancelled Orders */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5 }}
                                        className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-xl text-red-600 dark:text-red-400">
                                                <Trash2 size={24} />
                                            </div>
                                            <span className="text-xs font-semibold text-red-500 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-full">
                                                {stats.totalCancelled || 0} {t('dashboard.stats.orders_suffix')}
                                            </span>
                                        </div>
                                        <h3 className="text-2xl font-bold mb-1 text-red-600 dark:text-red-400 truncate" title={new Intl.NumberFormat(stats.locale, { style: 'currency', currency: stats.currency }).format((stats.cancelledRevenue || 0) * -1)}>
                                            {new Intl.NumberFormat(stats.locale, {
                                                style: 'currency',
                                                currency: stats.currency,
                                                notation: 'compact',
                                                maximumFractionDigits: 1
                                            }).format((stats.cancelledRevenue || 0) * -1)}
                                        </h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">
                                            {t('dashboard.stats.cancelled_orders')}
                                        </p>
                                    </motion.div>
                                </div>

                                {/* Traffic and Orders Overview */}
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
                                    {/* Chart Section - Larger height */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4 }}
                                        className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col h-full min-h-[500px]"
                                    >
                                        <div className="flex items-center justify-between mb-6">
                                            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                                {t('dashboard.charts.traffic_overview')}
                                            </h3>
                                        </div>
                                        <div className="flex-1 w-full relative overflow-hidden bg-slate-50/50 dark:bg-slate-900/20 rounded-xl">
                                            <TrafficChart data={stats.viewsHistory} stats={stats} />
                                        </div>
                                    </motion.div>

                                    {/* Recent Orders Section - Fixed height for 2 items */}
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.5 }}
                                        className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col h-full min-h-[500px]"
                                    >
                                        <div className="flex items-center justify-between mb-6">
                                            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                                <Clock className="text-blue-500" size={20} />
                                                {t('dashboard.recent_orders.title')}
                                            </h3>
                                        </div>

                                        {/* Search and Filter */}
                                        <div className="flex gap-2 mb-4">
                                            <div className="relative flex-1">
                                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                                                <input
                                                    type="text"
                                                    placeholder={t('dashboard.recent_orders.search_placeholder') || "Search..."}
                                                    value={orderSearchQuery}
                                                    onChange={(e) => setOrderSearchQuery(e.target.value)}
                                                    className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                                                />
                                            </div>
                                            <div className="relative">
                                                <select
                                                    value={orderStatusFilter}
                                                    onChange={(e) => setOrderStatusFilter(e.target.value)}
                                                    className="appearance-none px-3 pr-8 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white cursor-pointer"
                                                >
                                                    <option value="all">{t('dashboard.recent_orders.status.all') || t('dashboard.filters.status_all')}</option>
                                                    <option value="pending">{t('dashboard.recent_orders.status.pending')}</option>
                                                    <option value="completed">{t('dashboard.recent_orders.status.completed')}</option>
                                                    <option value="cancelled">{t('dashboard.recent_orders.status.cancelled')}</option>
                                                </select>
                                                <ChevronDown size={10} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                            </div>
                                        </div>

                                        {/* Orders List Container - Strictly 2 items visibility + scroll */}
                                        <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar" style={{ maxHeight: '330px' }}>
                                            {stats.recentOrders.filter(o => {
                                                const matchesStatus = orderStatusFilter === 'all' || o.status === orderStatusFilter;
                                                const matchesSearch = o.customerName.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
                                                    o.date.toLowerCase().includes(orderSearchQuery.toLowerCase());
                                                return matchesStatus && matchesSearch;
                                            }).length === 0 ? (
                                                <div className="text-center py-12 text-slate-400">
                                                    <ShoppingCart size={40} className="mx-auto mb-3 opacity-20" />
                                                    {t('dashboard.recent_orders.empty')}
                                                </div>
                                            ) : (
                                                stats.recentOrders
                                                    .filter(o => {
                                                        const matchesStatus = orderStatusFilter === 'all' || o.status === orderStatusFilter;
                                                        const matchesSearch = o.customerName.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
                                                            o.date.toLowerCase().includes(orderSearchQuery.toLowerCase());
                                                        return matchesStatus && matchesSearch;
                                                    })
                                                    .map((order) => (
                                                        <div key={order.id} className="group relative flex flex-col p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all shadow-sm hover:shadow-md">
                                                            <div className="flex items-start justify-between gap-3 mb-3">
                                                                <div className="flex items-start gap-3">
                                                                    <div className="p-2.5 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-xl shrink-0">
                                                                        <ShoppingCart size={18} />
                                                                    </div>
                                                                    <div>
                                                                        <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-bold text-sm mb-0.5">
                                                                            <Banknote size={14} />
                                                                            {new Intl.NumberFormat(stats.locale, {
                                                                                style: 'currency',
                                                                                currency: stats.currency,
                                                                                maximumFractionDigits: 0
                                                                            }).format(order.total)}
                                                                        </div>
                                                                        <p className="text-sm font-extrabold text-slate-900 dark:text-white">
                                                                            {order.customerName !== '-' ? order.customerName : t('dashboard.recent_orders.new_order_label')}
                                                                        </p>
                                                                        <div className="mt-1.5 space-y-1">
                                                                            {order.rawDetails?.customerEmail && (
                                                                                <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                                                                                    <div className="p-1 bg-blue-50 dark:bg-blue-900/20 rounded text-blue-500">
                                                                                        <Mail size={10} />
                                                                                    </div>
                                                                                    <span className="truncate">{order.rawDetails.customerEmail}</span>
                                                                                </div>
                                                                            )}
                                                                            {order.rawDetails?.customerPhone && (
                                                                                <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                                                                                    <div className="p-1 bg-green-50 dark:bg-green-900/20 rounded text-green-500">
                                                                                        <Phone size={10} />
                                                                                    </div>
                                                                                    <span>{order.rawDetails.customerPhone}</span>
                                                                                </div>
                                                                            )}
                                                                            {!order.rawDetails?.customerEmail && !order.rawDetails?.customerPhone && (
                                                                                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                                                                                    {order.details}
                                                                                </p>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border shrink-0 ${order.status === 'completed'
                                                                    ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800'
                                                                    : order.status === 'cancelled'
                                                                        ? 'bg-red-50 text-red-600 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800'
                                                                        : 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800'
                                                                    }`}>
                                                                    {t(`dashboard.recent_orders.status.${order.status}`)}
                                                                </div>
                                                            </div>

                                                            <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-200/50 dark:border-slate-700/50 gap-2">
                                                                <div className="flex items-center gap-2 text-slate-400 shrink-0">
                                                                    <div className="p-1.5 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                                                                        <Clock size={12} className="text-slate-400" />
                                                                    </div>
                                                                    <span className="text-[10px] font-bold whitespace-nowrap">
                                                                        {order.date}
                                                                    </span>
                                                                </div>

                                                                <div className="flex items-center gap-2">
                                                                    {/* Status Quick Switch */}
                                                                    <div className="flex items-center bg-white dark:bg-slate-800 rounded-lg p-0.5 border border-slate-200 dark:border-slate-700 shadow-sm shrink-0 relative">
                                                                        <select
                                                                            value={order.status}
                                                                            onChange={(e) => handleStatusChange(order.id, e.target.value, order.rawDetails)}
                                                                            className="text-[10px] font-black bg-transparent border-none rounded-md pl-2 pr-6 py-1 outline-none cursor-pointer focus:ring-0 appearance-none relative z-10"
                                                                        >
                                                                            <option value="pending">{t('dashboard.recent_orders.status.pending')}</option>
                                                                            <option value="completed">{t('dashboard.recent_orders.status.completed')}</option>
                                                                            <option value="cancelled">{t('dashboard.recent_orders.status.cancelled')}</option>
                                                                        </select>
                                                                        <ChevronDown size={10} className="absolute right-2 opacity-50 pointer-events-none" />
                                                                    </div>

                                                                    <div className="flex items-center gap-1 border-l border-slate-200 dark:border-slate-700 ml-1 pl-1">
                                                                        <button
                                                                            onClick={() => setEditingOrder(order)}
                                                                            className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all"
                                                                            title={t('dashboard.recent_orders.actions.edit')}
                                                                        >
                                                                            <ExternalLink size={14} />
                                                                        </button>

                                                                        <button
                                                                            onClick={() => handleDelete(order.id)}
                                                                            disabled={isDeleting === order.id}
                                                                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                                                                            title={t('dashboard.recent_orders.actions.delete')}
                                                                        >
                                                                            <Trash2 size={14} className={isDeleting === order.id ? 'animate-pulse' : ''} />
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))
                                            )}
                                        </div>
                                    </motion.div>
                                </div>
                            </>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                            >
                                <ProjectManager />
                            </motion.div>
                        )}
                    </div>

                    {/* Note */}
                    <div className="mt-8 p-4 bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200 rounded-xl flex items-start gap-3 text-sm">
                        <AlertCircle className="shrink-0 mt-0.5" size={18} />
                        <p>
                            {t('dashboard.footer.note')}
                        </p>
                    </div>
                </div>
            </div >

            {/* Success Notification */}
            < AnimatePresence >
                {showUpdateSuccess && (
                    <motion.div
                        initial={{ opacity: 0, x: 50, y: -20 }}
                        animate={{ opacity: 1, x: 0, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="fixed top-6 right-6 z-[100] bg-emerald-500 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border border-emerald-400/20 backdrop-blur-sm"
                    >
                        <div className="bg-white/20 p-2 rounded-xl">
                            <Clock size={20} className="animate-spin" style={{ animationDuration: '3s' }} />
                        </div>
                        <div>
                            <p className="font-bold">{t('dashboard.recent_orders.actions.update_success')}</p>
                        </div>
                    </motion.div>
                )
                }

                {showDeleteSuccess && (
                    <motion.div
                        initial={{ opacity: 0, x: 50, y: -20 }}
                        animate={{ opacity: 1, x: 0, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="fixed top-6 right-6 z-[100] bg-red-500 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border border-red-400/20 backdrop-blur-sm"
                    >
                        <div className="bg-white/20 p-2 rounded-xl">
                            <Trash2 size={20} className="animate-pulse" />
                        </div>
                        <div>
                            <p className="font-bold">{t('dashboard.recent_orders.actions.delete_success')}</p>
                        </div>
                    </motion.div>
                )}

                {
                    showLogoutSuccess && (
                        <motion.div
                            initial={{ opacity: 0, x: 50, y: -20 }}
                            animate={{ opacity: 1, x: 0, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="fixed top-6 right-6 z-[100] bg-red-500 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border border-red-400/20 backdrop-blur-sm"
                        >
                            <div className="bg-white/20 p-2 rounded-xl">
                                <LogOut size={20} className="animate-bounce" />
                            </div>
                            <div>
                                <p className="font-bold">{t('dashboard.recent_orders.actions.logout_success')}</p>
                            </div>
                        </motion.div>
                    )
                }
            </AnimatePresence >

            {/* Edit Modal */}
            < AnimatePresence >
                {editingOrder && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={handleCloseEdit}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-lg bg-white dark:bg-slate-800 rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700"
                        >
                            <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                                    {t('dashboard.recent_orders.actions.edit')}
                                </h3>
                                <button
                                    onClick={handleCloseEdit}
                                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
                                >
                                    <ChevronDown size={24} className="rotate-180" />
                                </button>
                            </div>

                            <form onSubmit={handleSaveEdit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Row 1 */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                            {t('dashboard.recent_orders.fields.customer')}
                                        </label>
                                        <input
                                            type="text"
                                            value={editingOrder.rawDetails?.customerName || ''}
                                            onChange={(e) => updateEditingField('customerName', e.target.value)}
                                            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                            {t('dashboard.recent_orders.fields.email')}
                                        </label>
                                        <input
                                            type="email"
                                            value={editingOrder.rawDetails?.customerEmail || ''}
                                            onChange={(e) => updateEditingField('customerEmail', e.target.value)}
                                            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                                        />
                                    </div>

                                    {/* Row 2 */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                            {t('dashboard.recent_orders.fields.whatsapp')}
                                        </label>
                                        <input
                                            type="text"
                                            value={editingOrder.rawDetails?.customerPhone || ''}
                                            onChange={(e) => updateEditingField('customerPhone', e.target.value)}
                                            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                            {t('dashboard.recent_orders.fields.company')}
                                        </label>
                                        <input
                                            type="text"
                                            value={editingOrder.rawDetails?.customerCompany || ''}
                                            onChange={(e) => updateEditingField('customerCompany', e.target.value)}
                                            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                                        />
                                    </div>

                                    {/* Row 3 */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                            {t('dashboard.recent_orders.fields.website_type')}
                                        </label>
                                        <input
                                            type="text"
                                            value={editingOrder.rawDetails?.websiteType || ''}
                                            onChange={(e) => updateEditingField('websiteType', e.target.value)}
                                            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                            {t('dashboard.recent_orders.fields.tech_stack')}
                                        </label>
                                        <input
                                            type="text"
                                            value={editingOrder.rawDetails?.techStack || ''}
                                            onChange={(e) => updateEditingField('techStack', e.target.value)}
                                            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                                        />
                                    </div>

                                    {/* Row 4 */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                            {t('dashboard.recent_orders.fields.status')}
                                        </label>
                                        <select
                                            value={editingOrder.rawDetails?.status || 'pending'}
                                            onChange={(e) => updateEditingField('status', e.target.value)}
                                            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white cursor-pointer"
                                        >
                                            <option value="pending">{t('dashboard.recent_orders.status.pending')}</option>
                                            <option value="completed">{t('dashboard.recent_orders.status.completed')}</option>
                                            <option value="cancelled">{t('dashboard.recent_orders.status.cancelled')}</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                            {t('dashboard.recent_orders.fields.total')}
                                        </label>
                                        <input
                                            type="number"
                                            value={editingOrder.rawDetails?.total || 0}
                                            onChange={(e) => updateEditingField('total', parseFloat(e.target.value) || 0)}
                                            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                        {t('dashboard.recent_orders.fields.message')}
                                    </label>
                                    <textarea
                                        value={editingOrder.rawDetails?.message || ''}
                                        onChange={(e) => updateEditingField('message', e.target.value)}
                                        rows={4}
                                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white resize-none custom-scrollbar"
                                    />
                                </div>

                                <div className="pt-4 flex gap-3">
                                    <button
                                        type="button"
                                        onClick={handleCloseEdit}
                                        className="flex-1 px-6 py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-all text-sm"
                                    >
                                        {t('dashboard.recent_orders.actions.cancel')}
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all text-sm"
                                    >
                                        {t('dashboard.recent_orders.actions.save')}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {showDeleteConfirm && (
                    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                            onClick={() => setShowDeleteConfirm(false)}
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative w-full max-w-sm bg-white dark:bg-slate-800 rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700"
                        >
                            <div className="p-8 text-center">
                                <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Trash2 size={40} />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                                    {t('dashboard.recent_orders.actions.delete_confirm.title')}
                                </h3>
                                <p className="text-slate-500 dark:text-slate-400 mb-8 px-2">
                                    {t('dashboard.recent_orders.actions.delete_confirm.message')}
                                </p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setShowDeleteConfirm(false)}
                                        className="flex-1 px-6 py-3 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-200 font-bold rounded-xl hover:bg-slate-200 transition-all"
                                    >
                                        {t('dashboard.recent_orders.actions.delete_confirm.cancel')}
                                    </button>
                                    <button
                                        onClick={confirmDelete}
                                        className="flex-1 px-6 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 shadow-lg shadow-red-500/30 transition-all flex items-center justify-center gap-2"
                                    >
                                        {isDeleting && (
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        )}
                                        {t('dashboard.recent_orders.actions.delete_confirm.confirm')}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Logout Confirmation Modal */}
            <AnimatePresence>
                {showLogoutConfirm && (
                    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                            onClick={() => setShowLogoutConfirm(false)}
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative w-full max-w-sm bg-white dark:bg-slate-800 rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700"
                        >
                            <div className="p-8 text-center">
                                <div className="w-20 h-20 bg-amber-100 dark:bg-amber-900/30 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <LogOut size={40} />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                                    {t('dashboard.header.logout_confirm.title')}
                                </h3>
                                <p className="text-slate-500 dark:text-slate-400 mb-8 px-2">
                                    {t('dashboard.header.logout_confirm.message')}
                                </p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setShowLogoutConfirm(false)}
                                        className="flex-1 px-6 py-3 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-200 font-bold rounded-xl hover:bg-slate-200 transition-all"
                                    >
                                        {t('dashboard.header.logout_confirm.cancel')}
                                    </button>
                                    <button
                                        onClick={handleConfirmLogout}
                                        className="flex-1 px-6 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 shadow-lg shadow-red-500/30 transition-all"
                                    >
                                        {t('dashboard.header.logout_confirm.confirm')}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Discard Changes (Edit Modal) Confirmation */}
            <AnimatePresence>
                {showEditConfirm && (
                    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                            onClick={() => setShowEditConfirm(false)}
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative w-full max-w-sm bg-white dark:bg-slate-800 rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700"
                        >
                            <div className="p-8 text-center">
                                <div className="w-20 h-20 bg-amber-100 dark:bg-amber-900/30 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <AlertCircle size={40} />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                                    {t('dashboard.recent_orders.actions.edit_confirm.title')}
                                </h3>
                                <p className="text-slate-500 dark:text-slate-400 mb-8 px-2">
                                    {t('dashboard.recent_orders.actions.edit_confirm.message')}
                                </p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setShowEditConfirm(false)}
                                        className="flex-1 px-6 py-3 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-200 font-bold rounded-xl hover:bg-slate-200 transition-all"
                                    >
                                        {t('dashboard.recent_orders.actions.edit_confirm.cancel')}
                                    </button>
                                    <button
                                        onClick={confirmDiscardChanges}
                                        className="flex-1 px-6 py-3 bg-amber-600 text-white font-bold rounded-xl hover:bg-amber-700 shadow-lg shadow-amber-500/30 transition-all"
                                    >
                                        {t('dashboard.recent_orders.actions.edit_confirm.confirm')}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};

export default DashboardPage;
