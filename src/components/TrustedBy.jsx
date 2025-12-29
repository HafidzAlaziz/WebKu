import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Award, CheckCircle2, Zap } from 'lucide-react';

const TrustedBy = () => {
    const badges = [
        {
            icon: Shield,
            title: "Verified Professional",
            description: "Terdaftar & Terverifikasi"
        },
        {
            icon: Award,
            title: "Top Rated",
            description: "Rating 5.0 dari Klien"
        },
        {
            icon: CheckCircle2,
            title: "Quality Guaranteed",
            description: "Garansi Kepuasan 100%"
        },
        {
            icon: Zap,
            title: "Fast Delivery",
            description: "Pengerjaan Cepat & Tepat"
        }
    ];

    const technologies = [
        { name: "React", color: "text-cyan-500" },
        { name: "Next.js", color: "text-slate-900 dark:text-white" },
        { name: "Tailwind CSS", color: "text-blue-500" },
        { name: "Node.js", color: "text-green-600" },
        { name: "MongoDB", color: "text-green-500" },
        { name: "Vercel", color: "text-slate-900 dark:text-white" }
    ];

    return (
        <section className="py-12 bg-white dark:bg-slate-900">
            <div className="container mx-auto px-6">
                {/* Professional Badges */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-12"
                >
                    <h3 className="text-center text-sm font-semibold text-slate-500 dark:text-slate-400 mb-6 uppercase tracking-wider">
                        Dipercaya oleh Profesional
                    </h3>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {badges.map((badge, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                className="flex flex-col items-center text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 transition-colors"
                            >
                                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-3">
                                    <badge.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                </div>
                                <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">
                                    {badge.title}
                                </h4>
                                <p className="text-xs text-slate-600 dark:text-slate-400">
                                    {badge.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Technologies Used */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="text-center"
                >
                    <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-6 uppercase tracking-wider">
                        Teknologi Profesional yang Kami Gunakan
                    </h3>
                    <div className="flex flex-wrap justify-center gap-4 lg:gap-6">
                        {technologies.map((tech, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.3, delay: 0.3 + index * 0.05 }}
                                whileHover={{ scale: 1.1 }}
                                className="px-6 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full shadow-sm hover:shadow-md transition-all"
                            >
                                <span className={`font-bold text-sm lg:text-base ${tech.color}`}>
                                    {tech.name}
                                </span>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default TrustedBy;
