import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Calendar, CheckCircle2, ChevronRight, Clock, Edit2, Eye, LayoutGrid, List, Send, Trash2, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { useBlog } from '../hooks/useBlog';

const MyArticlesModal = ({ isOpen, onClose, onEditArticle, refreshTrigger }) => {
    const { t } = useTranslation();
    const { user } = useAuth();
    const { deletePost, updatePostStatus, myArticles, loading: blogLoading, fetchMyArticles } = useBlog();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [postToDelete, setPostToDelete] = useState(null);
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
    };

    useEffect(() => {
        if (isOpen && user) {
            fetchMyArticles(user.id);
        }
    }, [isOpen, user, refreshTrigger, fetchMyArticles]);

    const handleDeleteClick = (id) => {
        setPostToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (postToDelete) {
            const result = await deletePost(postToDelete);
            if (result.success) {
                setIsDeleteModalOpen(false);
                setPostToDelete(null);
                showToast(t('dashboard.blog.actions.delete_success'), 'success');
            } else {
                showToast(t('dashboard.blog.actions.delete_failed') + ': ' + result.error, 'error');
                setIsDeleteModalOpen(false);
            }
        }
    };

    const handleResubmit = async (id) => {
        const result = await updatePostStatus(id, 'pending');

        if (result.success) {
            showToast(t('dashboard.blog.actions.resubmit_success'), 'success');
        } else {
            showToast(t('dashboard.blog.actions.resubmit_failed') + ': ' + result.error, 'error');
        }
    };

    if (!isOpen) return null;

    const articles = myArticles;
    const loading = blogLoading;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl overflow-hidden"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-3">
                        <h2 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
                            {t('dashboard.blog.my_articles')}
                        </h2>
                        {!loading && articles.length > 0 && (
                            <span className="px-3 py-1 bg-blue-500/10 text-blue-600 dark:bg-blue-400/10 dark:text-blue-400 rounded-full text-xs font-bold border border-blue-500/20">
                                {articles.length} {t('dashboard.blog.articles')}
                            </span>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
                    >
                        <X size={20} className="text-slate-500 dark:text-slate-400" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
                            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium animate-pulse">
                                {t('common.loading') || "Loading articles..."}
                            </p>
                        </div>
                    ) : articles.length === 0 ? (
                        <div className="text-center py-20">
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="w-24 h-24 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-700/50 dark:to-slate-800/50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-300 dark:text-slate-600 shadow-inner"
                            >
                                <LayoutGrid size={48} className="opacity-50" />
                            </motion.div>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                                {t('dashboard.blog.empty.title')}
                            </h3>
                            <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto text-sm leading-relaxed">
                                {t('dashboard.blog.empty.message')}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {articles.some(a => a.status === 'rejected') && (
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="bg-red-50/50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 p-4 sm:p-6 rounded-2xl flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4 mb-8 shadow-sm shadow-red-500/5 backdrop-blur-sm text-center sm:text-left"
                                >
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 dark:bg-red-500/20 rounded-xl flex items-center justify-center flex-shrink-0 animate-pulse border border-red-200/50 dark:border-red-500/30">
                                        <AlertCircle className="text-red-500" size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-sm font-bold text-red-800 dark:text-red-400 mb-1 flex items-center justify-center sm:justify-start gap-2">
                                            {t('dashboard.blog.notifications.rejection_help_title')}
                                            <span className="flex h-2 w-2 rounded-full bg-red-500 animate-ping" />
                                        </h4>
                                        <p className="text-xs text-red-700/80 dark:text-red-400/80 leading-relaxed font-medium">
                                            {t('dashboard.blog.rejection_help')}
                                        </p>
                                    </div>
                                </motion.div>
                            )}

                            <div className="grid gap-4">
                                <AnimatePresence mode="popLayout">
                                    {articles.map((article, index) => (
                                        <motion.div
                                            key={article.id}
                                            layout
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="group bg-white dark:bg-slate-800/40 rounded-2xl p-5 border border-slate-100 dark:border-slate-700/50 hover:border-blue-500/30 dark:hover:border-blue-400/30 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 flex flex-col sm:flex-row gap-5 justify-between items-start sm:items-center relative overflow-hidden"
                                        >
                                            {/* Accent lines */}
                                            <div className="absolute top-0 left-0 w-1 h-full bg-slate-100 dark:bg-slate-700 group-hover:bg-blue-500 transition-colors duration-300" />

                                            {/* Resubmit button for rejected articles at top-right */}
                                            {article.status === 'rejected' && (
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => handleResubmit(article.id)}
                                                    className="absolute top-4 right-4 z-10 flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold rounded-lg shadow-lg shadow-blue-500/30 transition-all border border-blue-500/50"
                                                    title={t('dashboard.blog.actions.resubmit')}
                                                >
                                                    <Send size={12} />
                                                    <span className="uppercase tracking-wider">
                                                        {t('dashboard.blog.actions.resubmit')}
                                                    </span>
                                                </motion.button>
                                            )}

                                            <div className="flex-1 min-w-0 pl-1">
                                                <h3 className="font-bold text-slate-800 dark:text-white mb-2 text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                                                    {article.title}
                                                </h3>
                                                <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400">
                                                    <span className="bg-slate-100/80 dark:bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-200/50 dark:border-slate-700/50 font-bold uppercase tracking-wider shadow-sm">
                                                        {article.category || t('dashboard.portfolio.gallery.filters.all')}
                                                    </span>
                                                    <span className="flex items-center gap-1.5 font-medium">
                                                        <Calendar size={12} className="text-slate-400" />
                                                        {new Date(article.created_at).toLocaleDateString(undefined, {
                                                            day: 'numeric', month: 'short', year: 'numeric'
                                                        })}
                                                    </span>
                                                    <span className="flex items-center gap-1.5 bg-blue-50/50 dark:bg-blue-900/10 px-2 py-1 rounded-lg">
                                                        <Eye size={12} className="text-blue-500 dark:text-blue-400" />
                                                        <span className="font-bold text-blue-600 dark:text-blue-300">
                                                            {article.views || 0}
                                                        </span>
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Status and Actions */}
                                            <div className="flex items-center gap-4 w-full sm:w-auto mt-2 sm:mt-0">
                                                <div className={`px-4 py-1.5 rounded-xl text-[11px] font-bold flex items-center gap-2 border ${article.status === 'approved'
                                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/30'
                                                    : article.status === 'rejected'
                                                        ? 'bg-red-50 text-red-700 border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800/30 animate-pulse shadow-lg shadow-red-500/10'
                                                        : 'bg-yellow-50 text-yellow-700 border-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800/30'
                                                    }`}>
                                                    {article.status === 'approved' ? (
                                                        <CheckCircle2 size={14} className="animate-bounce" />
                                                    ) : article.status === 'rejected' ? (
                                                        <AlertCircle size={14} className="animate-pulse" />
                                                    ) : (
                                                        <Clock size={14} className="animate-spin-slow" />
                                                    )}
                                                    <span className="uppercase tracking-widest leading-none">
                                                        {t(`dashboard.blog.status.${article.status}`)}
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-2 ml-auto sm:ml-0">
                                                    <button
                                                        onClick={() => {
                                                            // onEditArticle && onEditArticle(article);
                                                            // DO NOT close the modal, keep it in background
                                                            onEditArticle && onEditArticle(article);
                                                        }}
                                                        className="p-2.5 bg-white dark:bg-slate-800 text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:text-slate-400 dark:hover:text-blue-400 dark:hover:bg-blue-900/30 rounded-xl transition-all duration-300 border border-slate-200/50 dark:border-slate-700 group/btn shadow-sm hover:shadow-md hover:-translate-y-0.5"
                                                        title={t('dashboard.blog.actions.edit') || "Edit"}
                                                    >
                                                        <Edit2 size={16} className="group-hover/btn:scale-110 transition-transform" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteClick(article.id)}
                                                        className="p-2.5 bg-white dark:bg-slate-800 text-slate-500 hover:text-red-600 hover:bg-red-50 dark:text-slate-400 dark:hover:text-red-400 dark:hover:bg-red-900/30 rounded-xl transition-all duration-300 border border-slate-200/50 dark:border-slate-700 group/btn shadow-sm hover:shadow-md hover:-translate-y-0.5"
                                                        title={t('dashboard.blog.actions.delete') || "Delete"}
                                                    >
                                                        <Trash2 size={16} className="group-hover/btn:scale-110 transition-transform" />
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {isDeleteModalOpen && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-white dark:bg-slate-800 w-full max-w-sm rounded-3xl p-8 text-center shadow-2xl"
                        >
                            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Trash2 size={40} />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                                {t('dashboard.blog.delete_confirm.title') || "Delete Article?"}
                            </h3>
                            <p className="text-slate-500 dark:text-slate-400 mb-8">
                                {t('dashboard.blog.delete_confirm.message') || "Are you sure you want to delete this article? This action cannot be undone."}
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setIsDeleteModalOpen(false)}
                                    className="flex-1 py-3 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-white font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-all"
                                >
                                    {t('dashboard.blog.delete_confirm.cancel') || "Cancel"}
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="flex-1 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-500/30"
                                >
                                    {t('dashboard.blog.delete_confirm.confirm') || "Delete"}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Notification Toast */}
            <AnimatePresence>
                {toast.show && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className={`fixed top-10 left-4 right-4 md:left-auto md:right-10 md:w-auto md:max-w-xs z-[400] px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border backdrop-blur-md ${toast.type === 'error'
                            ? 'bg-red-600/95 text-white border-white/20'
                            : 'bg-emerald-600/95 text-white border-white/20'
                            }`}
                    >
                        <div className="bg-white/20 p-1.5 rounded-lg flex-shrink-0">
                            {toast.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
                        </div>
                        <span className="font-bold text-sm leading-tight">{toast.message}</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MyArticlesModal;
