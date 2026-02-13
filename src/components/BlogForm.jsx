import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X, RefreshCw, Upload,
    Edit2, Trash2, AlertCircle, Lock
} from 'lucide-react';
import TiptapEditor from './TiptapEditor';
import { useTranslation } from 'react-i18next';
import { useBlog } from '../hooks/useBlog';
import { useAuth } from '../context/AuthContext';
import { translateText } from '../utils/translateUtils';
import Captcha from './Captcha';



const BlogForm = ({ isOpen, onClose, post, onSave, showToast, isPublic = false }) => {
    const { t, i18n } = useTranslation();
    const { user } = useAuth();
    const { uploadImage } = useBlog();
    const [loading, setLoading] = useState(false);
    const [isTranslating, setIsTranslating] = useState(false);
    const [errors, setErrors] = useState({});
    const [showErrors, setShowErrors] = useState(false);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [showUnsavedModal, setShowUnsavedModal] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [captchaError, setCaptchaError] = useState(false);
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
        author: '',
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
                author: post.author || '',
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
                author: '',
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

    const validateForm = () => {
        const newErrors = {};
        if (!formData.title.trim()) newErrors.title = true;
        if (!formData.slug.trim()) newErrors.slug = true;
        if (!formData.category.trim()) newErrors.category = true;
        if (!formData.excerpt.trim()) newErrors.excerpt = true;
        if (!formData.keywords.trim()) newErrors.keywords = true;
        if (!formData.content.trim()) newErrors.content = true;

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();

        setShowErrors(true);

        // Basic validation for source language
        if (!formData.title.trim() || !formData.content.trim()) {
            showToast(t('dashboard.blog.form.validation.fill_required'), 'error');
            return;
        }

        // Public-only validation: Captcha
        if (isPublic && !isVerified) {
            setCaptchaError(true);
            showToast(t('common.captcha.error'), 'error');
            return;
        }

        setLoading(true);

        // Auto-translate to all other languages before saving
        let finalFormData = { ...formData };
        const currentLang = i18n.language; // Assume user writes in current UI language
        const targetLangs = languages.map(l => l.code).filter(code => code !== currentLang);
        const sourceLang = currentLang;

        try {
            const newTranslations = {};
            setIsTranslating(true);

            // 1. Set current language data directly (preserve formatting)
            newTranslations[currentLang] = {
                title: finalFormData.title,
                category: finalFormData.category,
                excerpt: finalFormData.excerpt,
                keywords: finalFormData.keywords,
                content: finalFormData.content
            };

            // 2. Translate for other languages
            await Promise.all(targetLangs.map(async (lang) => {
                const [tTitle, tCategory, tExcerpt, tKeywords] = await Promise.all([
                    translateText(finalFormData.title, lang, sourceLang),
                    translateText(finalFormData.category, lang, sourceLang),
                    translateText(finalFormData.excerpt, lang, sourceLang),
                    translateText(finalFormData.keywords, lang, sourceLang)
                ]);

                // User requested NOT to translate content to preserve formatting and authenticity
                const tContent = finalFormData.content;

                newTranslations[lang] = {
                    title: tTitle,
                    category: tCategory,
                    excerpt: tExcerpt,
                    keywords: tKeywords,
                    content: tContent
                };
            }));

            finalFormData.translations = { ...finalFormData.translations, ...newTranslations };

            // Inject author_id if available (for database referential integrity)
            if (user?.id) {
                finalFormData.author_id = user.id;
            }

            setFormData(finalFormData); // Sync UI
        } catch (err) {
            console.error('Background translation failed:', err);
        } finally {
            setIsTranslating(false);
        }



        const result = post ? await onSave(post.id, finalFormData) : await onSave(finalFormData);
        setLoading(false);

        if (result.success) {
            setHasUnsavedChanges(false);
            const successMsg = post
                ? t('dashboard.blog.form.success.updated')
                : (isPublic ? "Artikel berhasil dikirim untuk ditinjau" : t('dashboard.blog.form.success.saved'));
            showToast(successMsg, 'success');

            // Auto close after success to return to the list/previous view
            setTimeout(onClose, 1200);
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
                        {isPublic
                            ? "Tulis Artikel Baru"
                            : (post ? t('dashboard.blog.form.edit_title') : t('dashboard.blog.form.add_title'))
                        }
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
                            const hasContentErrors = errors.title || errors.category || errors.excerpt || errors.keywords || errors.content;

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
                                    <div className="flex justify-between items-center">
                                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">{t('dashboard.blog.form.labels.slug')}</label>
                                        <span className="text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-900/50 px-2 py-0.5 rounded-full flex items-center gap-1">
                                            <Lock size={10} />
                                            Otomatis
                                        </span>
                                    </div>
                                    <input
                                        type="text"
                                        value={formData.slug}
                                        readOnly
                                        className={`w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-900/50 border ${errors.slug ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'} rounded-xl outline-none text-slate-500 cursor-not-allowed transition-all`}
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
                                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none dark:text-white text-sm focus:ring-2 focus:ring-blue-500 transition-all"
                                        placeholder="Masukkan nama penulis..."
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">{t('dashboard.blog.table.date')}</label>
                                    <input
                                        type="date"
                                        value={formData.date}
                                        onChange={(e) => handleFieldChange('date', e.target.value)}
                                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none dark:text-white text-sm"
                                        disabled={isPublic}
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
                        <div className="space-y-6">
                            <h4 className="font-bold text-blue-600 uppercase text-xs tracking-widest">{t('dashboard.blog.form.sections.content')}</h4>

                            <div className="space-y-6">
                                <div className="space-y-1">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">{t('dashboard.blog.form.labels.title')}</label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => handleFieldChange('title', e.target.value)}
                                        className={`w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border ${errors.title ? 'border-red-500 animate-pulse' : 'border-slate-200 dark:border-slate-700'} rounded-xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-all`}
                                        placeholder={t('dashboard.blog.form.placeholders.title')}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">{t('dashboard.blog.form.labels.category')}</label>
                                    <input
                                        type="text"
                                        value={formData.category}
                                        onChange={(e) => handleFieldChange('category', e.target.value)}
                                        className={`w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border ${errors.category ? 'border-red-500 animate-pulse' : 'border-slate-200 dark:border-slate-700'} rounded-xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-all`}
                                        placeholder={t('dashboard.blog.form.placeholders.category')}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">{t('dashboard.blog.form.labels.excerpt')}</label>
                                    <textarea
                                        value={formData.excerpt}
                                        onChange={(e) => handleFieldChange('excerpt', e.target.value)}
                                        className={`w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border ${errors.excerpt ? 'border-red-500 animate-pulse' : 'border-slate-200 dark:border-slate-700'} rounded-xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white h-24 transition-all`}
                                        placeholder={t('dashboard.blog.form.placeholders.excerpt')}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">{t('dashboard.blog.form.labels.keywords')}</label>
                                    <input
                                        type="text"
                                        value={formData.keywords}
                                        onChange={(e) => handleFieldChange('keywords', e.target.value)}
                                        className={`w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border ${errors.keywords ? 'border-red-500 animate-pulse' : 'border-slate-200 dark:border-slate-700'} rounded-xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-all`}
                                        placeholder={t('dashboard.blog.form.placeholders.keywords')}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">{t('dashboard.blog.form.labels.content')}</label>
                                    <div className={`editor-container ${errors.content ? 'ring-2 ring-red-500 rounded-xl' : ''}`}>
                                        <TiptapEditor
                                            value={formData.content}
                                            onChange={(content) => handleFieldChange('content', content)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Captcha for Public Submission */}
                    {isPublic && (
                        <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
                            <Captcha
                                onVerify={(val) => {
                                    setIsVerified(val);
                                    setCaptchaError(false);
                                }}
                                error={captchaError}
                            />
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
                        {post ? t('dashboard.blog.form.buttons.update') : (isPublic ? "Submit Article" : t('dashboard.blog.form.buttons.save'))}
                    </button>
                </div>

                {/* Unsaved Changes Warning Modal */}
                {showUnsavedModal && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
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
                                    {i18n.language === 'id' ? 'Batalkan Menulis?' : 'Cancel Writing?'}
                                </h3>
                                <p className="text-slate-500 dark:text-slate-400 mb-8 px-2">
                                    {i18n.language === 'id'
                                        ? 'Perubahan yang Anda buat belum disimpan. Yakin ingin keluar?'
                                        : 'Your changes have not been saved. Are you sure you want to exit?'}
                                </p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setShowUnsavedModal(false)}
                                        className="flex-1 px-6 py-3 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-200 font-bold rounded-xl hover:bg-slate-200 transition-all font-bold"
                                    >
                                        {i18n.language === 'id' ? 'Lanjutkan' : 'Continue'}
                                    </button>
                                    <button
                                        onClick={confirmClose}
                                        className="flex-1 px-6 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 shadow-lg shadow-red-500/30 transition-all font-bold"
                                    >
                                        {i18n.language === 'id' ? 'Ya, Keluar' : 'Yes, Exit'}
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

export default BlogForm;
