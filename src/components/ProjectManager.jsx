import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    Edit2,
    Trash2,
    ExternalLink,
    Search,
    Filter,
    Image as ImageIcon,
    Database,
    AlertCircle,
    CheckCircle,
    X,
    Code,
    List,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { usePortfolio } from '../hooks/usePortfolio';

const ProjectManager = () => {
    const { t, i18n } = useTranslation();
    const {
        projects,
        loading,
        error,
        fetchProjects,
        addProject,
        updateProject,
        deleteProject,
        migrateProjects
    } = usePortfolio();

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [showMigrateConfirm, setShowMigrateConfirm] = useState(false);
    const [migrationStatus, setMigrationStatus] = useState(null);
    const [projectToDelete, setProjectToDelete] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    const handleEdit = (project) => {
        setEditingProject(project);
        setIsFormOpen(true);
    };

    const handleDeleteClick = (id) => {
        setProjectToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (projectToDelete) {
            await deleteProject(projectToDelete);
            setIsDeleteModalOpen(false);
            setProjectToDelete(null);
        }
    };

    const categories = [
        { key: 'All', label: t('portfolio.gallery.filters.all_categories') },
        { key: 'web_app', label: t('portfolio.gallery.categories.web_app') },
        { key: 'company_profile', label: t('portfolio.gallery.categories.company_profile') },
        { key: 'online_store', label: t('portfolio.gallery.categories.online_store') },
        { key: 'landing_page', label: t('portfolio.gallery.categories.landing_page') },
        { key: 'portfolio', label: t('portfolio.gallery.categories.portfolio') }
    ];

    const filteredProjects = projects.filter(p => {
        const matchesSearch = p.name_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.name_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (p.name_es && p.name_es.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (p.name_fr && p.name_fr.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (p.name_ja && p.name_ja.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    // Pagination logic
    const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedProjects = filteredProjects.slice(startIndex, endIndex);

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, categoryFilter]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Database size={24} className="text-blue-500" />
                        {t('dashboard.portfolio.title')}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        {t('dashboard.portfolio.subtitle')}
                    </p>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    {projects.length === 0 && (
                        <button
                            onClick={() => setShowMigrateConfirm(true)}
                            className="flex-1 md:flex-none px-4 py-2 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-xl hover:bg-amber-200 transition-colors flex items-center justify-center gap-2 font-bold"
                        >
                            <AlertCircle size={18} />
                            {t('dashboard.portfolio.migrate_button')}
                        </button>
                    )}
                    <button
                        onClick={() => {
                            setEditingProject(null);
                            setIsFormOpen(true);
                        }}
                        className="flex-1 md:flex-none px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-bold shadow-lg shadow-blue-500/30"
                    >
                        <Plus size={18} />
                        {t('dashboard.portfolio.add_button')}
                    </button>
                </div>
            </div>

            {/* Project Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-100 text-sm font-medium mb-1">{t('dashboard.portfolio.stats.total_projects')}</p>
                            <p className="text-3xl font-bold">{projects.length}</p>
                        </div>
                        <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                            <Database size={28} />
                        </div>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-emerald-100 text-sm font-medium mb-1">{t('dashboard.portfolio.stats.client_projects')}</p>
                            <p className="text-3xl font-bold">{projects.filter(p => p.client_type === 'Client').length}</p>
                        </div>
                        <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                            <ImageIcon size={28} />
                        </div>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-6 text-white shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-amber-100 text-sm font-medium mb-1">{t('dashboard.portfolio.stats.create_projects')}</p>
                            <p className="text-3xl font-bold">{projects.filter(p => p.client_type === 'Create').length}</p>
                        </div>
                        <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                            <Code size={28} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder={t('dashboard.portfolio.search_placeholder')}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all dark:text-white"
                    />
                </div>
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="w-full pl-10 pr-10 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 appearance-none transition-all dark:text-white cursor-pointer"
                        >
                            {categories.map(c => (
                                <option key={c.key} value={c.key}>{c.label}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Project List */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">{t('dashboard.portfolio.table.project')}</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">{t('dashboard.portfolio.table.category')}</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">{t('dashboard.portfolio.table.client_type')}</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">{t('dashboard.portfolio.table.actions')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-12 text-center text-slate-400">
                                        <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                                        {t('common.loading') || 'Loading projects...'}
                                    </td>
                                </tr>
                            ) : filteredProjects.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-12 text-center text-slate-400">
                                        <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-full w-fit mx-auto mb-3">
                                            <ImageIcon size={32} />
                                        </div>
                                        {t('dashboard.portfolio.table.empty')}
                                    </td>
                                </tr>
                            ) : (
                                paginatedProjects.map((project) => (
                                    <tr key={project.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-700 overflow-hidden border border-slate-200 dark:border-slate-600">
                                                    <img
                                                        src={project.thumbnail}
                                                        alt={project.name_id}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=No+Image'; }}
                                                    />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                                                        {project[`name_${i18n.language}`] || project.name_en}
                                                    </div>
                                                    <div className="text-xs text-slate-500 dark:text-slate-400">
                                                        {project[`type_${i18n.language}`] || project.type_en}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full text-xs font-bold border border-slate-200 dark:border-slate-600">
                                                {categories.find(c => c.key === project.category)?.label || project.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${project.client_type === 'Create'
                                                ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 border-amber-200 dark:border-amber-800'
                                                : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 border-emerald-200 dark:border-emerald-800'
                                                }`}>
                                                {project.client_type === 'Create'
                                                    ? t('dashboard.portfolio.form.client_types.create')
                                                    : t('dashboard.portfolio.form.client_types.client')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleEdit(project)}
                                                    className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all"
                                                    title="Edit"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(project.id)}
                                                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                                                    title="Delete"
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
                {filteredProjects.length > 0 && (
                    <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-700 flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="text-sm text-slate-500 dark:text-slate-400">
                            {t('dashboard.portfolio.pagination.showing')} {startIndex + 1} {t('dashboard.portfolio.pagination.to')} {Math.min(endIndex, filteredProjects.length)} {t('dashboard.portfolio.pagination.of')} {filteredProjects.length} {t('dashboard.portfolio.pagination.projects')}
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <label className="text-sm text-slate-500 dark:text-slate-400">{t('dashboard.portfolio.pagination.per_page')}:</label>
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

            {/* Project Form Modal */}
            {isFormOpen && (
                <ProjectForm
                    isOpen={isFormOpen}
                    onClose={() => setIsFormOpen(false)}
                    project={editingProject}
                    onSave={editingProject ? updateProject : addProject}
                />
            )}

            {/* Migration Confirmation */}
            {showMigrateConfirm && (
                <MigrationModal
                    isOpen={showMigrateConfirm}
                    onClose={() => setShowMigrateConfirm(false)}
                    onMigrate={migrateProjects}
                />
            )}

            {/* Delete Confirmation Modal */}
            <DeleteConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                loading={loading}
            />
        </div>
    );
};

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, loading }) => {
    const { t } = useTranslation();
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                    onClick={onClose}
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
                            {t('dashboard.portfolio.delete_confirm.title')}
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400 mb-8 px-2">
                            {t('dashboard.portfolio.delete_confirm.message')}
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={onClose}
                                disabled={loading}
                                className="flex-1 px-6 py-3 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-200 font-bold rounded-xl hover:bg-slate-200 transition-all disabled:opacity-50"
                            >
                                {t('dashboard.portfolio.delete_confirm.cancel')}
                            </button>
                            <button
                                onClick={onConfirm}
                                disabled={loading}
                                className="flex-1 px-6 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 shadow-lg shadow-red-500/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {loading && (
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                )}
                                {t('dashboard.portfolio.delete_confirm.confirm')}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

const ProjectForm = ({ isOpen, onClose, project, onSave }) => {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [activeTab, setActiveTab] = useState('en');
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [showUnsavedModal, setShowUnsavedModal] = useState(false);
    const [showSuccessToast, setShowSuccessToast] = useState(false);
    const [initialFormData, setInitialFormData] = useState(null);
    const languages = [
        { code: 'en', label: 'English', flag: '🇺🇸' },
        { code: 'id', label: 'Indonesia', flag: '🇮🇩' },
        { code: 'es', label: 'Español', flag: '🇪🇸' },
        { code: 'fr', label: 'Français', flag: '🇫🇷' },
        { code: 'ja', label: '日本語', flag: '🇯🇵' }
    ];

    const [formData, setFormData] = useState({
        // Names
        name_en: '', name_id: '', name_es: '', name_fr: '', name_ja: '',
        category: 'landing_page',
        // Types
        type_en: '', type_id: '', type_es: '', type_fr: '', type_ja: '',
        thumbnail: '',
        // Short Descs
        short_desc_en: '', short_desc_id: '', short_desc_es: '', short_desc_fr: '', short_desc_ja: '',
        // Full Descs
        full_desc_en: '', full_desc_id: '', full_desc_es: '', full_desc_fr: '', full_desc_ja: '',
        // Durations
        duration_en: '', duration_id: '', duration_es: '', duration_fr: '', duration_ja: '',
        client_type: 'Create',
        demo_link: '',
        technologies: [],
        features_id: [],
        features_en: [],
        features_es: [],
        features_fr: [],
        features_ja: []
    });

    useEffect(() => {
        if (project) {
            const data = {
                ...project,
                technologies: project.technologies || [],
                features_id: project.features_id || [],
                features_en: project.features_en || [],
                features_es: project.features_es || [],
                features_fr: project.features_fr || [],
                features_ja: project.features_ja || []
            };
            setFormData(data);
            setInitialFormData(JSON.stringify(data));
        } else {
            const emptyData = {
                name_en: '', name_id: '', name_es: '', name_fr: '', name_ja: '',
                category: 'landing_page',
                type_en: '', type_id: '', type_es: '', type_fr: '', type_ja: '',
                thumbnail: '',
                short_desc_en: '', short_desc_id: '', short_desc_es: '', short_desc_fr: '', short_desc_ja: '',
                full_desc_en: '', full_desc_id: '', full_desc_es: '', full_desc_fr: '', full_desc_ja: '',
                duration_en: '', duration_id: '', duration_es: '', duration_fr: '', duration_ja: '',
                client_type: 'Create',
                demo_link: '',
                technologies: [],
                features_id: [],
                features_en: [],
                features_es: [],
                features_fr: [],
                features_ja: []
            };
            setInitialFormData(JSON.stringify(emptyData));
        }
    }, [project]);

    useEffect(() => {
        if (initialFormData) {
            const currentData = JSON.stringify(formData);
            setHasUnsavedChanges(currentData !== initialFormData);
        }
    }, [formData, initialFormData]);

    const validateURL = (url) => {
        if (!url) return true; // Optional field
        return url.startsWith('http://') || url.startsWith('https://');
    };

    const validateForm = () => {
        const newErrors = {};

        // Required fields
        if (!formData.name_en.trim()) newErrors.name_en = t('dashboard.portfolio.form.validation.required');
        if (!formData.name_id.trim()) newErrors.name_id = t('dashboard.portfolio.form.validation.required');
        if (!formData.type_en.trim()) newErrors.type_en = t('dashboard.portfolio.form.validation.required');
        if (!formData.type_id.trim()) newErrors.type_id = t('dashboard.portfolio.form.validation.required');
        if (!formData.thumbnail.trim()) newErrors.thumbnail = t('dashboard.portfolio.form.validation.required');

        // URL validation
        if (formData.thumbnail && !validateURL(formData.thumbnail)) {
            newErrors.thumbnail = t('dashboard.portfolio.form.validation.invalid_url');
        }
        if (formData.demo_link && !validateURL(formData.demo_link)) {
            newErrors.demo_link = t('dashboard.portfolio.form.validation.invalid_url');
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        const result = project ? await onSave(project.id, formData) : await onSave(formData);
        if (result.success) {
            setHasUnsavedChanges(false);
            setShowSuccessToast(true);
            setTimeout(() => {
                setShowSuccessToast(false);
                onClose();
            }, 2000);
        } else {
            alert(t('dashboard.portfolio.form.validation.save_error') + result.error);
        }
        setLoading(false);
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

    const handleArrayInput = (field, value) => {
        const items = value.split(',').map(i => i.trim()).filter(i => i !== '');
        setFormData(prev => ({ ...prev, [field]: items }));
    };

    const handleFieldChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: null }));
        }
    };

    return (
        <>
            <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={handleClose} />
                <div className="relative w-full max-w-4xl bg-white dark:bg-slate-800 rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700 max-h-[90vh] flex flex-col">
                    <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-xl ${project ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'}`}>
                                {project ? <Edit2 size={20} /> : <Plus size={20} />}
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                                {project ? t('dashboard.portfolio.form.edit_title') : t('dashboard.portfolio.form.add_title')}
                            </h3>
                        </div>
                        <button onClick={handleClose} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors">
                            <X size={24} className="text-slate-500" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-8 overflow-y-auto custom-scrollbar">
                        {/* Basic Info */}
                        <div className="space-y-4">
                            <h4 className="text-sm font-bold text-blue-500 uppercase tracking-widest flex items-center gap-2">
                                <ImageIcon size={16} /> {t('dashboard.portfolio.form.sections.basic')}
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('dashboard.portfolio.form.labels.name_id')}</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.name_id}
                                        onChange={(e) => handleFieldChange('name_id', e.target.value)}
                                        className={`w-full bg-slate-50 dark:bg-slate-900 border ${errors.name_id ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'} rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none dark:text-white transition-all`}
                                    />
                                    {errors.name_id && <p className="text-red-500 text-xs mt-1">{errors.name_id}</p>}
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('dashboard.portfolio.form.labels.name_en')}</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.name_en}
                                        onChange={(e) => handleFieldChange('name_en', e.target.value)}
                                        className={`w-full bg-slate-50 dark:bg-slate-900 border ${errors.name_en ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'} rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none dark:text-white transition-all`}
                                    />
                                    {errors.name_en && <p className="text-red-500 text-xs mt-1">{errors.name_en}</p>}
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('dashboard.portfolio.form.labels.category')}</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none dark:text-white transition-all cursor-pointer"
                                    >
                                        {Object.entries(t('portfolio.gallery.categories', { returnObjects: true })).map(([key, label]) => (
                                            <option key={key} value={key}>{label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('dashboard.portfolio.form.labels.client_type')}</label>
                                    <select
                                        value={formData.client_type}
                                        onChange={(e) => setFormData(prev => ({ ...prev, client_type: e.target.value }))}
                                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none dark:text-white transition-all cursor-pointer"
                                    >
                                        <option value="Create">{t('dashboard.portfolio.form.client_types.create')}</option>
                                        <option value="Client">{t('dashboard.portfolio.form.client_types.client')}</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('dashboard.portfolio.form.labels.thumbnail')}</label>
                                    <input
                                        required
                                        type="url"
                                        value={formData.thumbnail}
                                        onChange={(e) => handleFieldChange('thumbnail', e.target.value)}
                                        className={`w-full bg-slate-50 dark:bg-slate-900 border ${errors.thumbnail ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'} rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none dark:text-white transition-all`}
                                        placeholder={t('dashboard.portfolio.form.placeholders.demo')}
                                    />
                                    {errors.thumbnail && <p className="text-red-500 text-xs mt-1">{errors.thumbnail}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Content & Localization */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h4 className="text-sm font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                                    <List size={16} /> {t('dashboard.portfolio.form.sections.content')}
                                </h4>
                                <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
                                    {languages.map(lang => (
                                        <button
                                            key={lang.code}
                                            type="button"
                                            onClick={() => setActiveTab(lang.code)}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${activeTab === lang.code
                                                ? 'bg-white dark:bg-slate-800 text-blue-600 shadow-sm border border-slate-200 dark:border-slate-600'
                                                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                                }`}
                                        >
                                            <span>{lang.flag}</span>
                                            <span className="hidden sm:inline">{lang.label}</span>
                                            <span className="sm:hidden">{lang.code.toUpperCase()}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {languages.map(lang => (
                                <div key={lang.code} className={activeTab === lang.code ? 'block animate-in fade-in slide-in-from-top-2 duration-300' : 'hidden'}>
                                    <div className="space-y-4 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-700 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                                            <span className="text-6xl font-black">{lang.code.toUpperCase()}</span>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Project Name ({lang.code})</label>
                                                <input
                                                    type="text"
                                                    value={formData[`name_${lang.code}`] || ''}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, [`name_${lang.code}`]: e.target.value }))}
                                                    className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none dark:text-white"
                                                    placeholder={t('dashboard.portfolio.form.placeholders.name')}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Type ({lang.code})</label>
                                                <input
                                                    type="text"
                                                    value={formData[`type_${lang.code}`] || ''}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, [`type_${lang.code}`]: e.target.value }))}
                                                    className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none dark:text-white"
                                                    placeholder={t('dashboard.portfolio.form.placeholders.type')}
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Short Description ({lang.code})</label>
                                            <input
                                                type="text"
                                                value={formData[`short_desc_${lang.code}`] || ''}
                                                onChange={(e) => setFormData(prev => ({ ...prev, [`short_desc_${lang.code}`]: e.target.value }))}
                                                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none dark:text-white"
                                                placeholder={t('dashboard.portfolio.form.placeholders.short_desc')}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Full Description ({lang.code})</label>
                                            <textarea
                                                rows={3}
                                                value={formData[`full_desc_${lang.code}`] || ''}
                                                onChange={(e) => setFormData(prev => ({ ...prev, [`full_desc_${lang.code}`]: e.target.value }))}
                                                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none dark:text-white"
                                                placeholder={t('dashboard.portfolio.form.placeholders.full_desc')}
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Duration ({lang.code})</label>
                                                <input
                                                    type="text"
                                                    value={formData[`duration_${lang.code}`] || ''}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, [`duration_${lang.code}`]: e.target.value }))}
                                                    className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none dark:text-white"
                                                    placeholder={t('dashboard.portfolio.form.placeholders.duration')}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Features ({lang.code}) (Comma separated)</label>
                                                <textarea
                                                    rows={1}
                                                    value={(formData[`features_${lang.code}`] || []).join(', ')}
                                                    onChange={(e) => handleArrayInput(`features_${lang.code}`, e.target.value)}
                                                    className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none dark:text-white"
                                                    placeholder={t('dashboard.portfolio.form.placeholders.features')}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Meta Data */}
                        <div className="space-y-4">
                            <h4 className="text-sm font-bold text-amber-500 uppercase tracking-widest flex items-center gap-2">
                                <Code size={16} /> {t('dashboard.portfolio.form.sections.meta')}
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('dashboard.portfolio.form.labels.tech')}</label>
                                    <input
                                        type="text"
                                        value={formData.technologies.join(', ')}
                                        onChange={(e) => handleArrayInput('technologies', e.target.value)}
                                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none dark:text-white"
                                        placeholder={t('dashboard.portfolio.form.placeholders.tech')}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('dashboard.portfolio.form.labels.demo')}</label>
                                    <input
                                        type="url"
                                        value={formData.demo_link}
                                        onChange={(e) => setFormData(prev => ({ ...prev, demo_link: e.target.value }))}
                                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none dark:text-white"
                                        placeholder={t('dashboard.portfolio.form.placeholders.demo')}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('dashboard.portfolio.form.labels.features_id')}</label>
                                    <textarea
                                        rows={2}
                                        value={formData.features_id.join(', ')}
                                        onChange={(e) => handleArrayInput('features_id', e.target.value)}
                                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none dark:text-white"
                                        placeholder={t('dashboard.portfolio.form.placeholders.features')}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('dashboard.portfolio.form.labels.features_en')}</label>
                                    <textarea
                                        rows={2}
                                        value={formData.features_en.join(', ')}
                                        onChange={(e) => handleArrayInput('features_en', e.target.value)}
                                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none dark:text-white"
                                        placeholder={t('dashboard.portfolio.form.placeholders.features')}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="pt-8 border-t border-slate-100 dark:border-slate-700 flex gap-3">
                            <button
                                type="button"
                                onClick={handleClose}
                                className="flex-1 px-6 py-4 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-all text-sm"
                            >
                                {t('dashboard.portfolio.form.buttons.cancel')}
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-[2] px-6 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 shadow-xl shadow-blue-500/30 transition-all text-sm flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : project ? t('dashboard.portfolio.form.buttons.update') : t('dashboard.portfolio.form.buttons.save')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Success Toast */}
            <AnimatePresence>
                {showSuccessToast && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        className="fixed bottom-8 right-8 z-[130] bg-emerald-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3"
                    >
                        <CheckCircle size={24} />
                        <span className="font-bold">
                            {project ? t('dashboard.portfolio.form.success.project_updated') : t('dashboard.portfolio.form.success.project_saved')}
                        </span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Unsaved Changes Modal */}
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
                                {t('dashboard.portfolio.form.unsaved_changes.title')}
                            </h3>
                            <p className="text-slate-500 dark:text-slate-400 mb-8 px-2">
                                {t('dashboard.portfolio.form.unsaved_changes.message')}
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowUnsavedModal(false)}
                                    className="flex-1 px-6 py-3 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-200 font-bold rounded-xl hover:bg-slate-200 transition-all"
                                >
                                    {t('dashboard.portfolio.form.unsaved_changes.cancel')}
                                </button>
                                <button
                                    onClick={confirmClose}
                                    className="flex-1 px-6 py-3 bg-amber-600 text-white font-bold rounded-xl hover:bg-amber-700 shadow-lg shadow-amber-500/30 transition-all"
                                >
                                    {t('dashboard.portfolio.form.unsaved_changes.confirm')}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </>
    );
};

const MigrationModal = ({ isOpen, onClose, onMigrate }) => {
    const { t, i18n } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null);

    const startMigration = async () => {
        setLoading(true);

        const langs = ['en', 'id', 'es', 'fr', 'ja'];
        const tFuncs = langs.reduce((acc, lang) => {
            acc[lang] = i18n.getFixedT(lang);
            return acc;
        }, {});

        const projectKeys = [
            'professional_service', 'umkm_store', 'vayana', 'aura_visuals',
            'fashion_store', 'tech_startup', 'saas_product', 'restaurant',
            'photographer', 'edu_platform', 'ai_chatbot', 'handara'
        ];

        // Metadata for non-translatable fields and unique details
        const projectMeta = {
            professional_service: { category: "landing_page", thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2026&auto=format&fit=crop", client_type: "Create", demo_link: "https://professional-service-topaz.vercel.app/", technologies: ["React", "Tailwind CSS", "Framer Motion", "Vercel"] },
            umkm_store: { category: "online_store", thumbnail: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2070&auto=format&fit=crop", client_type: "Create", demo_link: "https://umkm-ivory.vercel.app/", technologies: ["Next.js", "Tailwind CSS", "Framer Motion", "Vercel"] },
            vayana: { category: "company_profile", thumbnail: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2070&auto=format&fit=crop", client_type: "Create", demo_link: "https://vayana-hazel.vercel.app/", technologies: ["Next.js", "Tailwind CSS", "Framer Motion", "Vercel"] },
            aura_visuals: { category: "company_profile", thumbnail: "https://company-profile-xi-indol.vercel.app/images/portfolio-1.jpg", client_type: "Create", demo_link: "https://company-profile-xi-indol.vercel.app/", technologies: ["Next.js", "Tailwind CSS", "Framer Motion", "Vercel"] },
            fashion_store: { category: "online_store", thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop", client_type: "Client", demo_link: "", technologies: ["React", "Tailwind CSS", "Node.js", "MongoDB", "Stripe"] },
            tech_startup: { category: "company_profile", thumbnail: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop", client_type: "Client", demo_link: "", technologies: ["Next.js", "Tailwind CSS", "Framer Motion", "EmailJS"] },
            saas_product: { category: "landing_page", thumbnail: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=600&fit=crop", client_type: "Client", demo_link: "", technologies: ["React", "Tailwind CSS", "Vite", "Google Analytics"] },
            restaurant: { category: "online_store", thumbnail: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop", client_type: "Client", demo_link: "", technologies: ["React", "Tailwind CSS", "Firebase", "WhatsApp API"] },
            photographer: { category: "portfolio", thumbnail: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&h=600&fit=crop", client_type: "Client", demo_link: "", technologies: ["Next.js", "Tailwind CSS", "Cloudinary", "Lightbox"] },
            edu_platform: { category: "web_app", thumbnail: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&h=600&fit=crop", client_type: "Client", demo_link: "", technologies: ["React", "Node.js", "MongoDB", "Video.js", "PDF.js"] },
            ai_chatbot: { category: "web_app", thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop", client_type: "Create", demo_link: "https://chatbot-dusky-eta-13.vercel.app/", technologies: ["React", "Tailwind CSS", "OpenAI API", "Vercel"] },
            handara: { category: "company_profile", thumbnail: "https://images.unsplash.com/photo-1582653291997-079a1c04e5a1?w=800&h=600&fit=crop", client_type: "Create", demo_link: "https://handara-bali.vercel.app/", technologies: ["Next.js", "Framer Motion", "Tailwind CSS", "React Leaflet"] }
        };

        const existingProjects = projectKeys.map(key => {
            const meta = projectMeta[key];
            const p = {
                category: meta.category,
                thumbnail: meta.thumbnail,
                client_type: meta.client_type,
                demo_link: meta.demo_link,
                technologies: meta.technologies
            };

            langs.forEach(lang => {
                const tLang = tFuncs[lang];
                p[`name_${lang}`] = tLang(`portfolio.projects.${lang === 'id' && key === 'fashion_store' ? 'fashion_store' : key}.name`) || tFuncs.en(`portfolio.projects.${key}.name`);
                p[`type_${lang}`] = tLang(`portfolio.projects.${key}.type`) || tFuncs.en(`portfolio.projects.${key}.type`);
                p[`short_desc_${lang}`] = tLang(`portfolio.projects.${key}.short_desc`) || tFuncs.en(`portfolio.projects.${key}.short_desc`);
                p[`full_desc_${lang}`] = tLang(`portfolio.projects.${key}.full_desc`) || tFuncs.en(`portfolio.projects.${key}.full_desc`);

                // Duration handling (fall back to ID if not available in other langs, then EN)
                const duration = tLang(`portfolio.projects.${key}.duration`) || tFuncs.id(`portfolio.projects.${key}.duration`) || tFuncs.en(`portfolio.projects.${key}.duration`) || (key === 'fashion_store' ? '3 Weeks' : '1 Day');
                p[`duration_${lang}`] = duration;

                p[`features_${lang}`] = tLang(`portfolio.projects.${key}.features`, { returnObjects: true }) || tFuncs.en(`portfolio.projects.${key}.features`, { returnObjects: true }) || [];
            });

            return p;
        });

        const result = await onMigrate(existingProjects);
        if (result.success) {
            setStatus({ type: 'success', message: t('dashboard.portfolio.migration.success_message', { count: result.count }) });
            setTimeout(onClose, 2000);
        } else {
            setStatus({ type: 'error', message: t('dashboard.portfolio.migration.error_prefix') + result.error });
        }
        setLoading(false);
    };

    return (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" onClick={onClose} />
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="relative w-full max-w-md bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 p-8 text-center"
            >
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Database size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                    {t('dashboard.portfolio.migration.title')}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 mb-8">
                    {t('dashboard.portfolio.migration.description')}
                </p>

                {status ? (
                    <div className={`p-4 rounded-xl mb-6 flex items-center gap-3 ${status.type === 'success' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'
                        }`}>
                        {status.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                        <span className="text-sm font-bold">{status.message}</span>
                    </div>
                ) : (
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 px-6 py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-all text-sm"
                        >
                            {t('dashboard.portfolio.form.buttons.cancel')}
                        </button>
                        <button
                            onClick={startMigration}
                            disabled={loading}
                            className="flex-1 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all text-sm flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : t('dashboard.portfolio.migration.button')}
                        </button>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default ProjectManager;
