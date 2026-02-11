import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, CheckCircle2, AlertCircle, Calendar, Edit2, Trash2, Eye } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { useBlog } from '../hooks/useBlog';

const MyArticlesModal = ({ isOpen, onClose, onEditArticle }) => {
    const { t } = useTranslation();
    const { user } = useAuth();
    const { deletePost } = useBlog();
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [postToDelete, setPostToDelete] = useState(null);
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
    };

    useEffect(() => {
        if (isOpen && user) {
            fetchMyArticles();
        }
    }, [isOpen, user]);

    const fetchMyArticles = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('blog_posts')
                .select('*')
                .eq('author_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setArticles(data || []);
        } catch (error) {
            console.error('Error fetching my articles:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = (id) => {
        setPostToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (postToDelete) {
            const result = await deletePost(postToDelete);
            if (result.success) {
                fetchMyArticles();
                setIsDeleteModalOpen(false);
                setPostToDelete(null);
                showToast(t('blog.actions.delete_success'), 'success');
            } else {
                showToast(t('blog.actions.delete_failed') + ': ' + result.error, 'error');
                setIsDeleteModalOpen(false);
            }
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl overflow-hidden"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-3">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                            {t('blog.my_articles') || "My Articles"}
                        </h2>
                        {!loading && articles.length > 0 && (
                            <span className="px-2.5 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-full text-xs font-bold">
                                {articles.length} {t('blog.articles') || "Articles"}
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
                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
                            <p className="text-slate-500 dark:text-slate-400 text-sm">Loading articles...</p>
                        </div>
                    ) : articles.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                                <Calendar size={32} />
                            </div>
                            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">
                                {t('blog.empty.title')}
                            </h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm">
                                {t('blog.empty.message')}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {articles.map((article) => (
                                <div
                                    key={article.id}
                                    className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 border border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center"
                                >
                                    <div>
                                        <h3 className="font-semibold text-slate-800 dark:text-white mb-1 line-clamp-1">
                                            {article.title}
                                        </h3>
                                        <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                                            <span className="bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-600 font-medium">
                                                {article.category || 'Uncategorized'}
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <Calendar size={12} className="text-slate-400" />
                                                {new Date(article.created_at).toLocaleDateString()}
                                            </span>
                                            <span className="flex items-center gap-1.5 bg-blue-50/50 dark:bg-blue-900/10 px-1.5 py-0.5 rounded">
                                                <Eye size={12} className="text-blue-500 dark:text-blue-400" />
                                                <span className="font-semibold text-blue-600 dark:text-blue-300">
                                                    {article.views || 0}
                                                </span>
                                            </span>
                                        </div>
                                    </div>

                                    {/* Status and Actions */}
                                    <div className="flex items-center gap-4 w-full sm:w-auto">
                                        <div className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 ${article.status === 'approved'
                                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                                            : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                            }`}>
                                            {article.status === 'approved' ? (
                                                <>
                                                    <CheckCircle2 size={12} />
                                                    <span>{t('dashboard.blog.status.approved')}</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Clock size={12} />
                                                    <span>{t('dashboard.blog.status.pending')}</span>
                                                </>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => {
                                                    onClose();
                                                    onEditArticle && onEditArticle(article);
                                                }}
                                                className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all"
                                                title="Edit"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteClick(article.id)}
                                                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                                                title="Delete"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </motion.div>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {isDeleteModalOpen && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
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
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 border backdrop-blur-sm ${toast.type === 'error'
                            ? 'bg-red-600 text-white border-red-500/20'
                            : 'bg-emerald-600 text-white border-emerald-500/20'
                            }`}
                    >
                        <div className="bg-white/20 p-1 rounded-full">
                            {toast.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
                        </div>
                        <span className="font-bold text-sm">{toast.message}</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MyArticlesModal;
