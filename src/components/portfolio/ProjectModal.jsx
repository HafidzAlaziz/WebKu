import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Calendar, Code, CheckCircle } from 'lucide-react';

const ProjectModal = ({ project, isOpen, onClose }) => {
    if (!project) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 z-50 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                transition={{ duration: 0.3 }}
                                className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
                            >
                                {/* Close Button */}
                                <button
                                    onClick={onClose}
                                    className="absolute top-4 right-4 z-10 p-2 bg-white/90 dark:bg-slate-900/90 rounded-full hover:bg-white dark:hover:bg-slate-900 transition-colors shadow-lg"
                                >
                                    <X size={24} className="text-slate-700 dark:text-slate-300" />
                                </button>

                                {/* Scrollable Content */}
                                <div className="overflow-y-auto max-h-[90vh]">
                                    {/* Hero Image */}
                                    <div className="relative h-80 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-slate-700 dark:to-slate-600">
                                        <img
                                            src={project.thumbnail}
                                            alt={project.name}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                        <div className="absolute bottom-6 left-6 right-6">
                                            <h2 className="text-4xl font-bold text-white mb-2">
                                                {project.name}
                                            </h2>
                                            <p className="text-blue-200 text-lg font-medium">
                                                {project.type}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-8">
                                        {/* Description */}
                                        <div className="mb-8">
                                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                                                Deskripsi Project
                                            </h3>
                                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                                                {project.fullDescription}
                                            </p>
                                        </div>

                                        {/* Project Info Grid */}
                                        <div className="grid md:grid-cols-2 gap-6 mb-8">
                                            {/* Duration */}
                                            <div className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                                                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                                    <Calendar size={24} className="text-blue-600 dark:text-blue-400" />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                                                        Lama Pengerjaan
                                                    </p>
                                                    <p className="font-semibold text-slate-900 dark:text-white">
                                                        {project.duration}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Demo Link */}
                                            <div className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                                                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                                    <ExternalLink size={24} className="text-green-600 dark:text-green-400" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                                                        Link Demo
                                                    </p>
                                                    {project.demoLink ? (
                                                        <a
                                                            href={project.demoLink}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="font-semibold text-blue-600 dark:text-blue-400 hover:underline break-all"
                                                        >
                                                            Lihat Website
                                                        </a>
                                                    ) : (
                                                        <p className="font-semibold text-slate-500 dark:text-slate-400 italic">
                                                            Tidak Tersedia
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Features */}
                                        <div className="mb-8">
                                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                                                Fitur-Fitur
                                            </h3>
                                            <div className="grid md:grid-cols-2 gap-3">
                                                {project.features.map((feature, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg"
                                                    >
                                                        <CheckCircle size={20} className="text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                                                        <span className="text-slate-700 dark:text-slate-300">
                                                            {feature}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Technologies */}
                                        <div>
                                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                                <Code size={28} />
                                                Teknologi yang Digunakan
                                            </h3>
                                            <div className="flex flex-wrap gap-3">
                                                {project.technologies.map((tech, index) => (
                                                    <span
                                                        key={index}
                                                        className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg shadow-md"
                                                    >
                                                        {tech}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};

export default ProjectModal;
