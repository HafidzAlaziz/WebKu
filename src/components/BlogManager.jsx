import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus, Edit2, Trash2, Search, Filter, Database,
    AlertCircle, X, Sparkles, RefreshCw, Upload,
    FileText as BlogIcon, ChevronLeft, ChevronRight,
    Eye, Globe, User, Tag, Calendar, CheckCircle
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useBlog } from '../hooks/useBlog';
import { translateText } from '../utils/translateUtils';

const BlogManager = () => {
    const { t, i18n } = useTranslation();
    const { posts, loading, error, fetchPosts, addPost, updatePost, deletePost } = useBlog();

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingPost, setEditingPost] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [postToDelete, setPostToDelete] = useState(null);
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
        fetchPosts();
    }, [fetchPosts]);

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
                showToast(t('dashboard.recent_orders.actions.delete_success'), 'success');
                setIsDeleteModalOpen(false);
                setPostToDelete(null);
            } else {
                showToast(t('dashboard.recent_orders.actions.action_failed') + ': ' + result.error, 'error');
            }
        }
    };

    const currentLang = i18n.language.split('-')[0];

    const translatedPosts = useMemo(() => {
        return posts.map(p => ({
            ...p,
            displayTitle: p.translations?.[currentLang]?.title || p.title,
            displayCategory: p.translations?.[currentLang]?.category || p.category,
        }));
    }, [posts, currentLang]);

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
                                                <button
                                                    onClick={() => handleEdit(posts.find(p => p.id === post.id))}
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

            {/* Notification Toast */}
            <AnimatePresence>
                {toast.show && (
                    <motion.div
                        initial={{ opacity: 0, x: 50, y: -20 }}
                        animate={{ opacity: 1, x: 0, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className={`fixed top-6 right-6 z-[200] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border backdrop-blur-sm ${toast.type === 'error'
                            ? 'bg-red-600 text-white border-red-500/20'
                            : 'bg-emerald-600 text-white border-emerald-500/20'
                            }`}
                    >
                        <div className="bg-white/20 p-2 rounded-xl">
                            {toast.type === 'error' ? <AlertCircle size={20} className="animate-pulse" /> : <CheckCircle size={20} className="animate-bounce" />}
                        </div>
                        <div>
                            <span className="font-bold text-sm">{toast.message}</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const BlogForm = ({ isOpen, onClose, post, onSave, showToast }) => {
    const { t, i18n } = useTranslation();
    const { uploadImage } = useBlog();
    const [loading, setLoading] = useState(false);
    const [activeLang, setActiveLang] = useState('en');
    const [isTranslating, setIsTranslating] = useState(false);
    const [errors, setErrors] = useState({});
    const [showErrors, setShowErrors] = useState(false);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [showUnsavedModal, setShowUnsavedModal] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const fileInputRef = useRef(null);
    const [initialFormData, setInitialFormData] = useState(null);

    const [activeTab, setActiveTab] = useState('general');

    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        category: '',
        excerpt: '',
        keywords: '',
        content: '',
        image: '',
        author: t('dashboard.blog.form.placeholders.author_default'),
        date: new Date().toISOString().split('T')[0],
        translations: {}
    });

    useEffect(() => {
        if (post) {
            const data = {
                ...post,
                title: post.title || '',
                slug: post.slug || '',
                category: post.category || '',
                excerpt: post.excerpt || '',
                keywords: post.keywords || '',
                content: post.content || '',
                image: post.image || '',
                author: post.author || t('dashboard.blog.form.placeholders.author_default'),
                date: new Date(post.date).toISOString().split('T')[0],
                translations: post.translations || {}
            };
            setFormData(data);
            setInitialFormData(JSON.stringify(data));
        } else {
            const emptyData = {
                title: '',
                slug: '',
                category: '',
                excerpt: '',
                keywords: '',
                content: '',
                image: '',
                author: t('dashboard.blog.form.placeholders.author_default'),
                date: new Date().toISOString().split('T')[0],
                translations: {}
            };
            setInitialFormData(JSON.stringify(emptyData));
        }
    }, [post]);

    useEffect(() => {
        if (initialFormData) {
            const currentData = JSON.stringify(formData);
            setHasUnsavedChanges(currentData !== initialFormData);
        }
    }, [formData, initialFormData]);

    const handleFieldChange = (field, value) => {
        // Clear error when user types
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: null }));
        }

        setFormData(prev => {
            const newData = { ...prev, [field]: value };

            // Auto-generate slug from title if it's a new post or if title is changed
            if (field === 'title' && (!post || prev.slug === post.slug)) {
                newData.slug = value
                    .toLowerCase()
                    .replace(/[^\w ]+/g, '')
                    .replace(/ +/g, '-');
            }

            return newData;
        });
    };

    const handleTranslationChange = (lang, field, value) => {
        setFormData(prev => ({
            ...prev,
            translations: {
                ...prev.translations,
                [lang]: {
                    ...prev.translations[lang],
                    [field]: value
                }
            }
        }));
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        await processUpload(file);
    };

    const handlePaste = async (e) => {
        const item = Array.from(e.clipboardData.items).find(i => i.type.startsWith('image/'));
        if (item) {
            const file = item.getAsFile();
            if (file) await processUpload(file);
        }
    };
    const processUpload = async (file) => {
        if (!file.type.startsWith('image/')) {
            showToast(t('dashboard.portfolio.form.upload.error.type'), 'error');
            return;
        }

        const maxSize = 1 * 1024 * 1024; // 1MB
        if (file.size > maxSize) {
            showToast(t('dashboard.portfolio.form.upload.error.size'), 'error');
            return;
        }

        setLoading(true);
        const result = await uploadImage(file);
        setLoading(false);

        if (result.success) {
            handleFieldChange('image', result.url);
            showToast(t('dashboard.portfolio.form.upload.success'), 'success');
        } else {
            showToast(result.error, 'error');
        }
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            await processUpload(e.dataTransfer.files[0]);
        }
    };

    // Fix: Global paste listener scoped to hover state
    useEffect(() => {
        if (!isOpen) return;

        const onGlobalPaste = (e) => {
            // Only capture paste if user is hovering over the upload area
            if (isHovered) {
                handlePaste(e);
            }
        };

        window.addEventListener('paste', onGlobalPaste);
        return () => window.removeEventListener('paste', onGlobalPaste);
    }, [isOpen, isHovered]);

    const handleAutoTranslate = async () => {
        const targetLangs = ['id', 'es', 'fr', 'ja', 'en'];

        // Determine source data based on active language
        let sourceTitle = '';
        let sourceCategory = '';
        let sourceExcerpt = '';
        let sourceKeywords = '';
        let sourceContent = '';
        let sourceLang = activeLang;

        if (activeLang === 'en') {
            sourceTitle = formData.title;
            sourceCategory = formData.category;
            sourceExcerpt = formData.excerpt;
            sourceKeywords = formData.keywords;
            sourceContent = formData.content;
        } else {
            const trans = formData.translations[activeLang];
            if (trans) {
                sourceTitle = trans.title;
                sourceCategory = trans.category;
                sourceExcerpt = trans.excerpt;
                sourceKeywords = trans.keywords;
                sourceContent = trans.content;
            }
        }

        // Validate source content
        if (!sourceTitle || !sourceContent) {
            showToast(t('dashboard.blog.form.translate.fill_en_first'), 'error');
            return;
        }

        setIsTranslating(true);
        // Create a copy of translations, ensuring deep copy for all existing langs
        const newTranslations = JSON.parse(JSON.stringify(formData.translations));
        // Prepare separate EN fields (since they are root)
        let newRootFields = {};

        try {
            for (const lang of targetLangs) {
                if (lang === sourceLang) continue; // Skip translating to itself

                const translatedTitle = await translateText(sourceTitle, lang, sourceLang);
                const translatedCategory = await translateText(sourceCategory, lang, sourceLang);
                const translatedExcerpt = await translateText(sourceExcerpt, lang, sourceLang);
                const translatedKeywords = await translateText(sourceKeywords, lang, sourceLang);
                const translatedContent = await translateText(sourceContent, lang, sourceLang);

                if (lang === 'en') {
                    // Update root fields for EN
                    newRootFields = {
                        title: translatedTitle,
                        category: translatedCategory,
                        excerpt: translatedExcerpt,
                        keywords: translatedKeywords,
                        content: translatedContent
                    };
                } else {
                    // Update translations object for others
                    newTranslations[lang] = {
                        title: translatedTitle,
                        category: translatedCategory,
                        excerpt: translatedExcerpt,
                        keywords: translatedKeywords,
                        content: translatedContent
                    };
                }
            }

            setFormData(prev => ({
                ...prev,
                ...newRootFields,
                translations: newTranslations
            }));

            // Clear translation errors and showErrors state
            setErrors(prev => {
                const n = { ...prev };
                Object.keys(n).forEach(k => {
                    if (k.startsWith('trans_')) delete n[k];
                });
                return n;
            });
            setShowErrors(false);

            showToast(t('dashboard.blog.form.translate.success'), 'success');
        } catch (err) {
            console.error('Translation error:', err);
            showToast(t('dashboard.blog.form.translate.failed'), 'error');
        } finally {
            setIsTranslating(false);
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.title.trim()) newErrors.title = true;
        if (!formData.slug.trim()) newErrors.slug = true;
        if (!formData.category.trim()) newErrors.category = true;
        if (!formData.excerpt.trim()) newErrors.excerpt = true;
        if (!formData.keywords.trim()) newErrors.keywords = true;
        if (!formData.content.trim()) newErrors.content = true;

        // Validate translations (mandatory)
        languages.forEach(lang => {
            if (lang.code !== 'en') {
                const trans = formData.translations[lang.code];
                if (!trans || !trans.title?.trim() || !trans.category?.trim() || !trans.excerpt?.trim() || !trans.keywords?.trim() || !trans.content?.trim()) {
                    newErrors[`trans_${lang.code}`] = true;
                }
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();

        setShowErrors(true);
        if (!validateForm()) {
            const hasTranslationErrors = Object.keys(errors).some(k => k.startsWith('trans_'));
            if (hasTranslationErrors) {
                showToast(t('dashboard.blog.form.validation.fill_translations'), 'error');
            } else {
                showToast(t('dashboard.blog.form.validation.fill_required'), 'error');
            }
            return;
        }

        setLoading(true);
        const result = post ? await onSave(post.id, formData) : await onSave(formData);
        setLoading(false);

        if (result.success) {
            setHasUnsavedChanges(false);
            showToast(post ? t('dashboard.blog.form.success.updated') : t('dashboard.blog.form.success.saved'), 'success');
            setTimeout(onClose, 1000);
        } else {
            showToast(t('common.save_failed') + ': ' + result.error, 'error');
        }
    };

    const handleClose = () => {
        if (hasUnsavedChanges) {
            setShowUnsavedModal(true);
        } else {
            onClose();
        }
    };

    const confirmClose = () => {
        setShowUnsavedModal(false);
        setHasUnsavedChanges(false);
        onClose();
    };

    const languages = [
        { code: 'en', label: 'English', flag: '🇬🇧' },
        { code: 'id', label: 'Indonesia', flag: '🇮🇩' },
        { code: 'es', label: 'Spanish', flag: '🇪🇸' },
        { code: 'fr', label: 'French', flag: '🇫🇷' },
        { code: 'ja', label: 'Japanese', flag: '🇯🇵' }
    ];

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="bg-white dark:bg-slate-800 w-full max-w-5xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col"
            >
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                    <h2 className="text-xl font-bold dark:text-white">
                        {post ? t('dashboard.blog.form.edit_title') : t('dashboard.blog.form.add_title')}
                    </h2>
                    <button onClick={handleClose} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-all">
                        <X size={20} className="dark:text-white" />
                    </button>
                </div>

                {/* Tab Navigation */}
                <div className="px-6 border-b border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800">
                    <div className="flex gap-6">
                        {(() => {
                            const hasGeneralErrors = errors.slug;
                            const hasContentErrors = errors.title || errors.category || errors.excerpt || errors.keywords || errors.content || Object.keys(errors).some(k => k.startsWith('trans_'));

                            return (
                                <>
                                    <button
                                        onClick={() => setActiveTab('general')}
                                        className={`py-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${activeTab === 'general'
                                            ? 'border-blue-600 text-blue-600'
                                            : hasGeneralErrors
                                                ? 'border-red-500/50 text-red-500 hover:text-red-600'
                                                : 'border-transparent text-slate-500 hover:text-slate-700'
                                            }`}
                                    >
                                        {t('dashboard.blog.form.sections.basic')}
                                        {hasGeneralErrors && <div className="w-2 h-2 bg-red-500 rounded-full animate-ping" />}
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('content')}
                                        className={`py-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${activeTab === 'content'
                                            ? 'border-blue-600 text-blue-600'
                                            : hasContentErrors
                                                ? 'border-red-500/50 text-red-500 hover:text-red-600'
                                                : 'border-transparent text-slate-500 hover:text-slate-700'
                                            }`}
                                    >
                                        {t('dashboard.blog.form.sections.content')}
                                        {hasContentErrors && <div className="w-2 h-2 bg-red-500 rounded-full animate-ping" />}
                                    </button>
                                </>
                            );
                        })()}
                    </div>
                </div>


                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-8">

                    {/* General Settings Tab */}
                    {activeTab === 'general' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <h4 className="font-bold text-blue-600 uppercase text-xs tracking-widest">{t('dashboard.blog.form.sections.basic')}</h4>

                                <div className="space-y-1">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">{t('dashboard.blog.form.labels.slug')}</label>
                                    <input
                                        type="text"
                                        value={formData.slug}
                                        onChange={(e) => handleFieldChange('slug', e.target.value)}
                                        className={`w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border ${errors.slug ? 'border-red-500 animate-pulse' : 'border-slate-200 dark:border-slate-700'} rounded-xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-all`}
                                        placeholder={t('dashboard.blog.form.placeholders.slug')}
                                    />
                                    <p className="text-[10px] text-slate-400 mt-1 italic">*{t('dashboard.blog.form.labels.slug_help') || 'Digunakan untuk URL artikel (misal: judul-artikel-anda)'}</p>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">{t('dashboard.blog.form.labels.author')}</label>
                                    <input
                                        type="text"
                                        value={formData.author}
                                        onChange={(e) => handleFieldChange('author', e.target.value)}
                                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none dark:text-white text-sm"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">{t('dashboard.blog.table.date')}</label>
                                    <input
                                        type="date"
                                        value={formData.date}
                                        onChange={(e) => handleFieldChange('date', e.target.value)}
                                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none dark:text-white text-sm"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h4 className="font-bold text-blue-600 uppercase text-xs tracking-widest">{t('dashboard.blog.form.sections.preview')}</h4>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">{t('dashboard.blog.form.labels.image')}</label>
                                    <div
                                        onDragEnter={handleDrag}
                                        onDragOver={handleDrag}
                                        onDragLeave={handleDrag}
                                        onDrop={handleDrop}
                                        onMouseEnter={() => setIsHovered(true)}
                                        onMouseLeave={() => setIsHovered(false)}
                                        onPaste={handlePaste}
                                        className={`relative border-2 border-dashed rounded-2xl p-4 text-center transition-all ${dragActive || isHovered
                                            ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20 ring-4 ring-blue-500/20 scale-[1.02]'
                                            : 'border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500'
                                            }`}
                                    >
                                        {formData.image ? (
                                            <div className="relative group rounded-xl overflow-hidden aspect-video">
                                                <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-3">
                                                    <button
                                                        type="button"
                                                        onClick={() => fileInputRef.current?.click()}
                                                        className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                                    >
                                                        <Edit2 size={18} />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleFieldChange('image', '')}
                                                        className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div
                                                onClick={() => fileInputRef.current?.click()}
                                                className="py-8 bg-slate-50 dark:bg-slate-900/50 rounded-xl cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
                                            >
                                                <Upload className={`mx-auto mb-2 transition-colors ${dragActive ? 'text-blue-500' : 'text-slate-400'}`} size={32} />
                                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t('dashboard.portfolio.form.upload.title')}</p>
                                                <p className="text-[10px] text-slate-400 mt-1">{t('dashboard.portfolio.form.upload.subtitle')}</p>
                                            </div>
                                        )}
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleImageUpload}
                                            className="hidden"
                                            id="blog-image-upload"
                                            accept="image/*"
                                        />
                                        <div className="mt-4">
                                            <input
                                                type="text"
                                                value={formData.image}
                                                onChange={(e) => handleFieldChange('image', e.target.value)}
                                                placeholder={t('dashboard.blog.form.placeholders.image_url')}
                                                className="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-xs dark:text-white focus:ring-2 focus:ring-blue-500 transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Content Settings Tab */}
                    {activeTab === 'content' && (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h4 className="font-bold text-blue-600 uppercase text-xs tracking-widest">{t('dashboard.blog.form.sections.content')}</h4>
                                <button
                                    type="button"
                                    onClick={handleAutoTranslate}
                                    disabled={isTranslating}
                                    className="flex items-center gap-2 px-4 py-1.5 bg-emerald-500 text-white rounded-lg text-xs font-bold hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                                >
                                    {isTranslating ? <RefreshCw className="animate-spin" size={12} /> : <Sparkles size={12} />}
                                    {t('dashboard.blog.form.buttons.translate')}
                                </button>
                            </div>

                            {/* Language Tabs */}
                            <div className="flex border-b border-slate-200 dark:border-slate-700 overflow-x-auto gap-2">
                                {languages.map(lang => {
                                    const hasError = showErrors && errors[`trans_${lang.code}`];
                                    return (
                                        <button
                                            key={lang.code}
                                            type="button"
                                            onClick={() => {
                                                setActiveLang(lang.code);
                                                if (hasError) {
                                                    setErrors(prev => ({ ...prev, [`trans_${lang.code}`]: false }));
                                                }
                                            }}
                                            className={`px-4 py-2 text-sm font-bold transition-all whitespace-nowrap border-b-2 flex items-center gap-2 ${activeLang === lang.code
                                                ? 'border-blue-500 text-blue-600'
                                                : hasError
                                                    ? 'border-red-500/50 text-red-500 hover:text-red-600'
                                                    : 'border-transparent text-slate-500 hover:text-slate-700'
                                                }`}
                                        >
                                            <span className="mr-1">{lang.flag}</span>
                                            {lang.label}
                                            {hasError && <div className="w-2 h-2 bg-red-500 rounded-full animate-ping" />}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Translation Content */}
                            <div className="space-y-6 pt-2">
                                {activeLang === 'en' ? (
                                    <div className="space-y-6">
                                        <div className="space-y-1">
                                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">{t('dashboard.blog.form.labels.title')}{t('dashboard.blog.form.labels.marker_en')}</label>
                                            <input
                                                type="text"
                                                value={formData.title}
                                                onChange={(e) => handleFieldChange('title', e.target.value)}
                                                className={`w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border ${errors.title ? 'border-red-500 animate-pulse' : 'border-slate-200 dark:border-slate-700'} rounded-xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-all`}
                                                placeholder={t('dashboard.blog.form.placeholders.title')}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">{t('dashboard.blog.form.labels.category')}{t('dashboard.blog.form.labels.marker_en')}</label>
                                            <input
                                                type="text"
                                                value={formData.category}
                                                onChange={(e) => handleFieldChange('category', e.target.value)}
                                                className={`w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border ${errors.category ? 'border-red-500 animate-pulse' : 'border-slate-200 dark:border-slate-700'} rounded-xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-all`}
                                                placeholder={t('dashboard.blog.form.placeholders.category')}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">{t('dashboard.blog.form.labels.excerpt')}{t('dashboard.blog.form.labels.marker_en')}</label>
                                            <textarea
                                                value={formData.excerpt}
                                                onChange={(e) => handleFieldChange('excerpt', e.target.value)}
                                                className={`w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border ${errors.excerpt ? 'border-red-500 animate-pulse' : 'border-slate-200 dark:border-slate-700'} rounded-xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white h-24 transition-all`}
                                                placeholder={t('dashboard.blog.form.placeholders.excerpt')}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">{t('dashboard.blog.form.labels.keywords')}{t('dashboard.blog.form.labels.marker_en')}</label>
                                            <input
                                                type="text"
                                                value={formData.keywords}
                                                onChange={(e) => handleFieldChange('keywords', e.target.value)}
                                                className={`w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border ${errors.keywords ? 'border-red-500 animate-pulse' : 'border-slate-200 dark:border-slate-700'} rounded-xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-all`}
                                                placeholder={t('dashboard.blog.form.placeholders.keywords')}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">{t('dashboard.blog.form.labels.content')}{t('dashboard.blog.form.labels.marker_en')}</label>
                                            <textarea
                                                value={formData.content}
                                                onChange={(e) => handleFieldChange('content', e.target.value)}
                                                className={`w-full px-4 py-4 bg-slate-50 dark:bg-slate-900 border ${errors.content ? 'border-red-500 animate-pulse' : 'border-slate-200 dark:border-slate-700'} rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white h-96 font-serif transition-all`}
                                                placeholder={t('dashboard.blog.form.placeholders.content')}
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        <div className="space-y-1">
                                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">{t('dashboard.blog.form.labels.title')}{t(`dashboard.blog.form.labels.marker_${activeLang}`)}</label>
                                            <input
                                                type="text"
                                                value={formData.translations[activeLang]?.title || ''}
                                                onChange={(e) => handleTranslationChange(activeLang, 'title', e.target.value)}
                                                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                                                placeholder="..."
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">{t('dashboard.blog.form.labels.category')}{t(`dashboard.blog.form.labels.marker_${activeLang}`)}</label>
                                            <input
                                                type="text"
                                                value={formData.translations[activeLang]?.category || ''}
                                                onChange={(e) => handleTranslationChange(activeLang, 'category', e.target.value)}
                                                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                                                placeholder="..."
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">{t('dashboard.blog.form.labels.excerpt')}{t(`dashboard.blog.form.labels.marker_${activeLang}`)}</label>
                                            <textarea
                                                value={formData.translations[activeLang]?.excerpt || ''}
                                                onChange={(e) => handleTranslationChange(activeLang, 'excerpt', e.target.value)}
                                                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white h-24"
                                                placeholder="..."
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">{t('dashboard.blog.form.labels.keywords')}{t(`dashboard.blog.form.labels.marker_${activeLang}`)}</label>
                                            <input
                                                type="text"
                                                value={formData.translations[activeLang]?.keywords || ''}
                                                onChange={(e) => handleTranslationChange(activeLang, 'keywords', e.target.value)}
                                                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                                                placeholder="..."
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">{t('dashboard.blog.form.labels.content')}{t(`dashboard.blog.form.labels.marker_${activeLang}`)}</label>
                                            <textarea
                                                value={formData.translations[activeLang]?.content || ''}
                                                onChange={(e) => handleTranslationChange(activeLang, 'content', e.target.value)}
                                                className="w-full px-4 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white h-96 font-serif"
                                                placeholder="..."
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </form>

                {/* Footer Actions */}
                <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-700 flex justify-end gap-3 bg-slate-50/50 dark:bg-slate-900/50">
                    <button
                        type="button"
                        onClick={handleClose}
                        className="px-6 py-2.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-bold hover:bg-slate-200 transition-all"
                    >
                        {t('dashboard.blog.form.buttons.cancel')}
                    </button>
                    <button
                        type="submit"
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-8 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 flex items-center gap-2"
                    >
                        {loading ? <RefreshCw className="animate-spin" size={18} /> : null}
                        {post ? t('dashboard.blog.form.buttons.update') : t('dashboard.blog.form.buttons.save')}
                    </button>
                </div>

                {/* Unsaved Changes Warning Modal */}
                {showUnsavedModal && (
                    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                            onClick={() => setShowUnsavedModal(false)}
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
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
                                        onClick={() => setShowUnsavedModal(false)}
                                        className="flex-1 px-6 py-3 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-200 font-bold rounded-xl hover:bg-slate-200 transition-all"
                                    >
                                        {t('dashboard.recent_orders.actions.edit_confirm.cancel')}
                                    </button>
                                    <button
                                        onClick={confirmClose}
                                        className="flex-1 px-6 py-3 bg-amber-600 text-white font-bold rounded-xl hover:bg-amber-700 shadow-lg shadow-amber-500/30 transition-all"
                                    >
                                        {t('dashboard.recent_orders.actions.edit_confirm.confirm')}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

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

export default BlogManager;
