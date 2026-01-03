import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const ClientTestimonials = () => {
    const { t } = useTranslation();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    // Get testimonials from translations
    const testimonialsData = useMemo(() => [
        {
            id: 1,
            name: "Budi Santoso",
            project: t('portfolio.projects.fashion_store.name'),
            rating: 5,
            avatar: "https://ui-avatars.com/api/?name=Budi+Santoso&background=3b82f6&color=fff&size=128",
            testimonial: t('portfolio.testimonials.items.budi.text')
        },
        {
            id: 2,
            name: "Siti Nurhaliza",
            project: t('portfolio.projects.tech_startup.name'),
            rating: 5,
            avatar: "https://ui-avatars.com/api/?name=Siti+Nurhaliza&background=8b5cf6&color=fff&size=128",
            testimonial: t('portfolio.testimonials.items.siti.text')
        },
        {
            id: 3,
            name: "Ahmad Fauzi",
            project: t('portfolio.projects.saas_product.name'),
            rating: 5,
            avatar: "https://ui-avatars.com/api/?name=Ahmad+Fauzi&background=10b981&color=fff&size=128",
            testimonial: t('portfolio.testimonials.items.ahmad.text')
        },
        {
            id: 4,
            name: "Dewi Lestari",
            project: t('portfolio.projects.restaurant.name'),
            rating: 5,
            avatar: "https://ui-avatars.com/api/?name=Dewi+Lestari&background=f59e0b&color=fff&size=128",
            testimonial: t('portfolio.testimonials.items.dewi.text')
        },
        {
            id: 5,
            name: "Rudi Hermawan",
            project: t('portfolio.projects.photographer.name'),
            rating: 5,
            avatar: "https://ui-avatars.com/api/?name=Rudi+Hermawan&background=ef4444&color=fff&size=128",
            testimonial: t('portfolio.testimonials.items.rudi.text')
        },
        {
            id: 6,
            name: "Linda Wijaya",
            project: t('portfolio.projects.edu_platform.name'),
            rating: 5,
            avatar: "https://ui-avatars.com/api/?name=Linda+Wijaya&background=ec4899&color=fff&size=128",
            testimonial: t('portfolio.testimonials.items.linda.text')
        }
    ], [t]);

    // Auto-play carousel
    useEffect(() => {
        if (!isAutoPlaying) return;

        const interval = setInterval(() => {
            handleNext();
        }, 5000); // Change slide every 5 seconds

        return () => clearInterval(interval);
    }, [currentIndex, isAutoPlaying, testimonialsData.length]);

    const handleNext = () => {
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % testimonialsData.length);
    };

    const handlePrev = () => {
        setDirection(-1);
        setCurrentIndex((prev) => (prev - 1 + testimonialsData.length) % testimonialsData.length);
    };

    const handleDotClick = (index) => {
        setDirection(index > currentIndex ? 1 : -1);
        setCurrentIndex(index);
        setIsAutoPlaying(false);
        setTimeout(() => setIsAutoPlaying(true), 10000); // Resume auto-play after 10s
    };

    const slideVariants = {
        enter: (direction) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0
        }),
        center: {
            x: 0,
            opacity: 1
        },
        exit: (direction) => ({
            x: direction < 0 ? 1000 : -1000,
            opacity: 0
        })
    };

    const currentTestimonial = testimonialsData[currentIndex];

    return (
        <section id="testimonials" className="py-20 bg-white dark:bg-slate-800">
            <div className="container mx-auto px-6">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
                        {t('portfolio.testimonials.section_title')}
                    </h2>
                    <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                        {t('portfolio.testimonials.section_subtitle')}
                    </p>
                </motion.div>

                {/* Carousel Container */}
                <div className="relative max-w-4xl mx-auto">
                    {/* Navigation Buttons */}
                    <button
                        onClick={handlePrev}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 z-10 p-3 bg-white dark:bg-slate-700 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110"
                        aria-label="Previous testimonial"
                    >
                        <ChevronLeft size={24} className="text-slate-700 dark:text-slate-300" />
                    </button>

                    <button
                        onClick={handleNext}
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 z-10 p-3 bg-white dark:bg-slate-700 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110"
                        aria-label="Next testimonial"
                    >
                        <ChevronRight size={24} className="text-slate-700 dark:text-slate-300" />
                    </button>

                    {/* Testimonial Card */}
                    <div className="relative overflow-hidden min-h-[400px] flex items-center">
                        <AnimatePresence initial={false} custom={direction} mode="wait">
                            <motion.div
                                key={currentIndex}
                                custom={direction}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{
                                    x: { type: "spring", stiffness: 300, damping: 30 },
                                    opacity: { duration: 0.2 }
                                }}
                                className="w-full"
                            >
                                <div className="bg-gradient-to-br from-brand-emerald-50 to-brand-gold-50 dark:from-primary dark:to-primary-dark rounded-2xl p-8 md:p-12 shadow-2xl border border-white/50 dark:border-white/10 relative overflow-hidden">
                                    {/* Quote Icon */}
                                    <div className="flex justify-center mb-8">
                                        <div className="p-5 bg-primary rounded-2xl rotate-3 shadow-lg shadow-primary/20">
                                            <Quote size={32} className="text-white" />
                                        </div>
                                    </div>

                                    {/* Testimonial Text */}
                                    <p className="text-xl md:text-2xl text-slate-700 dark:text-slate-100 text-center mb-10 leading-relaxed italic font-medium">
                                        "{currentTestimonial.testimonial}"
                                    </p>

                                    {/* Client Info */}
                                    <div className="flex flex-col items-center">
                                        <div className="relative mb-4">
                                            <img
                                                src={currentTestimonial.avatar}
                                                alt={currentTestimonial.name}
                                                className="w-24 h-24 rounded-full border-4 border-white dark:border-slate-800 shadow-xl"
                                                loading="lazy"
                                            />
                                            <div className="absolute -bottom-2 -right-2 p-2 bg-accent rounded-full text-white shadow-lg">
                                                <Quote size={12} fill="currentColor" />
                                            </div>
                                        </div>
                                        <h4 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                                            {currentTestimonial.name}
                                        </h4>
                                        <p className="text-primary dark:text-brand-emerald-400 font-bold mb-4 uppercase tracking-widest text-sm">
                                            {currentTestimonial.project}
                                        </p>

                                        {/* Rating Stars */}
                                        <div className="flex gap-1.5 p-2 bg-white/50 dark:bg-black/20 rounded-full backdrop-blur-sm">
                                            {[...Array(currentTestimonial.rating)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    size={18}
                                                    className="text-accent fill-accent"
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Dots Indicator */}
                    <div className="flex justify-center gap-3 mt-12">
                        {testimonialsData.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => handleDotClick(index)}
                                className={`transition-all duration-300 ${index === currentIndex
                                    ? 'w-10 bg-primary'
                                    : 'w-3 bg-slate-300 dark:bg-slate-700 hover:bg-primary-light'
                                    } h-3 rounded-full`}
                                aria-label={`Go to testimonial ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ClientTestimonials;
