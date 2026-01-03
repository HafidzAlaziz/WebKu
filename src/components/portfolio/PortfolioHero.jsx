import React from 'react';
import { motion } from 'framer-motion';

const PortfolioHero = () => {
    return (
        <section id="portfolio-hero" className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary-dark via-primary to-primary-dark pt-20">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 90, 0],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-brand-emerald-400/30 to-transparent rounded-full blur-3xl"
                />
                <motion.div
                    animate={{
                        scale: [1.2, 1, 1.2],
                        rotate: [90, 0, 90],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{
                        duration: 15,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-brand-gold-400/30 to-transparent rounded-full blur-3xl"
                />
            </div>

            {/* Content */}
            <div className="relative z-10 container mx-auto px-6 text-center">
                <motion.h1
                    className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    Portfolio Project Kami
                </motion.h1>
                <motion.p
                    className="text-xl md:text-2xl text-slate-300 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.5 }}
                >
                    Lihat berbagai website custom yang sudah kami buat untuk klien dari berbagai bidang.
                </motion.p>
            </div>
        </section>
    );
};

export default PortfolioHero;
