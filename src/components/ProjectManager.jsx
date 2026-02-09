import React, { useState, useEffect, useRef } from 'react';
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
    ChevronRight,
    ChevronDown,
    Briefcase,
    Sparkles,
    RefreshCw,
    Upload
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { usePortfolio } from '../hooks/usePortfolio';
import { translateText } from '../utils/translateUtils';

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
        { key: 'portfolio', label: t('portfolio.gallery.categories.portfolio') },
        { key: 'others', label: t('portfolio.gallery.categories.others') }
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
            {/* Header & Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mb-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-4 md:p-6 text-white shadow-lg overflow-hidden relative group">
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
                    <div className="relative z-10 flex items-center justify-between">
                        <div>
                            <p className="text-blue-100 text-xs font-medium mb-1">{t('dashboard.portfolio.stats.total_projects')}</p>
                            <p className="text-2xl md:text-3xl font-bold">{projects.length}</p>
                        </div>
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 rounded-xl flex items-center justify-center">
                            <Briefcase size={24} />
                        </div>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-4 md:p-6 text-white shadow-lg overflow-hidden relative group">
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
                    <div className="relative z-10 flex items-center justify-between">
                        <div>
                            <p className="text-emerald-100 text-xs font-medium mb-1">{t('dashboard.portfolio.stats.client_projects')}</p>
                            <p className="text-2xl md:text-3xl font-bold">{projects.filter(p => p.client_type === 'Client').length}</p>
                        </div>
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 rounded-xl flex items-center justify-center">
                            <ImageIcon size={24} />
                        </div>
                    </div>
                </div>
                {/* Internal Projects Card (Visible on larger screens or stack differently) */}
                <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-4 md:p-6 text-white shadow-lg overflow-hidden relative group">
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
                    <div className="relative z-10 flex items-center justify-between">
                        <div>
                            <p className="text-amber-100 text-xs font-medium mb-1">{t('dashboard.portfolio.stats.create_projects')}</p>
                            <p className="text-2xl md:text-3xl font-bold">{projects.filter(p => p.client_type === 'Create').length}</p>
                        </div>
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 rounded-xl flex items-center justify-center">
                            <Code size={24} />
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
                        placeholder={t('dashboard.portfolio.search_placeholder')}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all dark:text-white text-sm"
                    />
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-48">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="w-full pl-10 pr-10 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-400 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 appearance-none transition-all dark:text-white cursor-pointer text-sm"
                        >
                            {categories.map(c => (
                                <option key={c.key} value={c.key}>{c.label}</option>
                            ))}
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                            <ChevronDown size={16} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
                <div className="overflow-x-auto -mx-4 md:-mx-0">
                    <table className="w-full text-left min-w-[800px]">
                        <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700">
                            <tr>
                                <th className="px-6 py-4 text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">{t('dashboard.portfolio.table.project')}</th>
                                <th className="px-6 py-4 text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">{t('dashboard.portfolio.table.category')}</th>
                                <th className="px-6 py-4 text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">{t('dashboard.portfolio.table.client_type')}</th>
                                <th className="px-6 py-4 text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-wider text-right whitespace-nowrap">{t('dashboard.portfolio.table.actions')}</th>
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
                                                        src={project.thumbnail || null}
                                                        alt={project.name_id}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=No+Image'; }}
                                                    />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors text-[11px] md:text-sm whitespace-nowrap">
                                                        {project[`name_${i18n.language}`] || project.name_en}
                                                    </div>
                                                    <div className="text-[10px] md:text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                                                        {project[`type_${i18n.language}`] || project.type_en}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full text-[10px] md:text-xs font-bold border border-slate-200 dark:border-slate-600">
                                                {categories.find(c => c.key === project.category)?.label || project.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2.5 py-1 rounded-full text-[10px] md:text-xs font-bold border ${project.client_type === 'Create'
                                                ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 border-amber-200 dark:border-amber-800'
                                                : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 border-emerald-200 dark:border-emerald-800'
                                                }`}>
                                                {project.client_type === 'Create'
                                                    ? t('dashboard.portfolio.form.client_types.create')
                                                    : t('dashboard.portfolio.form.client_types.client')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right whitespace-nowrap">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleEdit(project)}
                                                    className="p-1.5 md:p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all"
                                                    title="Edit"
                                                >
                                                    <Edit2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(project.id)}
                                                    className="p-1.5 md:p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
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
                    <div className="px-4 md:px-6 py-4 border-t border-slate-100 dark:border-slate-700 flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="text-xs md:text-sm text-slate-500 dark:text-slate-400 text-center md:text-left">
                            {t('dashboard.pagination.showing')} {startIndex + 1} {t('dashboard.pagination.to')} {Math.min(endIndex, filteredProjects.length)} {t('dashboard.pagination.of')} {filteredProjects.length} {t('dashboard.pagination.projects')}
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
    const { projects, uploadThumbnail } = usePortfolio();
    const fileInputRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [errors, setErrors] = useState({});
    const [isTranslating, setIsTranslating] = useState(false);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [showUnsavedModal, setShowUnsavedModal] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
    const [initialFormData, setInitialFormData] = useState(null);

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
    };
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
        technologies: '', // Changed to string
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
                technologies: Array.isArray(project.technologies) ? project.technologies.join(', ') : (project.technologies || ''),
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
                technologies: '',
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

        // Validate Thumbnail (Required)
        if (!formData.thumbnail?.trim()) {
            newErrors.thumbnail = t('dashboard.portfolio.form.validation.required');
        } else if (!validateURL(formData.thumbnail)) {
            newErrors.thumbnail = t('dashboard.portfolio.form.validation.invalid_url');
        }

        // Validate Technologies (At least one)
        const techArray = formData.technologies ? formData.technologies.split(',').map(i => i.trim()).filter(i => i !== '') : [];
        if (techArray.length === 0) {
            newErrors.technologies = t('dashboard.portfolio.form.validation.at_least_one');
        }

        // Validate Demo Link (Optional but must be valid URL)
        if (formData.demo_link && !validateURL(formData.demo_link)) {
            newErrors.demo_link = t('dashboard.portfolio.form.validation.invalid_url');
        }

        // Check for duplicate name_en (only for new projects or if name changed)
        const isDuplicateName = projects.some(p =>
            p.name_en?.toLowerCase() === formData.name_en?.toLowerCase().trim() &&
            p.id !== project?.id
        );
        if (isDuplicateName) {
            newErrors.name_en = t('dashboard.portfolio.form.validation.duplicate_name') || 'Project name already exists';
        }

        // Validate Master Language Fields (using 'en' as master internal state)
        if (!formData.name_en?.trim()) newErrors.name_en = t('dashboard.portfolio.form.validation.required');
        if (!formData.type_en?.trim()) newErrors.type_en = t('dashboard.portfolio.form.validation.required');
        if (!formData.short_desc_en?.trim()) newErrors.short_desc_en = t('dashboard.portfolio.form.validation.required');
        if (!formData.full_desc_en?.trim()) newErrors.full_desc_en = t('dashboard.portfolio.form.validation.required');
        if (!formData.duration_en?.trim()) newErrors.duration_en = t('dashboard.portfolio.form.validation.required');
        if (!formData.features_en || formData.features_en.length === 0) {
            newErrors.features_en = t('dashboard.portfolio.form.validation.at_least_one');
        }

        setErrors(newErrors);

        // Auto-scroll to first error
        if (Object.keys(newErrors).length > 0) {
            const firstErrorKey = Object.keys(newErrors)[0];
            setTimeout(() => {
                const element = document.getElementById(`input-${firstErrorKey}`);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    element.focus();
                }
            }, 100);
        }

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation for master language (en)
        if (!formData.name_en?.trim() || !formData.full_desc_en?.trim()) {
            showToast(t('dashboard.portfolio.form.validation.required'), 'error');
            return;
        }

        setLoading(true);

        const langs = ['en', 'id', 'es', 'fr', 'ja'];
        const sourceLang = 'auto'; // Detect automatically from input
        let finalFormData = { ...formData };

        try {
            setIsTranslating(true);
            await Promise.all(langs.map(async (target) => {
                // Translate basic fields
                const [tName, tType, tShortDesc, tFullDesc, tDuration] = await Promise.all([
                    translateText(finalFormData.name_en, target, sourceLang),
                    translateText(finalFormData.type_en, target, sourceLang),
                    translateText(finalFormData.short_desc_en, target, sourceLang),
                    translateText(finalFormData.full_desc_en, target, sourceLang),
                    translateText(finalFormData.duration_en, target, sourceLang)
                ]);

                finalFormData[`name_${target}`] = tName;
                finalFormData[`type_${target}`] = tType;
                finalFormData[`short_desc_${target}`] = tShortDesc;
                finalFormData[`full_desc_${target}`] = tFullDesc;
                finalFormData[`duration_${target}`] = tDuration;

                // Translate features array if present
                const sourceFeatures = finalFormData.features_en || [];
                if (sourceFeatures.length > 0) {
                    finalFormData[`features_${target}`] = await Promise.all(
                        sourceFeatures.map(f => translateText(f, target, sourceLang))
                    );
                }
            }));

            setFormData(finalFormData);
        } catch (err) {
            console.error('Portfolio background translation failed:', err);
        } finally {
            setIsTranslating(false);
        }

        // Final check for essential fields (like thumbnail and techs)
        if (!finalFormData.thumbnail?.trim() || !finalFormData.technologies?.trim()) {
            // Re-run validation for UI feedback
            validateForm();
            setLoading(false);
            return;
        }

        // Convert technologies string to array before saving
        const dataToSave = {
            ...finalFormData,
            technologies: finalFormData.technologies ? finalFormData.technologies.split(',').map(i => i.trim()).filter(i => i !== '') : []
        };

        const result = project ? await onSave(project.id, dataToSave) : await onSave(dataToSave);
        if (result.success) {
            setHasUnsavedChanges(false);
            showToast(project ? t('dashboard.portfolio.form.success.project_updated') : t('dashboard.portfolio.form.success.project_saved'), 'success');
            setTimeout(() => {
                onClose();
            }, 2000);
        } else {
            // Check if it's a duplicate key error
            if (result.error?.includes('duplicate key') || result.error?.includes('name_en_key')) {
                setErrors({ name_en: t('dashboard.portfolio.form.validation.duplicate_name') || 'Project name already exists' });
            } else {
                showToast(t('dashboard.portfolio.form.validation.save_error') + result.error, 'error');
            }
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
        setHasUnsavedChanges(true);
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: null }));
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        await processUpload(file);
    };

    const processUpload = async (file) => {
        if (!file.type.startsWith('image/')) {
            showToast(t('dashboard.portfolio.form.upload.error.type'), 'error');
            return;
        }

        // Limit size to 1MB
        const maxSize = 1 * 1024 * 1024; // 1MB
        if (file.size > maxSize) {
            showToast(t('dashboard.portfolio.form.upload.error.size'), 'error');
            return;
        }

        setIsUploading(true);
        const result = await uploadThumbnail(file);
        setIsUploading(false);

        if (result.success) {
            handleFieldChange('thumbnail', result.url);
            showToast(t('dashboard.portfolio.form.upload.success'), 'success');
        } else {
            console.error('Upload error details:', result.error);
            if (result.error.includes('Bucket not found')) {
                showToast(t('dashboard.portfolio.form.upload.error.bucket'), 'error');
            } else {
                showToast(t('dashboard.portfolio.form.upload.error.generic') || ('Upload failed: ' + result.error), 'error');
            }
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        const file = e.dataTransfer.files?.[0];
        if (file) await processUpload(file);
    };

    const handlePaste = async (e) => {
        const item = Array.from(e.clipboardData.items).find(i => i.type.startsWith('image/'));
        if (item) {
            const file = item.getAsFile();
            if (file) await processUpload(file);
        }
    };

    // Global paste listener when modal is open
    useEffect(() => {
        if (!isOpen) return;

        const onGlobalPaste = (e) => {
            // Check if we are in an input/textarea that isn't the paste target
            // But usually we want to allow pasting images anywhere in the form
            handlePaste(e);
        };

        window.addEventListener('paste', onGlobalPaste);
        return () => window.removeEventListener('paste', onGlobalPaste);
    }, [isOpen]);



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
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                                        {t('dashboard.portfolio.form.labels.thumbnail')}
                                    </label>
                                    <div
                                        onDragOver={handleDragOver}
                                        onDrop={handleDrop}
                                        onPaste={handlePaste}
                                        className={`relative group border-2 border-dashed rounded-2xl transition-all h-[120px] flex flex-col items-center justify-center p-4 text-center cursor-pointer overflow-hidden ${formData.thumbnail
                                            ? 'border-emerald-500/50 bg-emerald-50/10'
                                            : 'border-slate-200 dark:border-slate-700 hover:border-blue-500/50 hover:bg-slate-50 dark:hover:bg-slate-900/50'
                                            } ${errors.thumbnail ? 'border-red-500 bg-red-50/10' : ''}`}
                                        onClick={() => !formData.thumbnail && fileInputRef.current?.click()}
                                    >
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleFileUpload}
                                        />

                                        {isUploading ? (
                                            <div className="flex flex-col items-center gap-2">
                                                <RefreshCw size={24} className="text-blue-500 animate-spin" />
                                                <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wider">{t('dashboard.portfolio.form.upload.status')}</span>
                                            </div>
                                        ) : formData.thumbnail ? (
                                            <>
                                                <img
                                                    src={formData.thumbnail}
                                                    alt="Preview"
                                                    className="absolute inset-0 w-full h-full object-cover"
                                                />
                                                <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            fileInputRef.current?.click();
                                                        }}
                                                        className="p-2 bg-white/20 backdrop-blur-md rounded-lg text-white hover:bg-white/30 transition-all"
                                                    >
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleFieldChange('thumbnail', '');
                                                        }}
                                                        className="p-2 bg-red-500/80 backdrop-blur-md rounded-lg text-white hover:bg-red-500 transition-all"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                                    <Upload size={20} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
                                                </div>
                                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">
                                                    {t('dashboard.portfolio.form.upload.title')}
                                                </p>
                                                <p className="text-[9px] text-slate-400">
                                                    {t('dashboard.portfolio.form.upload.subtitle')}
                                                </p>
                                            </>
                                        )}
                                    </div>
                                    <input
                                        type="url"
                                        value={formData.thumbnail}
                                        onChange={(e) => handleFieldChange('thumbnail', e.target.value)}
                                        placeholder={t('dashboard.portfolio.form.upload.placeholder')}
                                        className="w-full mt-2 text-[10px] bg-transparent border-none focus:ring-0 p-0 text-slate-400 italic placeholder:text-slate-300"
                                    />
                                    {errors.thumbnail && <p className="text-red-500 text-xs mt-1">{errors.thumbnail}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Content & Localization */}
                        <div className="space-y-4">
                            <h4 className="text-sm font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                                <List size={16} /> {t('dashboard.portfolio.form.sections.content')}
                            </h4>

                            <div className="space-y-6 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-700 relative overflow-hidden">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('dashboard.portfolio.form.labels.project_name')}</label>
                                        <input
                                            id="input-name_en"
                                            type="text"
                                            value={formData.name_en || ''}
                                            onChange={(e) => handleFieldChange('name_en', e.target.value)}
                                            className={`w-full bg-white dark:bg-slate-800 border ${errors.name_en ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'} rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none dark:text-white`}
                                            placeholder={t('dashboard.portfolio.form.placeholders.name')}
                                        />
                                        {errors.name_en && <p className="text-red-500 text-xs mt-1">{errors.name_en}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('dashboard.portfolio.form.labels.type')}</label>
                                        <input
                                            id="input-type_en"
                                            type="text"
                                            value={formData.type_en || ''}
                                            onChange={(e) => handleFieldChange('type_en', e.target.value)}
                                            className={`w-full bg-white dark:bg-slate-800 border ${errors.type_en ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'} rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none dark:text-white`}
                                            placeholder={t('dashboard.portfolio.form.placeholders.type')}
                                        />
                                        {errors.type_en && <p className="text-red-500 text-xs mt-1">{errors.type_en}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('dashboard.portfolio.form.labels.duration')}</label>
                                        <input
                                            id="input-duration_en"
                                            type="text"
                                            value={formData.duration_en || ''}
                                            onChange={(e) => handleFieldChange('duration_en', e.target.value)}
                                            className={`w-full bg-white dark:bg-slate-800 border ${errors.duration_en ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'} rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none dark:text-white`}
                                            placeholder={t('dashboard.portfolio.form.placeholders.duration')}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('dashboard.portfolio.form.labels.short_description')}</label>
                                    <input
                                        id="input-short_desc_en"
                                        type="text"
                                        value={formData.short_desc_en || ''}
                                        onChange={(e) => handleFieldChange('short_desc_en', e.target.value)}
                                        className={`w-full bg-white dark:bg-slate-800 border ${errors.short_desc_en ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'} rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none dark:text-white`}
                                        placeholder={t('dashboard.portfolio.form.placeholders.short_desc')}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('dashboard.portfolio.form.labels.full_description')}</label>
                                    <textarea
                                        id="input-full_desc_en"
                                        rows={4}
                                        value={formData.full_desc_en || ''}
                                        onChange={(e) => handleFieldChange('full_desc_en', e.target.value)}
                                        className={`w-full bg-white dark:bg-slate-800 border ${errors.full_desc_en ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'} rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none dark:text-white`}
                                        placeholder={t('dashboard.portfolio.form.placeholders.full_desc')}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('dashboard.portfolio.form.labels.features')}</label>
                                    <textarea
                                        id="input-features_en"
                                        rows={2}
                                        value={(formData.features_en || []).join(', ')}
                                        onChange={(e) => handleArrayInput('features_en', e.target.value)}
                                        className={`w-full bg-white dark:bg-slate-800 border ${errors.features_en ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'} rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none dark:text-white`}
                                        placeholder={t('dashboard.portfolio.form.placeholders.features')}
                                    />
                                </div>
                            </div>
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
                                        id="input-technologies"
                                        type="text"
                                        value={formData.technologies}
                                        onChange={(e) => handleFieldChange('technologies', e.target.value)}
                                        className={`w-full bg-slate-50 dark:bg-slate-900 border ${errors.technologies ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'} rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none dark:text-white`}
                                        placeholder={t('dashboard.portfolio.form.placeholders.tech')}
                                    />
                                    {errors.technologies && <p className="text-red-500 text-xs mt-1">{errors.technologies}</p>}
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('dashboard.portfolio.form.labels.demo')}</label>
                                    <input
                                        type="url"
                                        value={formData.demo_link}
                                        onChange={(e) => handleFieldChange('demo_link', e.target.value)}
                                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none dark:text-white"
                                        placeholder={t('dashboard.portfolio.form.placeholders.demo')}
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

            {/* Premium Toast Notification */}
            <AnimatePresence>
                {toast.show && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.9 }}
                        className={`fixed bottom-8 right-8 z-[130] ${toast.type === 'success' ? 'bg-emerald-600 shadow-emerald-500/20' : 'bg-red-600 shadow-red-500/20'
                            } text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/10 backdrop-blur-md`}
                    >
                        {toast.type === 'success' ? (
                            <div className="bg-white/20 p-1.5 rounded-lg">
                                <CheckCircle size={20} />
                            </div>
                        ) : (
                            <div className="bg-white/20 p-1.5 rounded-lg">
                                <AlertCircle size={20} />
                            </div>
                        )}
                        <span className="font-bold text-sm tracking-wide">
                            {toast.message}
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
