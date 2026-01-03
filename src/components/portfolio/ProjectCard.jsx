import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Code, Clock, Star } from 'lucide-react';

const ProjectCard = ({ project, onClick }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -8 }}
            transition={{ duration: 0.3 }}
            className="group relative bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
            onClick={() => onClick(project)}
        >
            {/* Project Image */}
            <div className="relative h-56 overflow-hidden bg-gradient-to-br from-brand-emerald-50 to-brand-gold-50 dark:from-slate-700 dark:to-slate-600">
                <img
                    src={project.thumbnail}
                    alt={project.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Overlay Icons */}
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {project.demoLink && (
                        <div className="p-2 bg-white/90 dark:bg-slate-800/90 rounded-full shadow-lg">
                            <ExternalLink size={18} className="text-primary" />
                        </div>
                    )}
                </div>
            </div>

            {/* Project Info */}
            <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-primary dark:group-hover:text-brand-emerald-400 transition-colors">
                        {project.name}
                    </h3>
                    {project.client && (
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full flex items-center gap-1 flex-shrink-0 ${project.client === 'Client'
                            ? 'bg-brand-emerald-100 dark:bg-primary-dark/30 text-primary dark:text-brand-emerald-400'
                            : 'bg-brand-gold-100 dark:bg-brand-gold-900/30 text-accent-dark dark:text-brand-gold-400'
                            }`}>
                            <Star size={12} fill="currentColor" />
                            {project.client}
                        </span>
                    )}
                </div>

                <p className="text-sm text-primary dark:text-brand-emerald-400 font-bold mb-3">
                    {project.type}
                </p>

                <p className="text-slate-600 dark:text-slate-300 text-sm mb-4 line-clamp-2 leading-relaxed">
                    {project.shortDescription}
                </p>

                {/* Tech Stack Pills */}
                <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.slice(0, 3).map((tech, index) => (
                        <span
                            key={index}
                            className="px-2 py-1 bg-slate-100 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 text-xs rounded-full flex items-center gap-1 border border-transparent hover:border-brand-emerald-200 transition-colors"
                        >
                            <Code size={12} />
                            {tech}
                        </span>
                    ))}
                    {project.technologies.length > 3 && (
                        <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 text-xs rounded-full">
                            +{project.technologies.length - 3}
                        </span>
                    )}
                </div>

                {/* Duration */}
                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-6">
                    <Clock size={16} />
                    <span>{project.duration}</span>
                </div>

                {/* View Details Button */}
                <motion.button
                    whileHover={{ scale: 1.02, backgroundColor: '#065f46' }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-2.5 bg-primary text-white font-semibold rounded-lg transition-colors shadow-md hover:shadow-primary/20"
                >
                    Lihat Detail
                </motion.button>
            </div>
        </motion.div>
    );
};

export default ProjectCard;
