import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const PortfolioPreview = () => {
    const { t } = useTranslation();

    // Featured projects - showing the most recent/impressive ones
    const featuredProjects = [
        {
            id: -1,
            name: t('portfolio.projects.professional_service.name'),
            type: t('portfolio.projects.professional_service.type'),
            thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2026&auto=format&fit=crop",
            demoLink: "https://professional-service-topaz.vercel.app/"
        },
        {
            id: 0,
            name: t('portfolio.projects.vayana.name'),
            type: t('portfolio.projects.vayana.type'),
            thumbnail: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2070&auto=format&fit=crop",
            demoLink: "https://vayana-hazel.vercel.app/"
        },
        {
            id: 1,
            name: t('portfolio.projects.aura_visuals.name'),
            type: t('portfolio.projects.aura_visuals.type'),
            thumbnail: "https://company-profile-xi-indol.vercel.app/images/portfolio-1.jpg",
            demoLink: "https://company-profile-xi-indol.vercel.app/"
        },
        {
            id: 8,
            name: t('portfolio.projects.ai_chatbot.name'),
            type: t('portfolio.projects.ai_chatbot.type'),
            thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop",
            demoLink: "https://chatbot-dusky-eta-13.vercel.app/"
        }
    ];

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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {featuredProjects.map((project, index) => (
                        <motion.div
                            key={project.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="group relative bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
                        >
                            {/* Thumbnail */}
                            <div className="relative h-48 overflow-hidden">
                                <img
                                    src={`${project.thumbnail}&fm=webp`}
                                    alt={project.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    loading="lazy"
                                    width="400"
                                    height="300"
                                />
                                {/* Overlay on Hover */}
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                                    {project.demoLink && (
                                        <a
                                            href={project.demoLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-4 py-2 bg-white text-slate-900 rounded-full text-sm font-semibold flex items-center gap-2 hover:bg-blue-500 hover:text-white transition-colors"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            {t('portfolio_preview.live_demo')} <ExternalLink size={14} />
                                        </a>
                                    )}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-4">
                                <h3 className="font-bold text-slate-900 dark:text-white mb-1 text-lg">
                                    {project.name}
                                </h3>
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                    {project.type}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

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
        </section>
    );
};

export default PortfolioPreview;
