import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { blogPosts } from '../data/blogData';
import { FaCalendarAlt, FaUser, FaTag, FaWhatsapp, FaFacebook, FaArrowLeft, FaTwitter, FaLinkedin, FaTelegram, FaLink, FaEye } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { useBlog } from '../hooks/useBlog';
import SEO from '../components/SEO';
import FloatingSettings from '../components/FloatingSettings';


const BlogDetail = () => {
    const { t, i18n } = useTranslation();
    const { slug } = useParams();
    const navigate = useNavigate();
    const { fetchPostBySlug, incrementView, loading } = useBlog();
    const [dbPost, setDbPost] = useState(null);
    const [copySuccess, setCopySuccess] = useState(false);

    useEffect(() => {
        const getPost = async () => {
            const data = await fetchPostBySlug(slug);
            if (data) {
                setDbPost(data);
                // Increment view count
                incrementView(data.id);
            } else {
                setDbPost(null);
            }
        };
        getPost();
    }, [slug, fetchPostBySlug]);

    const currentLang = i18n.language.split('-')[0];

    const post = dbPost ? {
        ...dbPost,
        title: dbPost.translations?.[currentLang]?.title || dbPost.title,
        category: dbPost.translations?.[currentLang]?.category || dbPost.category,
        excerpt: dbPost.translations?.[currentLang]?.excerpt || dbPost.excerpt,
        keywords: dbPost.translations?.[currentLang]?.keywords || dbPost.keywords,
        content: dbPost.translations?.[currentLang]?.content || dbPost.content,
    } : null;

    // Redirect if not found (or handle with UI)
    useEffect(() => {
        if (!post) {
            // Optional: navigate('/404') or just show text
        }
    }, [post, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen pt-32 text-center">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="mt-4 text-slate-500">{t('blog.loading')}</p>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="min-h-screen pt-32 text-center">
                <h2 className="text-2xl font-bold">{t('blog.noResults')}</h2>
                <Link to="/blog" className="text-primary hover:underline mt-4 inline-block">{t('blog.backToBlog')}</Link>
            </div>
        );
    }

    const shareUrl = window.location.href;
    const shareText = `${t('blog.shareArticle')} ${post.title}`;

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    };

    return (
        <>
            <SEO
                title={post.title}
                description={post.excerpt}
                keywords={post.keywords}
                image={post.image}
                type="article"
            />

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="min-h-screen bg-slate-50 dark:bg-slate-900"
            >
                {/* Sticky Back Button */}
                <div className="sticky top-20 z-30 px-4 md:px-8 pt-6">
                    <div className="container mx-auto">
                        <Link to="/blog" className="inline-flex items-center text-white hover:text-primary-light transition-colors font-medium bg-slate-900/70 dark:bg-slate-800/70 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg">
                            <FaArrowLeft className="mr-2" /> {t('blog.backToBlog')}
                        </Link>
                    </div>
                </div>

                <div className="container mx-auto px-4 md:px-8 -mt-14">
                    <article className="w-full">
                        {/* Featured Image */}
                        <div className="h-[400px] md:h-[500px] overflow-hidden relative rounded-2xl">
                            <img
                                src={post.image || null}
                                alt={post.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-6 md:p-8">
                                <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide mb-3 inline-block">
                                    {post.category}
                                </span>
                            </div>
                        </div>

                        <div className="py-10 max-w-4xl mx-auto">
                            {/* Header */}
                            <div className="mb-8 border-b border-slate-100 dark:border-slate-700 pb-8">
                                <h1 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white mb-4 leading-tight">
                                    {post.title}
                                </h1>

                                <div className="flex flex-wrap items-center text-slate-500 dark:text-slate-400 text-sm gap-4">
                                    <div className="flex items-center">
                                        <FaCalendarAlt className="mr-2 text-primary" />
                                        <span>{new Date(post.date).toLocaleDateString(i18n.language, { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <FaUser className="mr-2 text-primary" />
                                        <span>{post.author}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <FaEye className="mr-2 text-primary" />
                                        <span>{post.views || 0}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <style>{`
                                .blog-content ul {
                                    list-style-type: disc !important;
                                    padding-left: 1.5em !important;
                                    margin: 1em 0 !important;
                                }
                                .blog-content ol {
                                    list-style-type: decimal !important;
                                    padding-left: 1.5em !important;
                                    margin: 1em 0 !important;
                                }
                                .blog-content li {
                                    display: list-item !important;
                                    margin-bottom: 0.5em !important;
                                }
                                .blog-content li.text-center, .blog-content li[style*="text-align: center"] { text-align: center !important; }
                                .blog-content li.text-right, .blog-content li[style*="text-align: right"] { text-align: right !important; }
                                .blog-content li.text-justify, .blog-content li[style*="text-align: justify"] { text-align: justify !important; }

                                .blog-content li.text-center, .blog-content li.text-right, .blog-content li.text-justify,
                                .blog-content li[style*="text-align"] {
                                    list-style-position: inside !important;
                                }

                                /* Marker must move with text: inner p should be inline */
                                .blog-content li p {
                                    display: inline !important;
                                    margin: 0 !important;
                                }

                                /* Support for alignment on inner p */
                                .blog-content li:has(p.text-center), .blog-content li:has(p[style*="text-align: center"]) { text-align: center !important; }
                                .blog-content li:has(p.text-right), .blog-content li:has(p[style*="text-align: right"]) { text-align: right !important; }
                                .blog-content li:has(p.text-justify), .blog-content li:has(p[style*="text-align: justify"]) { text-align: justify !important; }
                                
                                .blog-content li:has(p.text-center), .blog-content li:has(p.text-right), .blog-content li:has(p.text-justify),
                                .blog-content li:has(p[style*="text-align"]) {
                                    list-style-position: inside !important;
                                }
                                .blog-content blockquote {
                                    border-left: 4px solid #3b82f6 !important;
                                    padding-left: 1em !important;
                                    font-style: italic !important;
                                    margin: 1em 0 !important;
                                    color: #4b5563 !important;
                                }
                                .blog-content img {
                                    max-width: 100%;
                                    height: auto;
                                    border-radius: 1rem;
                                    margin: 1.5em 0;
                                }
                                .dark .blog-content blockquote {
                                    color: #9ca3af !important;
                                }
                            `}</style>
                            <div className="blog-content">
                                <div
                                    className="prose prose-slate dark:prose-invert max-w-none !h-auto text-slate-800 dark:text-gray-200"
                                    dangerouslySetInnerHTML={{ __html: post.content }}
                                >
                                </div>
                            </div>



                            {/* Share */}
                            <div className="border-t border-b border-slate-100 dark:border-slate-700 py-6 mb-8">
                                <h4 className="font-bold text-slate-700 dark:text-slate-200 mb-3">{t('blog.shareArticle')}</h4>
                                <div className="flex space-x-3">
                                    <a
                                        href={`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="p-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
                                        title="Share to WhatsApp"
                                    >
                                        <FaWhatsapp size={20} />
                                    </a>
                                    <a
                                        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                                        title="Share to Facebook"
                                    >
                                        <FaFacebook size={20} />
                                    </a>
                                    <a
                                        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="p-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
                                        title="Share to X (Twitter)"
                                    >
                                        <FaTwitter size={20} />
                                    </a>
                                    <a
                                        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="p-3 bg-blue-700 text-white rounded-full hover:bg-blue-800 transition-colors"
                                        title="Share to LinkedIn"
                                    >
                                        <FaLinkedin size={20} />
                                    </a>
                                    <a
                                        href={`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="p-3 bg-sky-500 text-white rounded-full hover:bg-sky-600 transition-colors"
                                        title="Share to Telegram"
                                    >
                                        <FaTelegram size={20} />
                                    </a>
                                    <button
                                        onClick={handleCopyLink}
                                        className={`p-3 text-white rounded-full transition-colors relative group ${copySuccess ? 'bg-green-500' : 'bg-slate-500 hover:bg-slate-600'}`}
                                        title="Copy Link"
                                    >
                                        <FaLink size={20} />
                                        {copySuccess && (
                                            <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs py-1 px-2 rounded opacity-100 transition-opacity whitespace-nowrap">
                                                {t('blog.copied')}
                                            </span>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* CTA */}
                            <div className="bg-brand-emerald-50 dark:bg-slate-700/50 rounded-xl p-8 text-center border border-brand-emerald-100 dark:border-slate-600">
                                <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-3">
                                    {t('blog.ctaTitle')}
                                </h3>
                                <p className="text-slate-600 dark:text-slate-300 mb-6">
                                    {t('blog.ctaSubtitle')}
                                </p>
                                <a
                                    href="https://wa.me/6285122959690?text=Halo%20WebKuu!%20Saya%20tertarik%20dengan%20layanan%20pembuatan%20website"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-block px-8 py-3 bg-accent text-white font-bold rounded-lg shadow-lg hover:bg-accent-light hover:-translate-y-1 transition-all duration-300"
                                >
                                    {t('blog.ctaButton')}
                                </a>
                            </div>

                        </div>
                    </article>
                </div>

                <div className="pb-16"></div>
                <FloatingSettings />
            </motion.div>
        </>
    );
};

export default BlogDetail;
