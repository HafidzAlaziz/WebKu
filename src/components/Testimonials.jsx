import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Testimonials = () => {
    const { t } = useTranslation();
    const [currentIndex, setCurrentIndex] = useState(0);

    const testimonialsData = t('testimonials.items', { returnObjects: true });

    useEffect(() => {
        if (!Array.isArray(testimonialsData)) return;
        const timer = setInterval(() => {
            nextSlide();
        }, 5000);
        return () => clearInterval(timer);
    }, [currentIndex, testimonialsData]);

    const nextSlide = () => {
        if (!Array.isArray(testimonialsData)) return;
        setCurrentIndex((prev) => (prev + 1) % testimonialsData.length);
    };

    const prevSlide = () => {
        if (!Array.isArray(testimonialsData)) return;
        setCurrentIndex((prev) => (prev - 1 + testimonialsData.length) % testimonialsData.length);
    };

    const getInitials = (name) => {
        if (!name) return '??';
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };

    if (!Array.isArray(testimonialsData)) return null;

    return (
        <section id="testimonials" className="py-20 bg-slate-50 dark:bg-slate-800 relative z-10 overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-4">{t('testimonials.title')}</h2>
                    <p className="text-slate-600 dark:text-slate-300 text-lg">
                        {t('testimonials.subtitle')}
                    </p>
                </div>

                <div className="max-w-4xl mx-auto relative">
                    <div className="absolute top-0 left-0 -translate-x-4 -translate-y-4 text-white/5 dark:text-brand-emerald-900/20">
                        <Quote size={120} />
                    </div>

                    <div className="relative z-10 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 p-8 md:p-12 min-h-[300px] flex items-center justify-center">
                        <AnimatePresence mode='wait'>
                            <motion.div
                                key={currentIndex}
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                transition={{ duration: 0.5 }}
                                className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left w-full"
                            >
                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-3xl font-bold border-4 border-brand-emerald-50 dark:border-primary-dark/50 shadow-md shrink-0">
                                    {getInitials(testimonialsData[currentIndex]?.name)}
                                </div>
                                <div>
                                    <p className="text-xl text-slate-700 dark:text-slate-300 italic mb-6 leading-relaxed">
                                        "{testimonialsData[currentIndex]?.content}"
                                    </p>
                                    <div>
                                        <h4 className="text-lg font-bold text-slate-900 dark:text-white">{testimonialsData[currentIndex]?.name}</h4>
                                        <p className="text-primary dark:text-brand-emerald-400 font-medium">{testimonialsData[currentIndex]?.role}</p>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    <div className="flex justify-center gap-4 mt-8">
                        <button
                            onClick={prevSlide}
                            className="p-3 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-brand-emerald-50 dark:hover:bg-slate-700 hover:text-primary dark:hover:text-brand-emerald-400 hover:border-brand-emerald-200 dark:hover:border-primary transition-all shadow-sm"
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <button
                            onClick={nextSlide}
                            className="p-3 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-brand-emerald-50 dark:hover:bg-slate-700 hover:text-primary dark:hover:text-brand-emerald-400 hover:border-brand-emerald-200 dark:hover:border-primary transition-all shadow-sm"
                        >
                            <ChevronRight size={24} />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
