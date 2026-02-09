import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, CheckCircle2, AlertCircle, Calendar } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';

const MyArticlesModal = ({ isOpen, onClose }) => {
    const { t } = useTranslation();
    const { user } = useAuth();
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isOpen && user) {
            fetchMyArticles();
        }
    }, [isOpen, user]);

    const fetchMyArticles = async () => {
        setLoading(true);
        try {
            // Fetch articles where author_id matches current user
            // We select id, title, created_at, status, category
            const { data, error } = await supabase
                .from('blog_posts')
                .select('id, title, created_at, status, category')
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
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                        {t('blog.my_articles') || "My Articles"}
                    </h2>
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
                                No Articles Yet
                            </h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm">
                                You haven't submitted any articles yet.
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
                                            <span className="bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-600">
                                                {article.category || 'Uncategorized'}
                                            </span>
                                            <span>
                                                {new Date(article.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Status Badge */}
                                    <div className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 ${article.status === 'approved'
                                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                                            : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                        }`}>
                                        {article.status === 'approved' ? (
                                            <>
                                                <CheckCircle2 size={12} />
                                                <span>Approved</span>
                                            </>
                                        ) : (
                                            <>
                                                <Clock size={12} />
                                                <span>Pending Review</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default MyArticlesModal;
