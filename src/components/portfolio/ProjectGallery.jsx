import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { usePortfolio } from '../../hooks/usePortfolio';
import ProjectCard from './ProjectCard';
import ProjectModal from './ProjectModal';

const ProjectGallery = () => {
    const { t, i18n } = useTranslation();
    const [selectedProject, setSelectedProject] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [sourceFilter, setSourceFilter] = useState('All');
    const [filter, setFilter] = useState('All');
    const [visibleCount, setVisibleCount] = useState(3);

    const {
        projects: dbProjects,
        loading,
        fetchProjects
    } = usePortfolio();

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    // Map DB projects to the format used by the component
    const projectsData = useMemo(() => {
        const lang = i18n.language || 'en';
        return dbProjects.map(p => ({
            id: p.id,
            name: p[`name_${lang}`] || p.name_en,
            category: p.category,
            type: p[`type_${lang}`] || p.type_en,
            thumbnail: p.thumbnail,
            shortDescription: p[`short_desc_${lang}`] || p.short_desc_en,
            fullDescription: p[`full_desc_${lang}`] || p.full_desc_en,
            duration: p[`duration_${lang}`] || p.duration_en,
            client: p.client_type,
            demoLink: p.demo_link,
            technologies: p.technologies || [],
            features: p[`features_${lang}`] || p.features_en || []
        }));
    }, [dbProjects, i18n.language]);

    const categories = [
        { key: 'All', label: t('portfolio.gallery.filters.all_categories') },
        { key: 'web_app', label: t('portfolio.gallery.categories.web_app') },
        { key: 'company_profile', label: t('portfolio.gallery.categories.company_profile') },
        { key: 'online_store', label: t('portfolio.gallery.categories.online_store') },
        { key: 'landing_page', label: t('portfolio.gallery.categories.landing_page') },
        { key: 'portfolio', label: t('portfolio.gallery.categories.portfolio') },
        { key: 'others', label: t('portfolio.gallery.categories.others') }
    ];

    const categoryFiltered = filter === 'All'
        ? projectsData
        : projectsData.filter(project => project.category === filter);

    // 2. Filter by Source (Client vs Create)
    const finalFilteredProjects = sourceFilter === 'All'
        ? categoryFiltered
        : categoryFiltered.filter(project => {
            if (sourceFilter === 'Create') return project.client === 'Create';
            return project.client !== 'Create'; // Assuming anything not 'Create' is a Client project
        });

    // 3. Pagination Logic
    const displayedProjects = finalFilteredProjects.slice(0, visibleCount);
    const hasMoreProjects = finalFilteredProjects.length > visibleCount;

    const handleFilterChange = (category) => {
        setFilter(category);
        setVisibleCount(3); // Reset pagination on filter change
    };

    const handleSourceFilterChange = (source) => {
        setSourceFilter(source);
        setVisibleCount(3); // Reset pagination on filter change
    };

    const handleShowMore = () => {
        if (hasMoreProjects) {
            setVisibleCount(finalFilteredProjects.length); // Show All
        } else {
            setVisibleCount(3); // Show Less (Reset)
        }
    };

    const handleProjectClick = (project) => {
        setSelectedProject(project);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setTimeout(() => setSelectedProject(null), 300);
    };

    return (
        <section id="project-gallery" className="py-20 bg-slate-50 dark:bg-slate-900">
            <div className="container mx-auto px-6">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
                        {t('portfolio.gallery.title')}
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                        {t('portfolio.gallery.subtitle')}
                    </p>
                </motion.div>

                {/* Source Filter (Top Level) */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex justify-center mb-10"
                >
                    <div className="bg-white dark:bg-slate-800 p-1.5 rounded-full inline-flex shadow-xl border border-slate-100 dark:border-slate-700">
                        {[
                            { key: 'All', label: t('portfolio.gallery.filters.all') },
                            { key: 'Client', label: t('portfolio.gallery.filters.client') },
                            { key: 'Create', label: t('portfolio.gallery.filters.create') }
                        ].map((source) => (
                            <button
                                key={source.key}
                                onClick={() => handleSourceFilterChange(source.key)}
                                className={`px-8 py-2.5 rounded-full text-sm font-bold transition-all ${sourceFilter === source.key
                                    ? 'bg-primary text-white shadow-lg'
                                    : 'text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-white'
                                    }`}
                            >
                                {source.label}
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* Category Filter Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="flex flex-wrap justify-center gap-3 mb-12"
                >
                    {categories.map((category) => (
                        <motion.button
                            key={category.key}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleFilterChange(category.key)}
                            className={`px-6 py-2.5 rounded-full font-semibold transition-all shadow-sm ${filter === category.key
                                ? 'bg-primary text-white shadow-primary/20'
                                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-brand-emerald-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                                }`}
                        >
                            {category.label}
                        </motion.button>
                    ))}
                </motion.div>

                {/* Projects Grid */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-slate-500 dark:text-slate-400 font-medium">{t('common.loading')}</p>
                    </div>
                ) : (
                    <>
                        <motion.div
                            layout
                            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
                        >
                            {displayedProjects.map((project, index) => (
                                <motion.div
                                    key={project.id}
                                    layout
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ delay: index * 0.05, duration: 0.3 }}
                                >
                                    <ProjectCard
                                        project={project}
                                        onClick={handleProjectClick}
                                    />
                                </motion.div>
                            ))}
                        </motion.div>
                    </>
                )}

                {/* Show More / Show Less Button */}
                {finalFilteredProjects.length > 3 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="flex justify-center"
                    >
                        <button
                            onClick={handleShowMore}
                            className="px-8 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-semibold rounded-full hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
                        >
                            {hasMoreProjects ? t('portfolio.gallery.buttons.show_more') : t('portfolio.gallery.buttons.show_less')}
                        </button>
                    </motion.div>
                )}

                {/* Empty State */}
                {finalFilteredProjects.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20"
                    >
                        <p className="text-slate-500 dark:text-slate-400 text-lg">
                            {t('portfolio.gallery.empty')}
                        </p>
                    </motion.div>
                )}
            </div>

            {/* Project Modal */}
            <ProjectModal
                project={selectedProject}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
            />
        </section>
    );
};

export default ProjectGallery;
