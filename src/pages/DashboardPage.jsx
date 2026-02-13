
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutGrid, ListTodo, Calendar, BarChart3, Users, Settings, LogOut, Sun, Moon,
    ChevronDown, Languages, Smartphone, ArrowUpRight, ChevronLeft, ChevronRight, Briefcase,
    ShoppingCart, Bell, Search, Filter, Database, Clock, MoreVertical, Edit, Trash2, Eye,
    EyeOff, AlertCircle, Banknote, MapPin, Mail, Phone, CheckCircle, XCircle, ExternalLink,
    Monitor, Tablet, Globe, FileText, User
} from 'lucide-react';


import { useTracker } from '../hooks/useTracker';
import { usePortfolio } from '../hooks/usePortfolio';
import { formatCurrency } from '../utils/currencyUtils';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import TrafficChart from '../components/TrafficChart';
import ProjectManager from '../components/ProjectManager';
import BlogManager from '../components/BlogManager';
import Navbar from '../components/Navbar';
import DashboardSidebar from '../components/DashboardSidebar';
import { useTranslation } from 'react-i18next';
import { useBlog } from '../hooks/useBlog';
import { useAuth } from '../context/AuthContext';
import SEO from '../components/SEO';

const DashboardPage = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const { user, signOut } = useAuth();
    const { stats, loading, refresh, deleteOrder, updateOrder } = useTracker();
    const { projects: portfolioProjects, fetchProjects: fetchPortfolio } = usePortfolio();
    const { posts: blogPosts, pendingPosts, fetchPosts: fetchBlog, fetchPendingPosts } = useBlog();

    // Filter State
    const [filterType, setFilterType] = useState('weekly'); // weekly, monthly, yearly
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [isDeleting, setIsDeleting] = useState(null);
    const [editingOrder, setEditingOrder] = useState(null); // The order object being edited
    const [showUpdateSuccess, setShowUpdateSuccess] = useState(false);
    const [showUpdateError, setShowUpdateError] = useState(false);
    const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
    const [showLogoutSuccess, setShowLogoutSuccess] = useState(false);
    const [showActionError, setShowActionError] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile sidebar state
    const [isCollapsed, setIsCollapsed] = useState(false); // Desktop sidebar collapsed state
    const [showNewOrderToast, setShowNewOrderToast] = useState(false);
    const [latestOrder, setLatestOrder] = useState(null);

    // Notification State
    const [unreadOrdersCount, setUnreadOrdersCount] = useState(0);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [unreadOrdersList, setUnreadOrdersList] = useState([]);
    const [lastCheckedOrders, setLastCheckedOrders] = useState(() => {
        return localStorage.getItem('last_orders_check') || 0;
    });
    const [readOrderIds, setReadOrderIds] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('read_order_ids') || '[]');
        } catch (e) { return []; }
    });

    // Blog Notification State
    const [unreadBlogsCount, setUnreadBlogsCount] = useState(0);
    const [unreadBlogsList, setUnreadBlogsList] = useState([]);
    const [readBlogIds, setReadBlogIds] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('read_blog_ids') || '[]');
        } catch (e) { return []; }
    });

    // Check for new orders
    useEffect(() => {
        if (stats.allOrders && stats.allOrders.length > 0) {
            const lastCheckTime = new Date(Number(lastCheckedOrders)).getTime();
            const newOrders = stats.allOrders.filter(order => {
                const orderTime = new Date(order.created_at).getTime();
                const isRead = readOrderIds.includes(order.id);
                return !isRead && orderTime > lastCheckTime && order.status !== 'completed' && order.status !== 'cancelled';
            });

            // Trigger toast if new orders arrived and we aren't already showing one
            if (newOrders.length > unreadOrdersList.length && newOrders.length > 0) {
                setLatestOrder(newOrders[0]); // Show the most recent one
                setShowNewOrderToast(true);

                // Play notification sound (silently fail if user hasn't interacted yet)
                try {
                    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
                    audio.volume = 0.5;
                    audio.play().catch(() => { }); // Silently fail - browser autoplay policy
                } catch (e) {
                    // Ignore audio errors
                }

                // Auto hide toast after 8 seconds
                setTimeout(() => setShowNewOrderToast(false), 8000);
            }

            setUnreadOrdersCount(newOrders.length);
            setUnreadOrdersList(newOrders);
        }
    }, [stats.allOrders, lastCheckedOrders, readOrderIds, unreadOrdersList.length]);

    // Blog Notification Logic
    const [showNewBlogToast, setShowNewBlogToast] = useState(false);
    const [latestBlog, setLatestBlog] = useState(null);

    // Check for new blogs (pending status)
    useEffect(() => {
        if (pendingPosts && pendingPosts.length >= 0) {
            const newBlogs = pendingPosts.filter(post => {
                const isRead = readBlogIds.includes(post.id);
                return !isRead && post.status === 'pending';
            });

            // Trigger notification if new blogs arrived
            if (newBlogs.length > unreadBlogsList.length && newBlogs.length > 0) {
                setLatestBlog(newBlogs[0]);
                setShowNewBlogToast(true);

                // Play sound (silently fail if user hasn't interacted yet)
                try {
                    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
                    audio.volume = 0.5;
                    audio.play().catch(() => { }); // Silently fail - browser autoplay policy
                } catch (e) {
                    // Ignore audio errors
                }

                // Auto hide
                setTimeout(() => setShowNewBlogToast(false), 8000);
            }

            setUnreadBlogsCount(newBlogs.length);
            setUnreadBlogsList(newBlogs);
        }
    }, [pendingPosts, readBlogIds, unreadBlogsList.length]);

    // New State for Blog Navigation
    const [selectedBlogId, setSelectedBlogId] = useState(null);

    // Check for new blogs (pending status)
    useEffect(() => {
        if (pendingPosts && pendingPosts.length >= 0) {
            const newBlogs = pendingPosts.filter(post => {
                const isRead = readBlogIds.includes(post.id);
                return !isRead && post.status === 'pending';
            });

            setUnreadBlogsCount(newBlogs.length);
            setUnreadBlogsList(newBlogs);
        }
    }, [pendingPosts, readBlogIds]);

    const handleBellClick = () => {
        setIsNotificationsOpen(!isNotificationsOpen);
        // We no longer update the timestamp here, so notifications persist 
        // until they are specifically clicked or 'Mark all as read' is used.
    };

    const markAllAsRead = () => {
        // Orders
        const allOrderIds = unreadOrdersList.map(o => o.id);
        const newReadOrderIds = Array.from(new Set([...readOrderIds, ...allOrderIds]));
        setReadOrderIds(newReadOrderIds);
        localStorage.setItem('read_order_ids', JSON.stringify(newReadOrderIds));

        // Blogs
        const allBlogIds = unreadBlogsList.map(b => b.id);
        const newReadBlogIds = Array.from(new Set([...readBlogIds, ...allBlogIds]));
        setReadBlogIds(newReadBlogIds);
        localStorage.setItem('read_blog_ids', JSON.stringify(newReadBlogIds));

        setIsNotificationsOpen(false);
    };

    const handleNotificationItemClick = (item, type = 'order') => {
        if (type === 'order') {
            const newReadIds = Array.from(new Set([...readOrderIds, item.id]));
            setReadOrderIds(newReadIds);
            localStorage.setItem('read_order_ids', JSON.stringify(newReadIds));
            setActiveTab('orders');
            // Logic to open order detail/edit would go here if needed
        } else if (type === 'blog') {
            const newReadIds = Array.from(new Set([...readBlogIds, item.id]));
            setReadBlogIds(newReadIds);
            localStorage.setItem('read_blog_ids', JSON.stringify(newReadIds));
            setActiveTab('blog');
            setSelectedBlogId(item.id);
        }
        setIsNotificationsOpen(false);
    };
    const [showEditConfirm, setShowEditConfirm] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [orderToDelete, setOrderToDelete] = useState(null);
    const [orderStatusFilter, setOrderStatusFilter] = useState('all');
    const [orderSearchQuery, setOrderSearchQuery] = useState('');
    const [historySearchQuery, setHistorySearchQuery] = useState('');
    const [ordersCurrentPage, setOrdersCurrentPage] = useState(1);
    const [historyCurrentPage, setHistoryCurrentPage] = useState(1);
    const [visitorsCurrentPage, setVisitorsCurrentPage] = useState(1);
    const [visitorSearchQuery, setVisitorSearchQuery] = useState('');

    // Visitor Filtering State
    const [visitorFilterType, setVisitorFilterType] = useState('day'); // 'day', 'month', 'year', 'all'
    const todayStr = new Date().toISOString().split('T')[0];
    const [visitorFilterDate, setVisitorFilterDate] = useState(todayStr); // Default to Today
    const [itemsPerPage] = useState(10);
    const [activeTab, setActiveTab] = useState('dashboard'); // dashboard, orders, portfolio, history, visitors, etc.
    const [currentTime, setCurrentTime] = useState(new Date());
    const [imgError, setImgError] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Reset pagination when search query changes
    useEffect(() => {
        setOrdersCurrentPage(1);
    }, [orderSearchQuery]);

    useEffect(() => {
        setHistoryCurrentPage(1);
    }, [historySearchQuery]);

    useEffect(() => {
        setVisitorsCurrentPage(1);
    }, [visitorSearchQuery]);

    // Listener for Sidebar Logout
    useEffect(() => {
        const handleForceLogout = () => setShowLogoutConfirm(true);
        window.addEventListener('trigger-logout-confirm', handleForceLogout);
        return () => window.removeEventListener('trigger-logout-confirm', handleForceLogout);
    }, []);

    const refreshData = async () => {
        // Pass filterType directly as string (weekly, monthly, yearly)
        await refresh(filterType);
    };

    const triggerSuccess = () => {
        setShowUpdateSuccess(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(() => setShowUpdateSuccess(false), 3000);
    };

    const triggerError = () => {
        setShowUpdateError(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(() => setShowUpdateError(false), 3000);
    };

    const triggerActionError = () => {
        setShowActionError(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(() => setShowActionError(false), 3000);
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
        const res = await deleteOrder(orderToDelete, stats.allOrders.find(o => o.id === orderToDelete)?.originTable);
        if (res.success) {
            triggerDeleteSuccess();
            refreshData();
        } else {
            triggerActionError();
        }
        setIsDeleting(null);
        setShowDeleteConfirm(false);
        setOrderToDelete(null);
    };



    const handleSaveEdit = async (e) => {
        e.preventDefault();
        const res = await updateOrder(editingOrder.id, editingOrder.rawDetails, editingOrder.originTable);
        if (res.success) {
            setEditingOrder(null);
            setShowEditConfirm(false);
            triggerSuccess();
            refreshData();
        } else {
            triggerError();
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

    const handleConfirmLogout = async () => {
        setShowLogoutConfirm(false);
        setShowLogoutSuccess(true);
        setTimeout(async () => {
            await signOut();
            navigate('/');
        }, 2000);
    };

    const updateEditingField = (field, value) => {
        setEditingOrder(prev => {
            const newDetails = { ...prev.rawDetails, [field]: value };

            // Auto-link logic (2-way binding) & Price Update
            if (field === 'orderPackage') {
                if (value === 'starter') {
                    newDetails.orderType = 'landing-page';
                    newDetails.websiteType = 'landing-page';
                    newDetails.total = 25000; // Auto-set price
                } else if (value === 'enterprise') {
                    newDetails.orderType = 'custom-system';
                    newDetails.websiteType = 'custom-system';
                    newDetails.total = 0; // Reset/Negotiable
                }
            }

            return {
                ...prev,
                rawDetails: newDetails
            };
        });
    };

    // Pagination Component
    const Pagination = ({ currentPage, totalItems, itemsPerPage, onPageChange }) => {
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        const startItem = (currentPage - 1) * itemsPerPage + 1;
        const endItem = Math.min(currentPage * itemsPerPage, totalItems);

        const getPageNumbers = () => {
            const pages = [];
            const maxVisible = 5;

            if (totalPages <= maxVisible) {
                for (let i = 1; i <= totalPages; i++) {
                    pages.push(i);
                }
            } else {
                if (currentPage <= 3) {
                    for (let i = 1; i <= 4; i++) pages.push(i);
                    pages.push('...');
                    pages.push(totalPages);
                } else if (currentPage >= totalPages - 2) {
                    pages.push(1);
                    pages.push('...');
                    for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
                } else {
                    pages.push(1);
                    pages.push('...');
                    pages.push(currentPage - 1);
                    pages.push(currentPage);
                    pages.push(currentPage + 1);
                    pages.push('...');
                    pages.push(totalPages);
                }
            }
            return pages;
        };

        if (totalPages <= 1) return null;

        return (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                <div className="text-sm text-slate-500 dark:text-slate-400">
                    {t('dashboard.pagination.showing')} <span className="font-bold text-slate-900 dark:text-white">{startItem}</span> - <span className="font-bold text-slate-900 dark:text-white">{endItem}</span> {t('dashboard.pagination.of')} <span className="font-bold text-slate-900 dark:text-white">{totalItems}</span> {t('dashboard.pagination.data')}
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        ← {t('dashboard.pagination.previous')}
                    </button>
                    {getPageNumbers().map((page, idx) => (
                        page === '...' ? (
                            <span key={`ellipsis - ${idx} `} className="px-2 text-slate-400">...</span>
                        ) : (
                            <button
                                key={page}
                                onClick={() => onPageChange(page)}
                                className={`px - 3 py - 2 rounded - lg text - sm font - medium transition - colors ${currentPage === page
                                    ? 'bg-blue-600 text-white'
                                    : 'border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                                    } `}
                            >
                                {page}
                            </button>
                        )
                    ))}
                    <button
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {t('dashboard.pagination.next')} →
                    </button>
                </div>
            </div>
        );
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400';
            case 'cancelled': return 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400';
            default: return 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400';
        }
    };

    const getDeviceIcon = (device) => {
        const d = device.toLowerCase();
        if (d.includes('iphone') ||
            d.includes('samsung') ||
            d.includes('phone') ||
            d.includes('xiaomi') ||
            d.includes('oppo') ||
            d.includes('vivo') ||
            d.includes('realme') ||
            d.includes('infinix') ||
            d.includes('pixel') ||
            d.includes('nexus') ||
            d.includes('android') ||
            d.includes('sony') ||
            d.includes('asus') ||
            d.includes('lenovo') ||
            d.includes('huawei') ||
            d.includes('honor') ||
            d.includes('tecno') ||
            d.includes('itel') ||
            d.includes('lg') ||
            d.includes('htc') ||
            d.includes('nokia') ||
            d.includes('mobile')) {
            return <Smartphone size={14} />;
        }
        if (d.includes('ipad') || d.includes('tablet')) {
            return <Tablet size={14} />;
        }
        return <Monitor size={14} />;
    };

    useEffect(() => {
        refreshData();
        fetchPortfolio();
        fetchBlog();
        fetchPendingPosts();
        // REMOVED Redundant Polling: Now relying on real-time pulses for maximum speed and zero latency
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
            <SEO noindex={true} title="Dashboard Admin - WebKu" />
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col md:flex-row px-0 md:px-4 pb-4 md:pt-2 gap-0 md:gap-5 overflow-x-hidden">
                <DashboardSidebar
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    isMobileOpen={isSidebarOpen}
                    setIsMobileOpen={setIsSidebarOpen}
                    isCollapsed={isCollapsed}
                    setIsCollapsed={setIsCollapsed}
                    blogBadgeCount={pendingPosts.length}
                />

                <div className={`flex-1 flex flex-col min-w-0 py-5 px-4 md:px-0 pb-[80px] md:pb-0 transition-all duration-300 ease-in-out ${isCollapsed ? 'md:ml-24' : 'md:ml-72'}`}>
                    {/* Header */}
                    {/* Header */}
                    <div className="flex flex-row justify-between items-center mb-8 gap-4 shrink-0 transition-opacity duration-300 opacity-100">
                        <div className="flex items-center gap-4">
                            {/* Hamburger Menu (Mobile Only) */}
                            <button
                                onClick={() => setIsSidebarOpen(true)}
                                className="md:hidden p-2 -ml-2 text-slate-600 dark:text-slate-300"
                            >
                                <LayoutGrid size={24} />
                            </button>

                            <div>
                                <h1 className="text-lg md:text-2xl font-extrabold text-slate-900 dark:text-white mb-0.5 tracking-tight whitespace-nowrap">
                                    {t('dashboard.header.title')}
                                </h1>
                                <p className="text-slate-500 dark:text-slate-400 text-[10px] md:text-[11px] font-medium hidden sm:block">
                                    {t('dashboard.header.subtitle')}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            {/* Notification Bell */}
                            <div className="relative">
                                <button
                                    onClick={handleBellClick}
                                    className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all relative ${isNotificationsOpen
                                        ? 'bg-emerald-50 border-emerald-200 text-emerald-600 dark:bg-emerald-900/40 dark:border-emerald-700 dark:text-emerald-400'
                                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'
                                        }`}
                                >
                                    {(unreadOrdersList.length + unreadBlogsList.length) > 0 && (
                                        <span className="absolute top-0 right-0 -mt-1 -mr-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-slate-50 dark:border-slate-900 shadow-sm animate-pulse">
                                            {(unreadOrdersList.length + unreadBlogsList.length) > 9 ? '9+' : (unreadOrdersList.length + unreadBlogsList.length)}
                                        </span>
                                    )}
                                    <Bell size={18} />
                                </button>

                                {/* Notification Dropdown */}
                                <AnimatePresence>
                                    {isNotificationsOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            className="absolute -right-12 sm:right-0 top-12 w-[calc(100vw-2rem)] sm:w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden z-50 origin-top-right scale-95 sm:scale-100"
                                        >
                                            <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                                                <h3 className="font-bold text-slate-900 dark:text-white text-sm">{t('dashboard.notifications.title')}</h3>
                                                <div className="flex items-center gap-2">
                                                    {unreadOrdersList.length > 0 && (
                                                        <button
                                                            onClick={markAllAsRead}
                                                            className="text-[10px] font-bold text-slate-400 hover:text-emerald-600 transition-colors uppercase tracking-tight"
                                                        >
                                                            Tandai Semua Dibaca
                                                        </button>
                                                    )}
                                                    <span className="text-[10px] sm:text-xs bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full font-bold">
                                                        {(unreadOrdersList.length + unreadBlogsList.length)} {t('dashboard.notifications.new')}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="max-h-[300px] overflow-y-auto">
                                                {unreadOrdersList.length > 0 || unreadBlogsList.length > 0 ? (
                                                    <>
                                                        {unreadOrdersList.map(order => (
                                                            <div
                                                                key={order.id}
                                                                onClick={() => handleNotificationItemClick(order, 'order')}
                                                                className="p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer border-b border-slate-50 dark:border-slate-700/50 last:border-0"
                                                            >
                                                                <div className="flex items-start gap-3">
                                                                    <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 flex items-center justify-center shrink-0">
                                                                        <ShoppingCart size={14} />
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                                                                            {t('dashboard.notifications.new_order')}: {order.customerName}
                                                                        </p>
                                                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                                                                            {order.details}
                                                                        </p>
                                                                        <p className="text-[10px] text-slate-400 mt-2 font-medium">
                                                                            {order.date}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                        {unreadBlogsList.map(post => (
                                                            <div
                                                                key={post.id}
                                                                onClick={() => handleNotificationItemClick(post, 'blog')}
                                                                className="p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer border-b border-slate-50 dark:border-slate-700/50 last:border-0"
                                                            >
                                                                <div className="flex items-start gap-3">
                                                                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center shrink-0">
                                                                        <FileText size={14} />
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                                                                            New Blog Post: {post.title}
                                                                        </p>
                                                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                                                                            By {post.author}
                                                                        </p>
                                                                        <p className="text-[10px] text-slate-400 mt-2 font-medium">
                                                                            {new Date(post.created_at).toLocaleDateString()}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </>
                                                ) : (
                                                    <div className="p-8 text-center">
                                                        <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-400">
                                                            <Bell size={20} />
                                                        </div>
                                                        <p className="text-sm text-slate-500 dark:text-slate-400">
                                                            {t('dashboard.notifications.empty')}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="p-3 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-700 text-center">
                                                <button
                                                    onClick={() => {
                                                        setActiveTab('orders');
                                                        setIsNotificationsOpen(false);
                                                    }}
                                                    className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                                                >
                                                    {t('dashboard.notifications.view_all')}
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* New Blog Toast */}
                            <AnimatePresence>
                                {showNewBlogToast && latestBlog && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -20, x: 20 }}
                                        animate={{ opacity: 1, y: 0, x: 0 }}
                                        exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                                        className="fixed bottom-6 right-6 z-[100] max-w-sm w-full bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 overflow-hidden cursor-pointer hover:translate-y-[-2px] transition-all"
                                        onClick={() => handleNotificationItemClick(latestBlog, 'blog')}
                                    >
                                        <div className="p-4 flex gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shrink-0 text-white shadow-lg shadow-blue-500/30">
                                                <FileText size={20} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start mb-1">
                                                    <h4 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-1">{latestBlog.title}</h4>
                                                    <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap ml-2">{t('dashboard.blog.notifications.just_now')}</span>
                                                </div>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                                                    {t('dashboard.blog.notifications.by')} <span className="font-medium text-slate-700 dark:text-slate-300">{latestBlog.author || 'Unknown'}</span>
                                                </p>
                                                <div className="flex items-center text-blue-600 dark:text-blue-400 text-xs font-bold gap-1 group">
                                                    {t('dashboard.blog.notifications.review_now')}
                                                    <ArrowUpRight size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="flex items-center gap-2 md:gap-3 bg-white dark:bg-slate-800 p-1 md:p-1.5 md:pr-4 rounded-full border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all group">
                                <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden border-2 border-slate-200 dark:border-slate-600 group-hover:border-blue-500 transition-colors">
                                    {user?.user_metadata?.avatar_url || user?.user_metadata?.picture ? (
                                        <img
                                            src={user?.user_metadata?.avatar_url || user?.user_metadata?.picture}
                                            alt={user?.user_metadata?.full_name || "Admin"}
                                            className="w-full h-full object-cover"
                                            onError={() => setImgError(true)}
                                            style={{ display: imgError ? 'none' : 'block' }}
                                        />
                                    ) : null}
                                    {(imgError || !(user?.user_metadata?.avatar_url || user?.user_metadata?.picture)) && (
                                        <div className="w-full h-full flex items-center justify-center bg-slate-100 dark:bg-slate-700">
                                            <User size={20} className="text-slate-400" />
                                        </div>
                                    )}
                                </div>
                                <div className="hidden md:flex flex-col">
                                    <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-tight group-hover:text-blue-600 transition-colors">
                                        {user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'Admin'}
                                    </h4>
                                    <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                                        {user?.email || ''}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <main className="flex-1">
                        <div className="flex flex-col">
                            {activeTab === 'dashboard' ? (
                                <>
                                    {/* Stats Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 md:gap-4 mb-5 shrink-0">
                                        {/* Pengunjung Hari Ini */}
                                        <motion.div
                                            initial={{ opacity: 0, y: 15 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            onClick={() => setActiveTab('visitors')}
                                            className="bg-[#14532D] dark:bg-emerald-900 p-4 md:p-6 rounded-[1.5rem] border border-white/10 shadow-sm relative overflow-hidden group transition-all cursor-pointer hover:scale-[1.02] hover:shadow-lg"
                                        >
                                            <div className="flex justify-between items-start mb-3 md:mb-6">
                                                <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-white/10 flex items-center justify-center text-white">
                                                    <Users size={18} />
                                                </div>
                                                <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-white flex items-center justify-center text-slate-900 shadow-sm">
                                                    <ArrowUpRight size={14} strokeWidth={2.5} />
                                                </div>
                                            </div>
                                            <div className="flex flex-col">
                                                <h3 className="text-2xl md:text-3xl font-black text-white mb-1 tracking-tight">
                                                    {stats.todayViews || 0}
                                                </h3>
                                                <span className="text-white/70 text-[12px] font-bold uppercase tracking-tight">
                                                    {t('dashboard.stats.total_views')}
                                                </span>
                                            </div>
                                        </motion.div>

                                        {/* Total Pesanan */}
                                        <motion.div
                                            initial={{ opacity: 0, y: 15 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.1 }}
                                            onClick={() => setActiveTab('orders')}
                                            className="bg-white dark:bg-slate-800/50 p-6 rounded-[1.5rem] border border-slate-200/60 dark:border-slate-700/50 shadow-sm transition-all cursor-pointer hover:scale-[1.02] hover:shadow-md group"
                                        >
                                            <div className="flex justify-between items-start mb-3 md:mb-6">
                                                <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                                                    <ShoppingCart size={18} />
                                                </div>
                                                <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-900 dark:text-white shadow-sm transition-all group-hover:bg-blue-600 group-hover:text-white group-hover:scale-110">
                                                    <ArrowUpRight size={14} strokeWidth={2.5} />
                                                </div>
                                            </div>
                                            <div className="flex flex-col">
                                                <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-1 tracking-tight">
                                                    {stats.totalOrders || 0}
                                                </h3>
                                                <span className="text-slate-500 dark:text-slate-400 text-[12px] font-bold uppercase tracking-tight">
                                                    {t('dashboard.stats.total_orders')}
                                                </span>
                                            </div>
                                        </motion.div>

                                        {/* Total Pendapatan */}
                                        <motion.div
                                            initial={{ opacity: 0, y: 15 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.2 }}
                                            onClick={() => setActiveTab('history')}
                                            className="bg-white dark:bg-slate-800/50 p-6 rounded-[1.5rem] border border-slate-200/60 dark:border-slate-700/50 shadow-sm transition-all cursor-pointer hover:scale-[1.02] hover:shadow-md group"
                                        >
                                            <div className="flex justify-between items-start mb-3 md:mb-6">
                                                <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                                    <Banknote size={18} />
                                                </div>
                                                <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-900 dark:text-white shadow-sm transition-all group-hover:bg-emerald-600 group-hover:text-white group-hover:scale-110">
                                                    <ArrowUpRight size={14} strokeWidth={2.5} />
                                                </div>
                                            </div>
                                            <div className="flex flex-col">
                                                <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-1 truncate">
                                                    {formatCurrency(Math.round(stats.completedRevenue || 0), i18n.language, t, true, true)}
                                                </h3>
                                                <span className="text-slate-500 dark:text-slate-400 text-[12px] font-bold uppercase tracking-tight">
                                                    {t('dashboard.stats.total_revenue')}
                                                </span>
                                            </div>
                                        </motion.div>

                                        {/* Pesanan Dibatalkan */}
                                        <motion.div
                                            initial={{ opacity: 0, y: 15 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.3 }}
                                            onClick={() => setActiveTab('history')}
                                            className="bg-white dark:bg-slate-800/50 p-6 rounded-[1.5rem] border border-slate-200/60 dark:border-slate-700/50 shadow-sm transition-all cursor-pointer hover:scale-[1.02] hover:shadow-md group"
                                        >
                                            <div className="flex justify-between items-start mb-3 md:mb-6">
                                                <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500">
                                                    <Trash2 size={18} />
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="px-2 py-0.5 rounded-lg bg-red-500/10 text-red-500 text-[10px] font-bold">
                                                        {stats.totalCancelled || 0} {t('dashboard.stats.orders_suffix')}
                                                    </div>
                                                    <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-900 dark:text-white shadow-sm transition-all group-hover:bg-red-600 group-hover:text-white group-hover:scale-110">
                                                        <ArrowUpRight size={14} strokeWidth={2.5} />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex flex-col">
                                                <h3 className="text-2xl md:text-3xl font-black text-red-500 dark:text-red-400 mb-1 tracking-tight truncate">
                                                    {formatCurrency(Math.round(stats.cancelledRevenue || 0), i18n.language, t, true, true)}
                                                </h3>
                                                <span className="text-slate-500 dark:text-slate-400 text-[12px] font-bold uppercase tracking-tight">
                                                    {t('dashboard.stats.cancelled_orders')}
                                                </span>
                                            </div>
                                        </motion.div>
                                    </div>

                                    {/* Content Components Grid (3 Columns: 6:3:3) */}
                                    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch mb-6">
                                        {/* Column 1: Analytics & Team (9 cols) */}
                                        <div className="xl:col-span-9 flex flex-col gap-6">
                                            {/* Trafik & Pendapatan (Area Chart) */}
                                            <motion.div
                                                initial={{ opacity: 0, y: 15 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.4 }}
                                                className="bg-white dark:bg-slate-800 rounded-[1.5rem] md:rounded-[2rem] p-4 md:p-6 border border-slate-200/60 dark:border-slate-700/50 shadow-sm flex-1 flex flex-col min-h-[280px] md:min-h-[300px]"
                                            >
                                                <div className="flex items-center justify-between mb-6">
                                                    <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                                                        {t('dashboard.charts.traffic_overview')}
                                                    </h3>
                                                    <div className="flex items-center gap-2">
                                                        <select
                                                            value={filterType}
                                                            onChange={(e) => setFilterType(e.target.value)}
                                                            className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-bold rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer"
                                                        >
                                                            <option value="weekly">{t('dashboard.charts.periods.weekly')}</option>
                                                            <option value="monthly">{t('dashboard.charts.periods.monthly')}</option>
                                                            <option value="yearly">{t('dashboard.charts.periods.yearly')}</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="flex-1 w-full min-h-[200px]">
                                                    <TrafficChart data={stats.viewsHistory} stats={stats} />
                                                </div>
                                            </motion.div>
                                        </div>

                                        {/* Column 2: Time Tracker (3 cols) */}
                                        <div className="xl:col-span-3 flex flex-col gap-6">
                                            {/* Work Hours / Time Tracker */}
                                            <motion.div
                                                initial={{ opacity: 0, y: 15 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.8 }}
                                                className="bg-white dark:bg-slate-800 p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] border border-slate-200/60 dark:border-slate-700/50 shadow-sm flex-1 min-h-[160px] h-full flex flex-col justify-center items-center relative overflow-hidden group"
                                            >
                                                {/* Background decoration with gradient */}
                                                <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 z-0" />
                                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                                                <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

                                                <div className="relative z-10 w-full flex flex-col items-center justify-center h-full">
                                                    {/* Header */}
                                                    <div className="flex items-center gap-2 mb-2 opacity-50">
                                                        <Clock size={14} className="text-slate-500 dark:text-slate-400" />
                                                        <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-slate-500 dark:text-slate-400">
                                                            {t('dashboard.widgets.clock_title')}
                                                        </span>
                                                    </div>

                                                    {/* Main Time with Gradient */}
                                                    <div className="text-4xl sm:text-5xl xl:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-700 to-slate-900 dark:from-white dark:to-slate-300 tracking-tighter tabular-nums mb-1">
                                                        {currentTime.toLocaleTimeString(i18n.language, {
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                            hour12: false
                                                        })}
                                                        <span className="text-xl sm:text-2xl xl:text-3xl text-slate-400 dark:text-slate-500 font-bold ml-1">
                                                            {currentTime.toLocaleTimeString(i18n.language, {
                                                                second: '2-digit'
                                                            })}
                                                        </span>
                                                    </div>

                                                    {/* Date & Day */}
                                                    <div className="flex flex-col items-center gap-0.5">
                                                        <h3 className="text-sm font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                                                            {currentTime.toLocaleDateString(i18n.language, {
                                                                weekday: 'long'
                                                            })}
                                                        </h3>
                                                        <p className="text-slate-400 dark:text-slate-500 text-[11px] font-medium bg-slate-100 dark:bg-slate-700/50 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700/50">
                                                            {currentTime.toLocaleDateString(i18n.language, {
                                                                day: 'numeric',
                                                                month: 'long',
                                                                year: 'numeric'
                                                            })}
                                                        </p>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        </div>
                                    </div>
                                </>
                            ) : activeTab === 'orders' ? (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="p-4 md:p-6"
                                >
                                    <div className="bg-white dark:bg-slate-800 rounded-3xl p-4 md:p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
                                        {/* Header Section */}
                                        <div className="flex flex-col gap-4 mb-6">
                                            {/* Title Row */}
                                            <div className="flex items-center justify-between gap-3">
                                                <h2 className="text-base md:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 min-w-0 flex-1">
                                                    <ShoppingCart size={20} className="text-blue-500 shrink-0 md:w-6 md:h-6" />
                                                    <span className="truncate">{t('dashboard.order_tab.title')}</span>
                                                </h2>
                                                <div className="px-2.5 md:px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl text-[10px] md:text-sm font-bold whitespace-nowrap shrink-0 max-w-[120px] md:max-w-none overflow-hidden">
                                                    <span className="inline-block truncate">
                                                        {(stats.allOrders || []).filter(o => {
                                                            const matchesStatus = o.status !== 'completed' && o.status !== 'cancelled';
                                                            const matchesSearch = orderSearchQuery === '' ||
                                                                o.customerName?.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
                                                                o.details?.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
                                                                o.customerEmail?.toLowerCase().includes(orderSearchQuery.toLowerCase());
                                                            return matchesStatus && matchesSearch;
                                                        }).length} {t('dashboard.order_tab.active_badge')}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Search Row */}
                                            <div className="relative w-full">
                                                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                                <input
                                                    type="text"
                                                    placeholder={t('dashboard.order_tab.search_placeholder')}
                                                    value={orderSearchQuery}
                                                    onChange={(e) => setOrderSearchQuery(e.target.value)}
                                                    className="pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none dark:text-white w-full"
                                                />
                                            </div>
                                        </div>

                                        <div className="overflow-x-auto -mx-4 md:-mx-0">
                                            <table className="w-full min-w-[800px]">
                                                <thead>
                                                    <tr className="border-b border-slate-100 dark:border-slate-700">
                                                        <th className="text-left font-bold text-slate-500 dark:text-slate-400 text-[10px] md:text-xs uppercase tracking-wider py-4 px-4 whitespace-nowrap">{t('dashboard.order_tab.table.date')}</th>
                                                        <th className="text-left font-bold text-slate-500 dark:text-slate-400 text-[10px] md:text-xs uppercase tracking-wider py-4 px-4 whitespace-nowrap">{t('dashboard.order_tab.table.customer')}</th>
                                                        <th className="text-left font-bold text-slate-500 dark:text-slate-400 text-[10px] md:text-xs uppercase tracking-wider py-4 px-4 whitespace-nowrap">{t('dashboard.order_tab.table.details')}</th>
                                                        <th className="text-left font-bold text-slate-500 dark:text-slate-400 text-[10px] md:text-xs uppercase tracking-wider py-4 px-4 whitespace-nowrap">{t('dashboard.order_tab.table.total')}</th>
                                                        <th className="text-left font-bold text-slate-500 dark:text-slate-400 text-[10px] md:text-xs uppercase tracking-wider py-4 px-4 whitespace-nowrap">{t('dashboard.order_tab.table.status')}</th>
                                                        <th className="text-right font-bold text-slate-500 dark:text-slate-400 text-[10px] md:text-xs uppercase tracking-wider py-4 px-4 whitespace-nowrap">{t('dashboard.order_tab.table.actions')}</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                                    {(() => {
                                                        const filtered = (stats.allOrders || []).filter(o => {
                                                            const matchesStatus = o.status !== 'completed' && o.status !== 'cancelled';
                                                            const matchesSearch = orderSearchQuery === '' ||
                                                                o.customerName?.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
                                                                o.details?.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
                                                                o.customerEmail?.toLowerCase().includes(orderSearchQuery.toLowerCase());
                                                            return matchesStatus && matchesSearch;
                                                        });
                                                        const startIndex = (ordersCurrentPage - 1) * itemsPerPage;
                                                        const endIndex = startIndex + itemsPerPage;
                                                        return filtered.slice(startIndex, endIndex);
                                                    })().map((order) => (
                                                        <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors uppercase">
                                                            <td className="py-4 px-4 text-[10px] md:text-sm text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap">
                                                                {order.date}
                                                            </td>
                                                            <td className="py-4 px-4">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-xs uppercase">
                                                                        {order.customerName.substring(0, 2)}
                                                                    </div>
                                                                    <span className="text-[10px] md:text-sm font-bold text-slate-900 dark:text-white whitespace-nowrap">
                                                                        {order.customerName}
                                                                    </span>
                                                                </div>
                                                            </td>
                                                            <td className="py-4 px-4 text-[10px] md:text-sm text-slate-600 dark:text-slate-300 whitespace-nowrap">
                                                                {order.details}
                                                            </td>
                                                            <td className="py-4 px-4 text-[11px] md:text-sm font-bold text-slate-900 dark:text-white whitespace-nowrap">
                                                                {formatCurrency(order.total, i18n.language, t)}
                                                            </td>
                                                            <td className="py-4 px-4 whitespace-nowrap">
                                                                <span className={`px-2 py-1 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider ${getStatusColor(order.status)}`}>
                                                                    {t(`dashboard.recent_orders.status.${order.status}`) || order.status}
                                                                </span>
                                                            </td>
                                                            <td className="py-4 px-4 whitespace-nowrap">
                                                                <div className="flex justify-end gap-2">
                                                                    <button
                                                                        onClick={() => setEditingOrder(order)}
                                                                        className="p-1.5 md:p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-slate-400 hover:text-blue-600 rounded-lg transition-colors"
                                                                    >
                                                                        <Edit size={14} md:size={16} className="shrink-0" />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleDelete(order.id)}
                                                                        className="p-1.5 md:p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-600 rounded-lg transition-colors"
                                                                    >
                                                                        <Trash2 size={14} md:size={16} className="shrink-0" />
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                    {((stats.allOrders || []).filter(o => {
                                                        const matchesStatus = o.status !== 'completed' && o.status !== 'cancelled';
                                                        const matchesSearch = orderSearchQuery === '' ||
                                                            o.customerName?.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
                                                            o.details?.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
                                                            o.customerEmail?.toLowerCase().includes(orderSearchQuery.toLowerCase());
                                                        return matchesStatus && matchesSearch;
                                                    }).length === 0) && (
                                                            <tr>
                                                                <td colSpan="6" className="py-12 text-center text-slate-500 dark:text-slate-400 font-medium">
                                                                    {orderSearchQuery ? t('dashboard.order_tab.empty_search') : t('dashboard.order_tab.empty_list')}
                                                                </td>
                                                            </tr>
                                                        )}
                                                </tbody>
                                            </table>
                                        </div>

                                        {/* Pagination */}
                                        <Pagination
                                            currentPage={ordersCurrentPage}
                                            totalItems={(stats.allOrders || []).filter(o => {
                                                const matchesStatus = o.status !== 'completed' && o.status !== 'cancelled';
                                                const matchesSearch = orderSearchQuery === '' ||
                                                    o.customerName?.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
                                                    o.details?.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
                                                    o.customerEmail?.toLowerCase().includes(orderSearchQuery.toLowerCase());
                                                return matchesStatus && matchesSearch;
                                            }).length}
                                            itemsPerPage={itemsPerPage}
                                            onPageChange={(page) => setOrdersCurrentPage(page)}
                                        />
                                    </div>
                                </motion.div>
                            ) : activeTab === 'history' ? (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="p-4 md:p-6"
                                >
                                    <div className="space-y-4 md:space-y-6 p-0 md:p-6">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                                            {/* Completed Stats */}
                                            <div className="bg-white dark:bg-slate-800 p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
                                                <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
                                                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 flex items-center justify-center shrink-0">
                                                        <CheckCircle className="w-5 h-5 md:w-6 md:h-6" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-[10px] md:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tighter sm:tracking-widest truncate">{t('dashboard.analytics.stats.completed')}</p>
                                                        <h4 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">{stats.completedOrders || 0}</h4>
                                                    </div>
                                                </div>
                                                <div className="pt-3 md:pt-4 border-t border-slate-100 dark:border-slate-700">
                                                    <p className="text-[10px] md:text-xs text-slate-500 dark:text-slate-400 font-medium uppercase mb-0.5">{t('dashboard.analytics.stats.net_revenue')}</p>
                                                    <p className="text-base md:text-lg font-bold text-emerald-600 dark:text-emerald-400 truncate">
                                                        {formatCurrency(Math.round(stats.completedRevenue || 0), i18n.language, t, true, true)}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Pending Stats */}
                                            <div className="bg-white dark:bg-slate-800 p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
                                                <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
                                                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-amber-100 dark:bg-amber-900/30 text-amber-600 flex items-center justify-center shrink-0">
                                                        <Clock className="w-5 h-5 md:w-6 md:h-6" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-[10px] md:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tighter sm:tracking-widest truncate">{t('dashboard.analytics.stats.pending')}</p>
                                                        <h4 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">{stats.pendingOrders || 0}</h4>
                                                    </div>
                                                </div>
                                                <div className="pt-3 md:pt-4 border-t border-slate-100 dark:border-slate-700">
                                                    <p className="text-[10px] md:text-xs text-slate-500 dark:text-slate-400 font-medium uppercase mb-0.5">{t('dashboard.analytics.stats.estimated_revenue')}</p>
                                                    <p className="text-base md:text-lg font-bold text-amber-600 dark:text-amber-400 truncate">
                                                        {formatCurrency(Math.round(stats.pendingRevenue || 0), i18n.language, t, true, true)}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Cancelled Stats */}
                                            <div className="bg-white dark:bg-slate-800 p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
                                                <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
                                                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-red-100 dark:bg-red-900/30 text-red-600 flex items-center justify-center shrink-0">
                                                        <Trash2 className="w-5 h-5 md:w-6 md:h-6" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-[10px] md:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tighter sm:tracking-widest truncate">{t('dashboard.analytics.stats.cancelled')}</p>
                                                        <h4 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">{stats.totalCancelled || 0}</h4>
                                                    </div>
                                                </div>
                                                <div className="pt-3 md:pt-4 border-t border-slate-100 dark:border-slate-700">
                                                    <p className="text-[10px] md:text-xs text-slate-500 dark:text-slate-400 font-medium uppercase mb-0.5">{t('dashboard.history.stats.total_batal')}</p>
                                                    <p className="text-base md:text-lg font-bold text-red-600 dark:text-red-400 truncate">
                                                        {formatCurrency(Math.round(stats.cancelledRevenue || 0), i18n.language, t, true, true)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>


                                        <div className="bg-white dark:bg-slate-800 rounded-[2rem] p-8 border border-slate-200 dark:border-slate-700 shadow-sm">
                                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                                                <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight uppercase">
                                                    {t('dashboard.history.title')}
                                                </h3>
                                                <div className="flex items-center gap-3">
                                                    <div className="relative">
                                                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                                        <input
                                                            type="text"
                                                            placeholder={t('dashboard.history.search_placeholder')}
                                                            value={historySearchQuery}
                                                            onChange={(e) => setHistorySearchQuery(e.target.value)}
                                                            className="pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none dark:text-white w-full sm:w-64"
                                                        />
                                                    </div>
                                                    <div className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded-lg text-sm font-bold">
                                                        {(stats.allOrders || []).filter(o => {
                                                            const matchesStatus = o.status === 'completed' || o.status === 'cancelled';
                                                            const matchesSearch = historySearchQuery === '' ||
                                                                o.customerName?.toLowerCase().includes(historySearchQuery.toLowerCase()) ||
                                                                o.details?.toLowerCase().includes(historySearchQuery.toLowerCase()) ||
                                                                o.customerEmail?.toLowerCase().includes(historySearchQuery.toLowerCase());
                                                            return matchesStatus && matchesSearch;
                                                        }).length} {t('dashboard.history.stats.archived')}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="overflow-x-auto -mx-4 md:-mx-8 px-4 md:px-8">
                                                <table className="w-full min-w-[800px]">
                                                    <thead>
                                                        <tr className="border-b border-slate-100 dark:border-slate-700">
                                                            <th className="text-left font-bold text-slate-500 dark:text-slate-400 text-[10px] md:text-xs uppercase tracking-wider py-4 px-4 whitespace-nowrap">{t('dashboard.recent_orders.table.date')}</th>
                                                            <th className="text-left font-bold text-slate-500 dark:text-slate-400 text-[10px] md:text-xs uppercase tracking-wider py-4 px-4 whitespace-nowrap">{t('dashboard.recent_orders.table.customer')}</th>
                                                            <th className="text-left font-bold text-slate-500 dark:text-slate-400 text-[10px] md:text-xs uppercase tracking-wider py-4 px-4 whitespace-nowrap">{t('dashboard.recent_orders.table.details')}</th>
                                                            <th className="text-left font-bold text-slate-500 dark:text-slate-400 text-[10px] md:text-xs uppercase tracking-wider py-4 px-4 whitespace-nowrap">{t('dashboard.recent_orders.table.total')}</th>
                                                            <th className="text-left font-bold text-slate-500 dark:text-slate-400 text-[10px] md:text-xs uppercase tracking-wider py-4 px-4 whitespace-nowrap">{t('dashboard.recent_orders.table.status')}</th>
                                                            <th className="text-right font-bold text-slate-500 dark:text-slate-400 text-[10px] md:text-xs uppercase tracking-wider py-4 px-4 whitespace-nowrap">{t('dashboard.recent_orders.table.actions')}</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                                        {(() => {
                                                            const filtered = (stats.allOrders || []).filter(o => {
                                                                const matchesStatus = o.status === 'completed' || o.status === 'cancelled';
                                                                const matchesSearch = historySearchQuery === '' ||
                                                                    o.customerName?.toLowerCase().includes(historySearchQuery.toLowerCase()) ||
                                                                    o.details?.toLowerCase().includes(historySearchQuery.toLowerCase()) ||
                                                                    o.customerEmail?.toLowerCase().includes(historySearchQuery.toLowerCase());
                                                                return matchesStatus && matchesSearch;
                                                            });
                                                            const startIndex = (historyCurrentPage - 1) * itemsPerPage;
                                                            const endIndex = startIndex + itemsPerPage;
                                                            return filtered.slice(startIndex, endIndex);
                                                        })().map((order) => (
                                                            <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors uppercase">
                                                                <td className="py-4 px-4 text-[10px] md:text-sm text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap">
                                                                    {order.date}
                                                                </td>
                                                                <td className="py-4 px-4">
                                                                    <div className="flex items-center gap-3">
                                                                        <div className={`w-8 h-8 rounded-full ${order.status === 'completed' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600' : 'bg-red-100 dark:bg-red-900/30 text-red-600'} flex items-center justify-center font-bold text-xs uppercase`}>
                                                                            {order.customerName.substring(0, 2)}
                                                                        </div>
                                                                        <span className="text-[10px] md:text-sm font-bold text-slate-900 dark:text-white whitespace-nowrap">
                                                                            {order.customerName}
                                                                        </span>
                                                                    </div>
                                                                </td>
                                                                <td className="py-4 px-4 text-[10px] md:text-sm text-slate-600 dark:text-slate-300 whitespace-nowrap">
                                                                    {order.details}
                                                                </td>
                                                                <td className="py-4 px-4 text-[11px] md:text-sm font-bold text-slate-900 dark:text-white whitespace-nowrap">
                                                                    {formatCurrency(order.total, i18n.language, t)}
                                                                </td>
                                                                <td className="py-4 px-4 whitespace-nowrap">
                                                                    <span className={`px-2 py-1 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider ${getStatusColor(order.status)}`}>
                                                                        {t(`dashboard.recent_orders.status.${order.status}`) || order.status}
                                                                    </span>
                                                                </td>
                                                                <td className="py-4 px-4 whitespace-nowrap">
                                                                    <div className="flex justify-end gap-2">
                                                                        <button
                                                                            onClick={() => setEditingOrder(order)}
                                                                            className="p-1.5 md:p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-slate-400 hover:text-blue-600 rounded-lg transition-colors"
                                                                        >
                                                                            <Edit className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                                                        </button>
                                                                        <button
                                                                            onClick={() => handleDelete(order.id)}
                                                                            className="p-1.5 md:p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-600 rounded-lg transition-colors"
                                                                        >
                                                                            <Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                                                        </button>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                        {((stats.allOrders || []).filter(o => {
                                                            const matchesStatus = o.status === 'completed' || o.status === 'cancelled';
                                                            const matchesSearch = historySearchQuery === '' ||
                                                                o.customerName?.toLowerCase().includes(historySearchQuery.toLowerCase()) ||
                                                                o.details?.toLowerCase().includes(historySearchQuery.toLowerCase()) ||
                                                                o.customerEmail?.toLowerCase().includes(historySearchQuery.toLowerCase());
                                                            return matchesStatus && matchesSearch;
                                                        }).length === 0) && (
                                                                <tr>
                                                                    <td colSpan="6" className="py-12 text-center text-slate-500 dark:text-slate-400 font-medium">
                                                                        {historySearchQuery ? t('dashboard.history.table.search_empty') : t('dashboard.history.table.empty')}
                                                                    </td>
                                                                </tr>
                                                            )}
                                                    </tbody>
                                                </table>
                                            </div>

                                            {/* Pagination */}
                                            <Pagination
                                                currentPage={historyCurrentPage}
                                                totalItems={(stats.allOrders || []).filter(o => {
                                                    const matchesStatus = o.status === 'completed' || o.status === 'cancelled';
                                                    const matchesSearch = historySearchQuery === '' ||
                                                        o.customerName?.toLowerCase().includes(historySearchQuery.toLowerCase()) ||
                                                        o.details?.toLowerCase().includes(historySearchQuery.toLowerCase()) ||
                                                        o.customerEmail?.toLowerCase().includes(historySearchQuery.toLowerCase());
                                                    return matchesStatus && matchesSearch;
                                                }).length}
                                                itemsPerPage={itemsPerPage}
                                                onPageChange={(page) => setHistoryCurrentPage(page)}
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            ) : activeTab === 'blog' ? (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="p-6"
                                >
                                    <BlogManager
                                        selectedPostId={selectedBlogId}
                                        onClearSelection={() => setSelectedBlogId(null)}
                                    />
                                </motion.div>
                            ) : activeTab === 'visitors' ? (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="p-6"
                                >
                                    <div className="flex flex-col gap-6">
                                        {/* Visitor Analytics Header */}
                                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                            <div>
                                                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{t('dashboard.visitors.title')}</h2>
                                                <p className="text-sm text-slate-500 dark:text-slate-400">{t('dashboard.visitors.subtitle')}</p>
                                            </div>
                                            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                                                {/* Filter Controls */}
                                                <div className="flex items-center gap-2">
                                                    <select
                                                        value={visitorFilterType}
                                                        onChange={(e) => {
                                                            setVisitorFilterType(e.target.value);
                                                            setVisitorsCurrentPage(1);
                                                        }}
                                                        className="px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none dark:text-white"
                                                    >
                                                        <option value="day">{t('dashboard.visitors.filters.daily') || 'Harian'}</option>
                                                        <option value="month">{t('dashboard.visitors.filters.monthly') || 'Bulanan'}</option>
                                                        <option value="year">{t('dashboard.visitors.filters.yearly') || 'Tahunan'}</option>
                                                        <option value="all">{t('dashboard.visitors.filters.all') || 'Semua'}</option>
                                                    </select>

                                                    {visitorFilterType === 'day' && (
                                                        <input
                                                            type="date"
                                                            value={visitorFilterDate}
                                                            onChange={(e) => setVisitorFilterDate(e.target.value)}
                                                            className="px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none dark:text-white"
                                                        />
                                                    )}

                                                    {visitorFilterType === 'month' && (
                                                        <input
                                                            type="month"
                                                            value={visitorFilterDate.substring(0, 7)}
                                                            onChange={(e) => setVisitorFilterDate(e.target.value)}
                                                            className="px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none dark:text-white"
                                                        />
                                                    )}

                                                    {visitorFilterType === 'year' && (
                                                        <select
                                                            value={visitorFilterDate.substring(0, 4)}
                                                            onChange={(e) => setVisitorFilterDate(`${e.target.value}-01-01`)}
                                                            className="px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none dark:text-white"
                                                        >
                                                            {[2024, 2025, 2026].map(year => (
                                                                <option key={year} value={year}>{year}</option>
                                                            ))}
                                                        </select>
                                                    )}
                                                </div>

                                                <div className="relative flex-1 sm:flex-none">
                                                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                                    <input
                                                        type="text"
                                                        placeholder={t('dashboard.visitors.table.search_placeholder')}
                                                        value={visitorSearchQuery}
                                                        onChange={(e) => setVisitorSearchQuery(e.target.value)}
                                                        className="pl-9 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none dark:text-white w-full sm:w-48"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-8">
                                            {/* Top: Device Stats Pie Chart */}
                                            <div className="w-full bg-white dark:bg-slate-800 rounded-[2rem] p-6 border border-slate-200 dark:border-slate-700 shadow-xl flex flex-col md:flex-row items-center justify-between min-h-[300px]">
                                                <div className="w-full sm:w-1/3 mb-6 sm:mb-0">
                                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                                                        <Smartphone className="text-blue-500" size={24} />
                                                        {t('dashboard.visitors.device_percentage')}
                                                    </h3>
                                                    <p className="text-sm text-slate-500 dark:text-slate-400">
                                                        {t('dashboard.visitors.device_stats_desc')}
                                                    </p>
                                                </div>
                                                <div className="w-full md:w-2/3 h-[300px] relative">
                                                    {(() => {
                                                        const deviceCounts = {};
                                                        let totalVisitors = 0;

                                                        // Helper to categorize detailed device names back to groups
                                                        const getDeviceCategory = (details) => {
                                                            const d = details.toLowerCase();
                                                            // Desktop Group
                                                            if (d.includes('windows') ||
                                                                d.includes('mac') ||
                                                                d.includes('linux') ||
                                                                d.includes('desktop') ||
                                                                d.includes('pc')) {
                                                                return 'Desktop';
                                                            }

                                                            // Mobile Group (All others: iPhone, Android brands, etc.)
                                                            // User requested everything else to fall into "Android" category
                                                            return 'Android / Mobile';
                                                        };

                                                        stats.visitors.forEach(v => {
                                                            const rawDevice = v.device || 'Unknown';
                                                            const category = getDeviceCategory(rawDevice);
                                                            deviceCounts[category] = (deviceCounts[category] || 0) + 1;
                                                            totalVisitors++;
                                                        });

                                                        const chartData = Object.entries(deviceCounts)
                                                            .sort(([, a], [, b]) => b - a)
                                                            .map(([name, value]) => ({
                                                                name,
                                                                value,
                                                                percentage: Math.round((value / totalVisitors) * 100)
                                                            }));

                                                        const COLORS = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#F43F5E', '#06B6D4'];

                                                        if (chartData.length === 0) {
                                                            return (
                                                                <div className="flex items-center justify-center h-full text-slate-400 text-sm">
                                                                    {t('dashboard.visitors.table.empty')}
                                                                </div>
                                                            );
                                                        }

                                                        return (
                                                            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                                                                <PieChart>
                                                                    <Pie
                                                                        data={chartData}
                                                                        cx="50%"
                                                                        cy="50%"
                                                                        innerRadius="60%"
                                                                        outerRadius="80%"
                                                                        paddingAngle={5}
                                                                        dataKey="value"
                                                                        label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                                                                            const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                                                                            const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
                                                                            const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
                                                                            return (
                                                                                <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" className="text-xs font-bold">
                                                                                    {`${(percent * 100).toFixed(0)}%`}
                                                                                </text>
                                                                            );
                                                                        }}
                                                                        labelLine={false}
                                                                    >
                                                                        {chartData.map((entry, index) => (
                                                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                                        ))}
                                                                    </Pie>
                                                                    <Tooltip
                                                                        contentStyle={{
                                                                            backgroundColor: '#1E293B',
                                                                            borderRadius: '8px',
                                                                            border: 'none',
                                                                            color: '#fff'
                                                                        }}
                                                                        itemStyle={{ color: '#fff' }}
                                                                        formatter={(value, name, props) => {
                                                                            return [`${value} ${t('dashboard.sidebar.items.visitors').toLowerCase()} (${props.payload.percentage}%)`, name];
                                                                        }}
                                                                    />
                                                                    <Legend
                                                                        layout="horizontal"
                                                                        verticalAlign="bottom"
                                                                        align="center"
                                                                        iconType="circle"
                                                                        wrapperStyle={{ paddingTop: '20px' }}
                                                                        formatter={(value, entry) => {
                                                                            const { payload } = entry;
                                                                            return (
                                                                                <span className="text-xs md:text-sm font-medium text-slate-600 dark:text-slate-300 ml-1">
                                                                                    {value} <span className="text-slate-400">({payload.percentage}%)</span>
                                                                                </span>
                                                                            );
                                                                        }}
                                                                    />
                                                                </PieChart>
                                                            </ResponsiveContainer>
                                                        );
                                                    })()}
                                                </div>
                                            </div>

                                            {/* Bottom: Visitors Table */}
                                            <div className="bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-200/60 dark:border-slate-700/50 shadow-sm overflow-hidden flex flex-col">
                                                <div className="p-6 pb-2">
                                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                                        <ListTodo size={18} className="text-blue-500" />
                                                        {t('dashboard.visitors.table_title')}
                                                    </h3>
                                                </div>
                                                <div className="overflow-x-auto">
                                                    <table className="w-full">
                                                        <thead>
                                                            <tr className="border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50">
                                                                <th className="text-left font-bold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider py-4 px-6">{t('dashboard.visitors.table.time')}</th>
                                                                <th className="text-left font-bold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider py-4 px-6">{t('dashboard.visitors.table.visitor_id')}</th>
                                                                <th className="text-left font-bold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider py-4 px-6">{t('dashboard.visitors.table.device')}</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                                            {(() => {
                                                                const filtered = (stats.visitors || []).filter(v => {
                                                                    // 1. Text Search Filter
                                                                    const matchesSearch = visitorSearchQuery === '' ||
                                                                        v.visitor_id?.toLowerCase().includes(visitorSearchQuery.toLowerCase()) ||
                                                                        v.device?.toLowerCase().includes(visitorSearchQuery.toLowerCase()) ||
                                                                        v.browser?.toLowerCase().includes(visitorSearchQuery.toLowerCase()) ||
                                                                        v.os?.toLowerCase().includes(visitorSearchQuery.toLowerCase());

                                                                    if (!matchesSearch) return false;

                                                                    // 2. Date/Time Filter using created_at (ISO string)
                                                                    if (!v.created_at) return false;
                                                                    const visitDate = v.created_at; // e.g. "2024-01-15T10:30:00"

                                                                    if (visitorFilterType === 'day') {
                                                                        return visitDate.startsWith(visitorFilterDate);
                                                                    } else if (visitorFilterType === 'month') {
                                                                        // visitorFilterDate might be YYYY-MM-DD or YYYY-MM depending on input
                                                                        const targetMap = visitorFilterDate.substring(0, 7);
                                                                        return visitDate.startsWith(targetMap);
                                                                    } else if (visitorFilterType === 'year') {
                                                                        const targetYear = visitorFilterDate.substring(0, 4);
                                                                        return visitDate.startsWith(targetYear);
                                                                    }

                                                                    return true; // 'all'
                                                                });
                                                                const startIndex = (visitorsCurrentPage - 1) * itemsPerPage;
                                                                return filtered.slice(startIndex, startIndex + itemsPerPage);
                                                            })().map((v) => (
                                                                <tr key={v.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                                                    <td className="py-4 px-6">
                                                                        <div className="flex items-center gap-2">
                                                                            <Clock size={14} className="text-blue-500" />
                                                                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{v.date}</span>
                                                                        </div>
                                                                    </td>
                                                                    <td className="py-4 px-6">
                                                                        <span className="text-xs font-mono bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded text-slate-600 dark:text-slate-400">
                                                                            {v.visitor_id || 'v-anonymous'}
                                                                        </span>
                                                                    </td>
                                                                    <td className="py-4 px-6">
                                                                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-900 w-fit">
                                                                            <span className="text-slate-500 dark:text-slate-400">{getDeviceIcon(v.device)}</span>
                                                                            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{v.device}</span>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                            {(!stats.visitors || stats.visitors.length === 0) && (
                                                                <tr>
                                                                    <td colSpan="3" className="py-12 text-center text-slate-500 dark:text-slate-400">
                                                                        {t('dashboard.visitors.table.empty')}
                                                                    </td>
                                                                </tr>
                                                            )}
                                                        </tbody>
                                                    </table>
                                                </div>
                                                <div className="px-6 pb-6 mt-auto">
                                                    <Pagination
                                                        currentPage={visitorsCurrentPage}
                                                        totalItems={(stats.visitors || []).filter(v =>
                                                            visitorSearchQuery === '' ||
                                                            v.visitor_id?.toLowerCase().includes(visitorSearchQuery.toLowerCase()) ||
                                                            v.device?.toLowerCase().includes(visitorSearchQuery.toLowerCase()) ||
                                                            v.browser?.toLowerCase().includes(visitorSearchQuery.toLowerCase()) ||
                                                            v.os?.toLowerCase().includes(visitorSearchQuery.toLowerCase())
                                                        ).length}
                                                        itemsPerPage={itemsPerPage}
                                                        onPageChange={(page) => setVisitorsCurrentPage(page)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ) : activeTab === 'settings' ? (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="p-6"
                                >
                                    <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-200 dark:border-slate-700 text-center">
                                        <div className="w-20 h-20 bg-slate-100 dark:bg-slate-700 text-slate-600 mx-auto rounded-full flex items-center justify-center mb-4">
                                            <Settings size={40} />
                                        </div>
                                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{t('dashboard.settings.title')}</h2>
                                        <p className="text-slate-500 dark:text-slate-400">{t('dashboard.settings.subtitle')}</p>
                                    </div>
                                </motion.div>
                            ) : activeTab === 'portfolio' ? (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                >
                                    <ProjectManager />
                                </motion.div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                >
                                    <ProjectManager />
                                </motion.div>
                            )}
                        </div>
                    </main>
                </div >
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
                            <CheckCircle size={20} className="animate-bounce" />
                        </div>
                        <div>
                            <p className="font-bold">{t('dashboard.recent_orders.actions.update_success')}</p>
                        </div>
                    </motion.div>
                )}

                {/* New Order Real-time Toast */}
                {showNewOrderToast && latestOrder && (
                    <motion.div
                        initial={{ opacity: 0, x: 50, y: 100 }}
                        animate={{ opacity: 1, x: 0, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        onClick={() => {
                            handleNotificationItemClick(latestOrder);
                            setShowNewOrderToast(false);
                        }}
                        className="fixed bottom-6 right-6 z-[200] bg-white dark:bg-slate-800 p-1 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex flex-col w-[320px] border border-emerald-100 dark:border-emerald-900/30 overflow-hidden cursor-pointer hover:scale-[1.02] transition-transform group"
                    >
                        <div className="bg-emerald-600 p-4 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white shrink-0">
                                <ShoppingCart size={20} className="animate-bounce" />
                            </div>
                            <div>
                                <h4 className="text-white font-black text-sm uppercase tracking-wider">{t('dashboard.notifications.new_order')}!</h4>
                                <p className="text-emerald-100 text-[10px] font-bold">{t('dashboard.notifications.toast_message')}</p>
                            </div>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowNewOrderToast(false);
                                }}
                                className="ml-auto text-white/60 hover:text-white"
                            >
                                <XCircle size={18} />
                            </button>
                        </div>
                        <div className="p-4 bg-white dark:bg-slate-800">
                            <div className="flex items-center gap-4">
                                <div className="flex-1">
                                    <p className="text-slate-900 dark:text-white font-extrabold text-base truncate">{latestOrder.customerName}</p>
                                    <p className="text-slate-500 dark:text-slate-400 text-xs italic line-clamp-1">{latestOrder.details}</p>
                                </div>
                                <div className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl text-[10px] font-black shrink-0">
                                    {t('dashboard.notifications.view_now')}
                                </div>
                            </div>
                        </div>
                        <div className="h-1 bg-emerald-100 dark:bg-slate-700 w-full overflow-hidden">
                            <motion.div
                                initial={{ width: "100%" }}
                                animate={{ width: "0%" }}
                                transition={{ duration: 8, ease: "linear" }}
                                className="h-full bg-emerald-600"
                            />
                        </div>
                    </motion.div>
                )}

                {showUpdateError && (
                    <motion.div
                        initial={{ opacity: 0, x: 50, y: -20 }}
                        animate={{ opacity: 1, x: 0, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="fixed top-6 right-6 z-[100] bg-red-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border border-red-500/20 backdrop-blur-sm"
                    >
                        <div className="bg-white/20 p-2 rounded-xl">
                            <XCircle size={20} className="animate-pulse" />
                        </div>
                        <div>
                            <p className="font-bold">{t('dashboard.recent_orders.actions.update_failed')}</p>
                        </div>
                    </motion.div>
                )}

                {showActionError && (
                    <motion.div
                        initial={{ opacity: 0, x: 50, y: -20 }}
                        animate={{ opacity: 1, x: 0, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="fixed top-6 right-6 z-[100] bg-red-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border border-red-500/20 backdrop-blur-sm"
                    >
                        <div className="bg-white/20 p-2 rounded-xl">
                            <XCircle size={20} className="animate-pulse" />
                        </div>
                        <div>
                            <p className="font-bold">{t('dashboard.recent_orders.actions.action_failed')}</p>
                        </div>
                    </motion.div>
                )}

                {
                    showDeleteSuccess && (
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
                    )
                }

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
                                            {t('dashboard.recent_orders.table.customer')}
                                        </label>
                                        <input
                                            type="text"
                                            value={editingOrder.rawDetails?.customerName || ''}
                                            onChange={(e) => updateEditingField('customerName', e.target.value)}
                                            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 outline-none transition-all dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                            {t('dashboard.recent_orders.table.email')}
                                        </label>
                                        <input
                                            type="email"
                                            value={editingOrder.rawDetails?.customerEmail || ''}
                                            onChange={(e) => updateEditingField('customerEmail', e.target.value)}
                                            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 outline-none transition-all dark:text-white"
                                        />
                                    </div>

                                    {/* Row 2 */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                            {t('dashboard.recent_orders.table.whatsapp')}
                                        </label>
                                        <input
                                            type="text"
                                            value={editingOrder.rawDetails?.customerPhone || ''}
                                            onChange={(e) => updateEditingField('customerPhone', e.target.value)}
                                            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 outline-none transition-all dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                            {t('dashboard.recent_orders.table.company')}
                                        </label>
                                        <input
                                            type="text"
                                            value={editingOrder.rawDetails?.customerCompany || ''}
                                            onChange={(e) => updateEditingField('customerCompany', e.target.value)}
                                            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 outline-none transition-all dark:text-white"
                                        />
                                    </div>

                                    {/* Row 3 - NEW: Order Package Added */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                            {t('dashboard.recent_orders.table.order_package')}
                                        </label>
                                        <select
                                            value={editingOrder.rawDetails?.orderPackage || 'starter'}
                                            onChange={(e) => updateEditingField('orderPackage', e.target.value)}
                                            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 outline-none transition-all dark:text-white cursor-pointer"
                                        >
                                            <option value="starter">{t('order_page.form.options.package_starter')}</option>
                                            <option value="enterprise">{t('order_page.form.options.package_enterprise')}</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                            {t('dashboard.recent_orders.table.tech_stack')}
                                        </label>
                                        <select
                                            value={editingOrder.rawDetails?.techStack || ''}
                                            onChange={(e) => updateEditingField('techStack', e.target.value)}
                                            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 outline-none transition-all dark:text-white cursor-pointer"
                                        >
                                            <option value="">{t('order_page.form.placeholders.tech_stack')}</option>
                                            <option value="react">{t('order_page.form.options.tech_react')}</option>
                                            <option value="nextjs">{t('order_page.form.options.tech_next')}</option>
                                            <option value="vue">{t('order_page.form.options.tech_vue')}</option>
                                            <option value="wordpress">{t('order_page.form.options.tech_wordpress')}</option>
                                            <option value="laravel">{t('order_page.form.options.tech_laravel')}</option>
                                            <option value="html-css-js">{t('order_page.form.options.tech_html')}</option>
                                            <option value="other">{t('order_page.form.options.tech_other')}</option>
                                        </select>
                                    </div>
                                    {/* Row 4: Status and Total side by side */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                            {t('dashboard.recent_orders.table.status')}
                                        </label>
                                        <select
                                            value={editingOrder.rawDetails?.status || 'pending'}
                                            onChange={(e) => updateEditingField('status', e.target.value)}
                                            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 outline-none transition-all dark:text-white cursor-pointer font-bold"
                                        >
                                            <option value="pending" className="text-yellow-600">{t('dashboard.recent_orders.status.pending')}</option>
                                            <option value="completed" className="text-emerald-600">{t('dashboard.recent_orders.status.completed')}</option>
                                            <option value="cancelled" className="text-red-600">{t('dashboard.recent_orders.status.cancelled')}</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                            {t('dashboard.recent_orders.table.total')} (IDR)
                                        </label>
                                        <div className="relative">
                                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">Rp</div>
                                            <input
                                                type="number"
                                                value={editingOrder.rawDetails?.total || 0}
                                                onChange={(e) => updateEditingField('total', parseFloat(e.target.value) || 0)}
                                                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 pl-10 focus:ring-2 focus:ring-emerald-500 outline-none transition-all dark:text-white font-mono"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                        {t('dashboard.recent_orders.table.message')}
                                    </label>
                                    <textarea
                                        value={editingOrder.rawDetails?.message || ''}
                                        onChange={(e) => updateEditingField('message', e.target.value)}
                                        rows={4}
                                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 outline-none transition-all dark:text-white resize-none custom-scrollbar"
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
                                        className="flex-1 px-6 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 shadow-lg shadow-emerald-500/30 transition-all text-sm"
                                    >
                                        {t('dashboard.recent_orders.actions.save')}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )
                }
            </AnimatePresence >

            {/* Delete Confirmation Modal */}
            < AnimatePresence >
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
            </AnimatePresence >

            {/* Logout Confirmation Modal */}
            < AnimatePresence >
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
            </AnimatePresence >

            {/* Discard Changes (Edit Modal) Confirmation */}
            < AnimatePresence >
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
            </AnimatePresence >
        </>
    );
};

export default DashboardPage;
