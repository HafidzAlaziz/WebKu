import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus, Edit2, Trash2, Search, Filter, Database,
    AlertCircle, X, RefreshCw, Upload,
    FileText as BlogIcon, ChevronLeft, ChevronRight,
    Eye, Globe, User, Tag, Calendar, CheckCircle,
    Check, XCircle, Clock
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useBlog } from '../hooks/useBlog';
import { translateText } from '../utils/translateUtils';
import BlogForm from './BlogForm';

const BlogManager = ({ selectedPostId, onClearSelection }) => {
    const { t, i18n } = useTranslation();
    const {
        posts, pendingPosts, loading, error,
        fetchPosts, fetchPendingPosts,
        addPost, updatePost, deletePost, updatePostStatus
    } = useBlog();

    const [activeTab, setActiveTab] = useState('all'); // 'all' | 'pending'

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingPost, setEditingPost] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const [postToDelete, setPostToDelete] = useState(null);
    const [confirmationModal, setConfirmationModal] = useState({ isOpen: false, type: null, id: null });
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    // Searchable Filter State
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filterSearch, setFilterSearch] = useState('');
    const filterRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (filterRef.current && !filterRef.current.contains(event.target)) {
                setIsFilterOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast(prev => ({ ...prev, show: false })), 4000);
    };

    useEffect(() => {
        if (activeTab === 'pending') {
            fetchPendingPosts();
        } else {
            fetchPosts();
        }
    }, [activeTab, fetchPosts, fetchPendingPosts]);

    // Handle Deep Linking from Notification
    useEffect(() => {
        if (selectedPostId && (posts.length > 0 || pendingPosts.length > 0)) {
            const targetPost = pendingPosts.find(p => p.id === selectedPostId) || posts.find(p => p.id === selectedPostId);

            if (targetPost) {
                setEditingPost(targetPost);
                setIsFormOpen(true);

                // Switch tab if needed
                if (targetPost.status === 'pending') {
                    setActiveTab('pending');
                } else {
                    setActiveTab('all');
                }

                // Clear the selection so it doesn't reopen on close
                if (onClearSelection) onClearSelection();
            }
        }
    }, [selectedPostId, posts, pendingPosts, onClearSelection]);

    useEffect(() => {
        setCategoryFilter('All');
        setCurrentPage(1);
    }, [i18n.language]);

    const handleEdit = (post) => {
        setEditingPost(post);
        setIsFormOpen(true);
    };

    const handleDeleteClick = (id) => {
        setPostToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (postToDelete) {
            const result = await deletePost(postToDelete);
            if (result.success) {
                showToast(t('dashboard.blog.actions.delete_success'), 'success');
                setIsDeleteModalOpen(false);
                setPostToDelete(null);
            } else {
                showToast(t('dashboard.blog.actions.delete_failed') + ': ' + result.error, 'error');
            }
        }
    };

    const handleApprove = (id) => {
        setConfirmationModal({ isOpen: true, type: 'approve', id });
    };

    const handleReject = (id) => {
        setConfirmationModal({ isOpen: true, type: 'reject', id });
    };

    const confirmAction = async () => {
        const { type, id } = confirmationModal;
        if (!type || !id) return;

        let result;
        if (type === 'approve') {
            result = await updatePostStatus(id, 'approved');
            if (result.success) {
                showToast(t('dashboard.blog.actions.approve_success'), 'success');
            } else {
                showToast(t('dashboard.blog.actions.approve_failed') + ': ' + result.error, 'error');
            }
        } else if (type === 'reject') {
            result = await updatePostStatus(id, 'rejected');
            if (result.success) {
                showToast(t('dashboard.blog.actions.reject_success'), 'success');
            } else {
                showToast(t('dashboard.blog.actions.reject_failed') + ': ' + result.error, 'error');
            }
        }
        setConfirmationModal({ isOpen: false, type: null, id: null });
    };

    const currentLang = i18n.language.split('-')[0];

    // Determine which posts to display based on active tab
    const sourcePosts = activeTab === 'pending' ? pendingPosts : posts;

    const translatedPosts = useMemo(() => {
        return sourcePosts.map(p => ({
            ...p,
            displayTitle: p.translations?.[currentLang]?.title || p.title,
            displayCategory: p.translations?.[currentLang]?.category || p.category,
        }));
    }, [sourcePosts, currentLang]);

    const categories = useMemo(() => {
        return Array.from(new Set(translatedPosts.map(p => p.displayCategory)))
            .filter(c => c && c.trim() !== '' && c !== 'All');
    }, [translatedPosts]);

    const filteredPosts = useMemo(() => {
        return translatedPosts.filter(p => {
            const matchesSearch = p.displayTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.displayCategory.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = categoryFilter === 'All' || p.displayCategory === categoryFilter;
            return matchesSearch && matchesCategory;
        });
    }, [translatedPosts, searchQuery, categoryFilter]);

    const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedPosts = filteredPosts.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div className="space-y-6">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <BlogIcon size={24} className="text-blue-500" />
                        {t('dashboard.blog.title')}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        {t('dashboard.blog.subtitle')}
                    </p>
                </div>
                <button
                    onClick={() => {
                        setEditingPost(null);
                        setIsFormOpen(true);
                    }}
                    className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
                >
                    <Plus size={18} />
                    {t('dashboard.blog.add_button')}
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl">
                            <BlogIcon size={24} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t('dashboard.blog.stats.total_posts')}</p>
                            <p className="text-2xl font-black text-slate-900 dark:text-white">{posts.length}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-xl">
                            <Tag size={24} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t('dashboard.blog.stats.total_categories')}</p>
                            <p className="text-2xl font-black text-slate-900 dark:text-white">{categories.length}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-xl">
                            <Calendar size={24} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t('dashboard.blog.stats.last_post')}</p>
                            <p className="text-sm font-bold text-slate-900 dark:text-white">
                                {posts.length > 0 ? new Date(posts[0].date).toLocaleDateString() : '-'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 border-b border-slate-200 dark:border-slate-700">
                <button
                    onClick={() => setActiveTab('all')}
                    className={`pb-3 px-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${activeTab === 'all'
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                        }`}
                >
                    <BlogIcon size={16} />
                    {t('dashboard.blog.menu.all_posts') || 'All Posts'}
                </button>
                <button
                    onClick={() => setActiveTab('pending')}
                    className={`pb-3 px-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${activeTab === 'pending'
                        ? 'border-amber-500 text-amber-600 dark:text-amber-400'
                        : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                        }`}
                >
                    <Clock size={16} />
                    {t('dashboard.blog.menu.pending') || 'Pending Review'}
                    {pendingPosts.length > 0 && (
                        <span className="bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400 px-2 py-0.5 rounded-full text-xs animate-pulse font-bold border border-yellow-200 dark:border-yellow-700/50">
                            {pendingPosts.length}
                        </span>
                    )}
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder={t('dashboard.blog.search_placeholder')}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all dark:text-white text-sm"
                    />
                </div>

                {/* Searchable Category Dropdown */}
                <div className="relative sm:w-56" ref={filterRef}>
                    <button
                        onClick={() => {
                            setIsFilterOpen(!isFilterOpen);
                            setFilterSearch('');
                        }}
                        className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all dark:text-white text-sm text-left flex items-center justify-between"
                    >
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <span className="truncate block mr-2">
                            {categoryFilter === 'All' ? t('dashboard.blog.filters.all_categories') : categoryFilter}
                        </span>
                        <ChevronLeft size={16} className={`text-slate-400 transition-transform ${isFilterOpen ? '-rotate-90' : '-rotate-180'}`} />
                    </button>

                    {/* Dropdown Menu */}
                    <AnimatePresence>
                        {isFilterOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="absolute right-0 mt-2 w-full bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 z-20 overflow-hidden"
                            >
                                <div className="p-2 border-b border-slate-100 dark:border-slate-700">
                                    <input
                                        type="text"
                                        placeholder="Cari kategori..."
                                        value={filterSearch}
                                        onChange={(e) => setFilterSearch(e.target.value)}
                                        onClick={(e) => e.stopPropagation()}
                                        className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                                        autoFocus
                                    />
                                </div>
                                <div className="max-h-[200px] overflow-y-auto p-1 custom-scrollbar">
                                    <button
                                        onClick={() => {
                                            setCategoryFilter('All');
                                            setIsFilterOpen(false);
                                        }}
                                        className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition-colors flex items-center justify-between group ${categoryFilter === 'All'
                                            ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                                            : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                                            }`}
                                    >
                                        <span>{t('dashboard.blog.filters.all_categories')}</span>
                                        {categoryFilter === 'All' && <CheckCircle size={12} />}
                                    </button>

                                    {categories
                                        .filter(c => c.toLowerCase().includes(filterSearch.toLowerCase()))
                                        .map(c => (
                                            <button
                                                key={c}
                                                onClick={() => {
                                                    setCategoryFilter(c);
                                                    setIsFilterOpen(false);
                                                }}
                                                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-between group ${categoryFilter === c
                                                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                                                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                                                    }`}
                                            >
                                                <span className="truncate">{c}</span>
                                                {categoryFilter === c && <CheckCircle size={12} />}
                                            </button>
                                        ))
                                    }
                                    {categories.filter(c => c.toLowerCase().includes(filterSearch.toLowerCase())).length === 0 && (
                                        <div className="px-3 py-4 text-center text-xs text-slate-400 italic">
                                            Tidak ditemukan
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Posts Table */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
                {/* ... existing table code ... */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">{t('dashboard.blog.table.article')}</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">{t('dashboard.blog.table.category')}</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">{t('dashboard.blog.table.date')}</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">{t('dashboard.blog.table.actions')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                            {loading && posts.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-12 text-center text-slate-400">
                                        <RefreshCw className="animate-spin mx-auto mb-2" />
                                        {t('common.loading')}
                                    </td>
                                </tr>
                            ) : paginatedPosts.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-12 text-center text-slate-400">
                                        {t('dashboard.blog.table.empty')}
                                    </td>
                                </tr>
                            ) : (
                                paginatedPosts.map((post) => (
                                    <tr key={post.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-600 flex-shrink-0">
                                                    <img src={post.image || null} alt={post.title} className="w-full h-full object-cover" />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-900 dark:text-white line-clamp-1">{post.displayTitle}</div>
                                                    <div className="text-xs text-slate-500 flex items-center gap-1">
                                                        <User size={12} /> {post.author}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full text-xs font-bold border border-slate-200 dark:border-slate-600">
                                                {post.displayCategory}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                                            {new Date(post.date).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {activeTab === 'pending' ? (
                                                    <>
                                                        <button
                                                            onClick={() => handleApprove(post.id)}
                                                            className="p-2 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-all"
                                                            title="Approve"
                                                        >
                                                            <Check size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleReject(post.id)}
                                                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                                                            title="Reject"
                                                        >
                                                            <XCircle size={16} />
                                                        </button>
                                                        <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-1"></div>
                                                    </>
                                                ) : null}
                                                <button
                                                    onClick={() => handleEdit(activeTab === 'pending' ? pendingPosts.find(p => p.id === post.id) : posts.find(p => p.id === post.id))}
                                                    className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(post.id)}
                                                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                {filteredPosts.length > 0 && (
                    <div className="px-4 md:px-6 py-4 border-t border-slate-100 dark:border-slate-700 flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="text-xs md:text-sm text-slate-500 dark:text-slate-400 text-center md:text-left">
                            {t('dashboard.pagination.showing')} {startIndex + 1} {t('dashboard.pagination.to')} {Math.min(startIndex + itemsPerPage, filteredPosts.length)} {t('dashboard.pagination.of')} {filteredPosts.length} {t('dashboard.blog.stats.total_posts')}
                        </div>
                        <div className="flex flex-wrap items-center justify-center gap-4">
                            <div className="flex items-center gap-2">
                                <label className="text-sm text-slate-500 dark:text-slate-400">{t('dashboard.pagination.per_page')}:</label>
                                <select
                                    value={itemsPerPage}
                                    onChange={(e) => {
                                        setItemsPerPage(Number(e.target.value));
                                        setCurrentPage(1);
                                    }}
                                    className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium cursor-pointer outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                                >
                                    <option value={5}>5</option>
                                    <option value={10}>10</option>
                                    <option value={20}>20</option>
                                </select>
                            </div>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                    disabled={currentPage === 1}
                                    className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <ChevronLeft size={18} className="text-slate-600 dark:text-slate-300" />
                                </button>
                                <div className="px-4 py-1.5 text-sm font-medium text-slate-700 dark:text-slate-200">
                                    {currentPage} / {totalPages}
                                </div>
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                    disabled={currentPage === totalPages}
                                    className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <ChevronRight size={18} className="text-slate-600 dark:text-slate-300" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Blog Form Modal */}
            {isFormOpen && (
                <BlogForm
                    isOpen={isFormOpen}
                    onClose={() => setIsFormOpen(false)}
                    post={editingPost}
                    onSave={editingPost ? updatePost : addPost}
                    showToast={showToast}
                />
            )}

            {/* Delete Confirmation */}
            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
            />

            {/* Approve/Reject Confirmation */}
            <ConfirmationModal
                isOpen={confirmationModal.isOpen}
                onClose={() => setConfirmationModal({ isOpen: false, type: null, id: null })}
                onConfirm={confirmAction}
                type={confirmationModal.type}
            />

            {/* Notification Toast */}
            <AnimatePresence>
                {toast.show && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className={`fixed top-10 left-4 right-4 md:left-auto md:right-10 md:w-auto md:max-w-sm z-[400] px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-4 border backdrop-blur-md ${toast.type === 'error'
                            ? 'bg-red-600/95 text-white border-white/20'
                            : 'bg-emerald-600/95 text-white border-white/20'
                            }`}
                    >
                        <div className="bg-white/20 p-2 rounded-xl flex-shrink-0">
                            {toast.type === 'error' ? <AlertCircle size={20} className="animate-pulse" /> : <CheckCircle size={20} className="animate-bounce" />}
                        </div>
                        <div className="flex-1 min-w-0">
                            <span className="font-bold text-sm block truncate">{toast.message}</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// BlogForm component has been moved to ./BlogForm.jsx

const DeleteModal = ({ isOpen, onClose, onConfirm }) => {
    const { t } = useTranslation();
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white dark:bg-slate-800 w-full max-w-sm rounded-3xl p-8 text-center"
            >
                <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Trash2 size={40} />
                </div>
                <h3 className="text-2xl font-bold dark:text-white mb-2">{t('dashboard.blog.delete_confirm.title')}</h3>
                <p className="text-slate-500 mb-8">{t('dashboard.blog.delete_confirm.message')}</p>
                <div className="flex gap-3">
                    <button onClick={onClose} className="flex-1 py-3 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-white font-bold rounded-xl hover:bg-slate-200 transition-all">{t('dashboard.blog.delete_confirm.cancel')}</button>
                    <button onClick={onConfirm} className="flex-1 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all">{t('dashboard.blog.delete_confirm.confirm')}</button>
                </div>
            </motion.div>
        </div>
    );
};

const ConfirmationModal = ({ isOpen, onClose, onConfirm, type }) => {
    const { t } = useTranslation();
    if (!isOpen) return null;

    const isApprove = type === 'approve';
    const config = isApprove ? {
        icon: <CheckCircle size={40} />,
        bg: 'bg-emerald-100 dark:bg-emerald-900/30',
        text: 'text-emerald-600',
        title: t('dashboard.blog.approve_confirm.title'),
        message: t('dashboard.blog.approve_confirm.message'),
        confirmBtn: 'bg-emerald-600 hover:bg-emerald-700',
        confirmText: t('dashboard.blog.approve_confirm.confirm'),
        cancelText: t('dashboard.blog.approve_confirm.cancel')
    } : {
        icon: <XCircle size={40} />,
        bg: 'bg-red-100 dark:bg-red-900/30',
        text: 'text-red-600',
        title: t('dashboard.blog.reject_confirm_modal.title'),
        message: t('dashboard.blog.reject_confirm_modal.message'),
        confirmBtn: 'bg-red-600 hover:bg-red-700',
        confirmText: t('dashboard.blog.reject_confirm_modal.confirm'),
        cancelText: t('dashboard.blog.reject_confirm_modal.cancel')
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white dark:bg-slate-800 w-full max-w-sm rounded-3xl p-8 text-center"
            >
                <div className={`w-20 h-20 ${config.bg} ${config.text} rounded-full flex items-center justify-center mx-auto mb-6`}>
                    {config.icon}
                </div>
                <h3 className="text-2xl font-bold dark:text-white mb-2">{config.title}</h3>
                <p className="text-slate-500 mb-8">{config.message}</p>
                <div className="flex gap-3">
                    <button onClick={onClose} className="flex-1 py-3 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-white font-bold rounded-xl hover:bg-slate-200 transition-all">{config.cancelText}</button>
                    <button onClick={onConfirm} className={`flex-1 py-3 text-white font-bold rounded-xl transition-all ${config.confirmBtn}`}>{config.confirmText}</button>
                </div>
            </motion.div>
        </div>
    );
};

export default BlogManager;
