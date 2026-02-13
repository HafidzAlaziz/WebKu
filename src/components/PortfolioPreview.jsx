import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { usePortfolio } from '../hooks/usePortfolio';
import ProjectCard from './portfolio/ProjectCard';
import ProjectModal from './portfolio/ProjectModal';

const PortfolioPreview = () => {
    const { t, i18n } = useTranslation();
    const [selectedProject, setSelectedProject] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const {
        projects: dbProjects,
        loading,
        fetchProjects
    } = usePortfolio();

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    // Map DB projects and filter top 4 for preview
    const featuredProjects = useMemo(() => {
        const lang = i18n.language || 'en';
        return dbProjects.slice(0, 4).map(p => ({
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

    const handleProjectClick = (project) => {
        setSelectedProject(project);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setTimeout(() => setSelectedProject(null), 300);
    };

    return (
        <section className="py-10 lg:py-12 bg-slate-50 dark:bg-slate-900">
            <div className="container mx-auto px-6">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-3">
                        {t('portfolio_preview.title')}
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">
                        {t('portfolio_preview.subtitle')}
                    </p>
                </motion.div>

                {/* Projects Grid */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-slate-500 dark:text-slate-400 font-medium">{t('common.loading')}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                        {featuredProjects.map((project, index) => (
                            <ProjectCard
                                key={project.id}
                                project={project}
                                onClick={handleProjectClick}
                            />
                        ))}
                    </div>
                )}

                {/* View All Button */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="text-center"
                >
                    <Link
                        to="/portfolio"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full shadow-lg hover:shadow-blue-500/30 transition-all"
                    >
                        {t('portfolio_preview.view_all')} <ArrowRight size={20} />
                    </Link>
                </motion.div>
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

export default PortfolioPreview;
