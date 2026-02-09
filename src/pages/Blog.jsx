import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Search, X, Plus } from 'lucide-react';
import { blogPosts, categories } from '../data/blogData';
import BlogCard from '../components/BlogCard';
import BlogSidebar from '../components/BlogSidebar';
import Pagination from '../components/Pagination';
import { useTranslation } from 'react-i18next';
import { useBlog } from '../hooks/useBlog';
import { useAuth } from '../context/AuthContext';
import { AlertCircle, CheckCircle } from 'lucide-react';
import BlogForm from '../components/BlogForm';

import LoginModal from '../components/LoginModal';
import UserMenu from '../components/UserMenu';
import MyArticlesModal from '../components/MyArticlesModal';

// Mobile Filter Component - Moved outside to prevent re-mounting on state changes
const MobileFilters = ({ searchTerm, setSearchTerm, selectedCategory, setSelectedCategory, dynamicCategories, t }) => (
    <div className="lg:hidden sticky top-0 z-30 px-4 py-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 shadow-md transition-all mb-6 -mx-4 md:-mx-8">
        <div className="container mx-auto max-w-4xl space-y-3">
            {/* Search */}
            <div className="relative">
                <input
                    type="text"
                    placeholder={t('dashboard.blog.search_placeholder') || "Cari artikel..."}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-sm outline-none focus:ring-2 focus:ring-primary dark:text-white transition-all shadow-inner"
                />
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            </div>

            {/* Categories (Horizontal Scroll) */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar hide-scrollbar">
                {dynamicCategories.map((category) => (
                    <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap border ${selectedCategory === category
                            ? 'bg-primary text-white border-primary shadow-md shadow-primary/20'
                            : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-primary hover:text-primary'
                            }`}
                    >
                        {category === 'All' ? t('blog.all') : category}
                    </button>
                ))}
            </div>
        </div>
    </div>
);

// Floating Mobile CTA Component - Moved outside to prevent re-mounting on state changes
const FloatingMobileCTA = ({ showFloatingCTA, setShowFloatingCTA, t }) => {
    const whatsappMessage = t('cta.whatsapp_template');
    const encodedMessage = encodeURIComponent(whatsappMessage);

    return (
        <AnimatePresence>
            {showFloatingCTA && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="lg:hidden fixed bottom-4 left-20 right-4 z-40"
                >
                    <div className="relative bg-gradient-to-r from-primary to-primary-light rounded-xl shadow-lg p-3 backdrop-blur-sm">
                        {/* Close Button */}
                        <button
                            onClick={() => setShowFloatingCTA(false)}
                            className="absolute -top-1.5 -right-1.5 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full p-1 shadow-md hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
                        >
                            <X size={14} />
                        </button>

                        <div className="flex items-center justify-between gap-3">
                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <h3 className="text-white font-bold text-xs mb-0.5">
                                    {t('cta.title')}
                                </h3>
                                <p className="text-brand-emerald-100 text-[10px] line-clamp-1">
                                    {t('portfolio.cta.features.free_consultation')}
                                </p>
                            </div>

                            {/* CTA Button */}
                            <motion.a
                                href={`https://wa.me/6285122959690?text=${encodedMessage}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                whileTap={{ scale: 0.95 }}
                                className="flex-shrink-0 bg-accent hover:bg-accent-light text-white font-bold text-[11px] px-3 py-2 rounded-full shadow-md hover:shadow-lg transition-all whitespace-nowrap"
                            >
                                {t('portfolio.cta.buttons.chat')}
                            </motion.a>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

const Blog = () => {
    const { t, i18n } = useTranslation();
    const { posts: dbPosts, loading, fetchPosts, addPost } = useBlog();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isMyArticlesModalOpen, setIsMyArticlesModalOpen] = useState(false);
    const [posts, setPosts] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(4);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast(prev => ({ ...prev, show: false })), 4000);
    };

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    useEffect(() => {
        setSelectedCategory('All');
    }, [i18n.language]);

    const currentLang = i18n.language.split('-')[0];

    useEffect(() => {
        if (dbPosts && dbPosts.length > 0) {
            // Apply translations based on current language
            const translatedPosts = dbPosts.map(p => ({
                ...p,
                title: p.translations?.[currentLang]?.title || p.title,
                category: p.translations?.[currentLang]?.category || p.category,
                excerpt: p.translations?.[currentLang]?.excerpt || p.excerpt,
                content: p.translations?.[currentLang]?.content || p.content,
            }));
            setPosts(translatedPosts);
        } else {
            setPosts([]);
        }
    }, [dbPosts, currentLang]);

    // Derive categories from posts
    const dynamicCategories = useMemo(() => {
        const cats = ['All', ...new Set(posts.map(post => post.category).filter(c => c && c !== 'All'))];
        return cats;
    }, [posts]);

    // Filter posts based on search and category
    useEffect(() => {
        let result = posts;

        // Filter by category
        if (selectedCategory !== 'All') {
            result = result.filter(post => post.category === selectedCategory);
        }

        // Filter by search term
        if (searchTerm) {
            result = result.filter(post =>
                post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredPosts(result);
        setCurrentPage(1); // Reset to first page on filter change
    }, [searchTerm, selectedCategory, posts]);

    // Pagination logic
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
    const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Floating Mobile CTA state
    const [showFloatingCTA, setShowFloatingCTA] = useState(true);

    const handleWriteClick = () => {
        if (!user) {
            setIsLoginModalOpen(true);
            return;
        }
        setIsWriteModalOpen(true);
    };

    const handleSaveArticle = async (data) => {
        // Status is handled by default in addPost as 'pending'
        // But we can explicitly set it to be sure/clear
        return await addPost({
            ...data,
            status: 'pending',
            author_id: user.id, // If RLS needs it
            author: user.user_metadata?.full_name || user.email.split('@')[0] // Default author name
        });
    };


    return (
        <>
            <Helmet>
                <title>{t('meta.blog.title')}</title>
                <meta name="description" content={t('meta.blog.description')} />
                <meta name="keywords" content={t('meta.blog.keywords')} />
                <link rel="canonical" href="https://webkuu.com/blog" />
            </Helmet>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="pt-24 pb-16 min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300"
            >
                <div className="container mx-auto px-4 md:px-8">

                    {/* Header Section */}
                    <div className="text-center mb-8 lg:mb-12 animate-fade-in-down">
                        <h1 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-light dark:from-brand-emerald-400 dark:to-brand-emerald-300 mb-4">
                            {t('blog.title')}
                        </h1>
                        <p className="text-slate-600 dark:text-slate-300 text-lg max-w-2xl mx-auto hidden md:block">
                            {t('blog.subtitle')}
                        </p>
                        <div className="mt-4 flex justify-center items-center text-sm text-slate-500 space-x-2">
                            <Link to="/" className="hover:text-primary dark:hover:text-brand-emerald-400 transition-colors">{t('blog.home')}</Link>
                            <span>/</span>
                            <span className="text-primary dark:text-brand-emerald-400 font-medium">{t('blog.title_short')}</span>
                        </div>

                        <div className="mt-6 flex justify-center">
                            {user ? (
                                <div className="flex flex-col items-center gap-4">
                                    <UserMenu
                                        onWriteClick={() => setIsWriteModalOpen(true)}
                                        onMyArticlesClick={() => setIsMyArticlesModalOpen(true)}
                                    />
                                    {/* Optional: Add a direct Write button too if preferred, but menu has it */}
                                </div>
                            ) : (
                                <button
                                    onClick={handleWriteClick}
                                    className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 hover:-translate-y-1 transform"
                                >
                                    <Plus size={18} />
                                    {t('blog.write_article') || 'Write Article'}
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8 relative">

                        {/* Mobile Search & Filters (Sticky) */}
                        <MobileFilters
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                            selectedCategory={selectedCategory}
                            setSelectedCategory={setSelectedCategory}
                            dynamicCategories={dynamicCategories}
                            t={t}
                        />

                        {/* Main Content */}
                        <div className="w-full lg:w-2/3">
                            {currentPosts.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {currentPosts.map(post => (
                                        <BlogCard key={post.id} post={post} />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
                                    <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200 mb-2">{t('blog.noResults')}</h3>
                                    <p className="text-slate-500 dark:text-slate-400">
                                        {t('blog.tryDifferent')}
                                    </p>
                                </div>
                            )}

                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                            />
                        </div>

                        {/* Sidebar (Desktop Only) */}
                        <div className="hidden lg:block w-full lg:w-1/3">
                            <div className="sticky top-24">
                                <BlogSidebar
                                    categories={dynamicCategories}
                                    selectedCategory={selectedCategory}
                                    onSelectCategory={setSelectedCategory}
                                    searchTerm={searchTerm}
                                    onSearch={setSearchTerm}
                                />
                            </div>
                        </div>
                    </div>

                </div>
            </motion.div>

            {/* Write Article Modal */}
            <AnimatePresence>
                {isWriteModalOpen && (
                    <BlogForm
                        isOpen={isWriteModalOpen}
                        onClose={() => setIsWriteModalOpen(false)}
                        onSave={handleSaveArticle}
                        showToast={showToast}
                        isPublic={true}
                    />
                )}
            </AnimatePresence>

            {/* Login Modal */}

            <LoginModal
                isOpen={isLoginModalOpen}
                onClose={() => setIsLoginModalOpen(false)}
            />

            <MyArticlesModal
                isOpen={isMyArticlesModalOpen}
                onClose={() => setIsMyArticlesModalOpen(false)}
            />

            {/* Floating Mobile CTA */}
            <FloatingMobileCTA
                showFloatingCTA={showFloatingCTA}
                setShowFloatingCTA={setShowFloatingCTA}
                t={t}
            />

            {/* Notification Toast */}
            <AnimatePresence>
                {toast.show && (
                    <motion.div
                        initial={{ opacity: 0, x: 50, y: -20 }}
                        animate={{ opacity: 1, x: 0, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className={`fixed top-24 right-6 z-[200] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border backdrop-blur-sm ${toast.type === 'error'
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
        </>
    );
};

export default Blog;
