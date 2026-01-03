import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import ProjectCard from './ProjectCard';
import ProjectModal from './ProjectModal';

const ProjectGallery = () => {
    const { t } = useTranslation();
    const [selectedProject, setSelectedProject] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [sourceFilter, setSourceFilter] = useState('All');
    const [filter, setFilter] = useState('All');
    const [visibleCount, setVisibleCount] = useState(3);

    // Get projects data from translations
    const projectsData = useMemo(() => [
        {
            id: -1,
            name: t('portfolio.projects.professional_service.name'),
            category: 'landing_page',
            type: t('portfolio.projects.professional_service.type'),
            thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2026&auto=format&fit=crop",
            shortDescription: t('portfolio.projects.professional_service.short_desc'),
            fullDescription: t('portfolio.projects.professional_service.full_desc'),
            duration: "1 " + t('common.day', { count: 1 }),
            client: "Create",
            demoLink: "https://professional-service-topaz.vercel.app/",
            technologies: ["React", "Tailwind CSS", "Framer Motion", "Vercel"],
            features: t('portfolio.projects.professional_service.features', { returnObjects: true })
        },
        {
            id: 0,
            name: t('portfolio.projects.umkm_store.name'),
            category: 'online_store',
            type: t('portfolio.projects.umkm_store.type'),
            thumbnail: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2070&auto=format&fit=crop",
            shortDescription: t('portfolio.projects.umkm_store.short_desc'),
            fullDescription: t('portfolio.projects.umkm_store.full_desc'),
            duration: "1 " + t('common.day', { count: 1 }),
            client: "Create",
            demoLink: "https://umkm-ivory.vercel.app/",
            technologies: ["Next.js", "Tailwind CSS", "Framer Motion", "Vercel"],
            features: t('portfolio.projects.umkm_store.features', { returnObjects: true })
        },
        {
            id: 1,
            name: t('portfolio.projects.vayana.name'),
            category: 'company_profile',
            type: t('portfolio.projects.vayana.type'),
            thumbnail: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2070&auto=format&fit=crop",
            shortDescription: t('portfolio.projects.vayana.short_desc'),
            fullDescription: t('portfolio.projects.vayana.full_desc'),
            duration: "1 " + t('common.day', { count: 1 }),
            client: "Create",
            demoLink: "https://vayana-hazel.vercel.app/",
            technologies: ["Next.js", "Tailwind CSS", "Framer Motion", "Vercel"],
            features: t('portfolio.projects.vayana.features', { returnObjects: true })
        },
        {
            id: 2,
            name: t('portfolio.projects.aura_visuals.name'),
            category: 'company_profile',
            type: t('portfolio.projects.aura_visuals.type'),
            thumbnail: "https://company-profile-xi-indol.vercel.app/images/portfolio-1.jpg",
            shortDescription: t('portfolio.projects.aura_visuals.short_desc'),
            fullDescription: t('portfolio.projects.aura_visuals.full_desc'),
            duration: "1 " + t('common.day', { count: 1 }),
            client: "Create",
            demoLink: "https://company-profile-xi-indol.vercel.app/",
            technologies: ["Next.js", "Tailwind CSS", "Framer Motion", "Vercel"],
            features: t('portfolio.projects.aura_visuals.features', { returnObjects: true })
        },
        {
            id: 3,
            name: t('portfolio.projects.fashion_store.name'),
            category: 'online_store',
            type: t('portfolio.projects.fashion_store.type'),
            thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
            shortDescription: t('portfolio.projects.fashion_store.short_desc'),
            fullDescription: t('portfolio.projects.fashion_store.full_desc'),
            duration: "3 " + t('common.week', { count: 3 }),
            client: "Client",
            demoLink: "",
            technologies: ["React", "Tailwind CSS", "Node.js", "MongoDB", "Stripe"],
            features: t('portfolio.projects.fashion_store.features', { returnObjects: true })
        },
        {
            id: 4,
            name: t('portfolio.projects.tech_startup.name'),
            category: 'company_profile',
            type: t('portfolio.projects.tech_startup.type'),
            thumbnail: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop",
            shortDescription: t('portfolio.projects.tech_startup.short_desc'),
            fullDescription: t('portfolio.projects.tech_startup.full_desc'),
            duration: "2 " + t('common.week', { count: 2 }),
            client: "Client",
            demoLink: "",
            technologies: ["Next.js", "Tailwind CSS", "Framer Motion", "EmailJS"],
            features: t('portfolio.projects.tech_startup.features', { returnObjects: true })
        },
        {
            id: 5,
            name: t('portfolio.projects.saas_product.name'),
            category: 'landing_page',
            type: t('portfolio.projects.saas_product.type'),
            thumbnail: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=600&fit=crop",
            shortDescription: t('portfolio.projects.saas_product.short_desc'),
            fullDescription: t('portfolio.projects.saas_product.full_desc'),
            duration: "1 " + t('common.week', { count: 1 }),
            client: "Client",
            demoLink: "",
            technologies: ["React", "Tailwind CSS", "Vite", "Google Analytics"],
            features: t('portfolio.projects.saas_product.features', { returnObjects: true })
        },
        {
            id: 6,
            name: t('portfolio.projects.restaurant.name'),
            category: 'online_store',
            type: t('portfolio.projects.restaurant.type'),
            thumbnail: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop",
            shortDescription: t('portfolio.projects.restaurant.short_desc'),
            fullDescription: t('portfolio.projects.restaurant.full_desc'),
            duration: "2 " + t('common.week', { count: 2 }),
            client: "Client",
            demoLink: "",
            technologies: ["React", "Tailwind CSS", "Firebase", "WhatsApp API"],
            features: t('portfolio.projects.restaurant.features', { returnObjects: true })
        },
        {
            id: 7,
            name: t('portfolio.projects.photographer.name'),
            category: 'portfolio',
            type: t('portfolio.projects.photographer.type'),
            thumbnail: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&h=600&fit=crop",
            shortDescription: t('portfolio.projects.photographer.short_desc'),
            fullDescription: t('portfolio.projects.photographer.full_desc'),
            duration: "1.5 " + t('common.week', { count: 1.5 }),
            client: "Client",
            demoLink: "",
            technologies: ["Next.js", "Tailwind CSS", "Cloudinary", "Lightbox"],
            features: t('portfolio.projects.photographer.features', { returnObjects: true })
        },
        {
            id: 8,
            name: t('portfolio.projects.edu_platform.name'),
            category: 'web_app',
            type: t('portfolio.projects.edu_platform.type'),
            thumbnail: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&h=600&fit=crop",
            shortDescription: t('portfolio.projects.edu_platform.short_desc'),
            fullDescription: t('portfolio.projects.edu_platform.full_desc'),
            duration: "4 " + t('common.week', { count: 4 }),
            client: "Client",
            demoLink: "",
            technologies: ["React", "Node.js", "MongoDB", "Video.js", "PDF.js"],
            features: t('portfolio.projects.edu_platform.features', { returnObjects: true })
        },
        {
            id: 9,
            name: t('portfolio.projects.ai_chatbot.name'),
            category: 'web_app',
            type: t('portfolio.projects.ai_chatbot.type'),
            thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop",
            shortDescription: t('portfolio.projects.ai_chatbot.short_desc'),
            fullDescription: t('portfolio.projects.ai_chatbot.full_desc'),
            duration: "1 " + t('common.day', { count: 1 }),
            client: "Create",
            demoLink: "https://chatbot-dusky-eta-13.vercel.app/",
            technologies: ["React", "Tailwind CSS", "OpenAI API", "Vercel"],
            features: t('portfolio.projects.ai_chatbot.features', { returnObjects: true })
        },
        {
            id: 10,
            name: t('portfolio.projects.handara.name'),
            category: 'company_profile',
            type: t('portfolio.projects.handara.type'),
            thumbnail: "https://images.unsplash.com/photo-1582653291997-079a1c04e5a1?w=800&h=600&fit=crop",
            shortDescription: t('portfolio.projects.handara.short_desc'),
            fullDescription: t('portfolio.projects.handara.full_desc'),
            duration: "1 " + t('common.day', { count: 1 }),
            client: "Create",
            demoLink: "https://handara-bali.vercel.app/",
            technologies: ["Next.js", "Framer Motion", "Tailwind CSS", "React Leaflet"],
            features: t('portfolio.projects.handara.features', { returnObjects: true })
        }
    ], [t]);

    const categories = [
        { key: 'All', label: t('portfolio.gallery.filters.all_categories') },
        { key: 'web_app', label: t('portfolio.gallery.categories.web_app') },
        { key: 'company_profile', label: t('portfolio.gallery.categories.company_profile') },
        { key: 'online_store', label: t('portfolio.gallery.categories.online_store') },
        { key: 'landing_page', label: t('portfolio.gallery.categories.landing_page') },
        { key: 'portfolio', label: t('portfolio.gallery.categories.portfolio') }
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
                    <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
                        {t('portfolio.gallery.title')}
                    </h2>
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
