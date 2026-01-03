import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const testimonials = [
    {
        id: 1,
        name: 'Budi Santoso',
        role: 'CEO PT Maju Jaya',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        content: 'Saya request fitur custom untuk sistem internal perusahaan, hasilnya sangat memuaskan! Tim developer sangat paham teknis dan solutif.',
    },
    {
        id: 2,
        name: 'Siti Aminah',
        role: 'Owner Batik Cantik',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        content: 'Awalnya ragu karena harganya terjangkau, ternyata hasilnya premium banget. Website toko online saya jadi terlihat sangat profesional.',
    },
    {
        id: 3,
        name: 'Rizky Pratama',
        role: 'Founder Startup Tech',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        content: 'Tech stack yang digunakan modern (Next.js), performa website jadi sangat cepat. Revisi juga dilayani dengan sabar sampai benar-benar pas.',
    },
    {
        id: 4,
        name: 'Dewi Lestari',
        role: 'Marketing Manager',
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        content: 'Layanan konsultasinya sangat membantu. Saya yang awam IT jadi paham website seperti apa yang cocok untuk bisnis saya. Recommended!',
    },
];

const Testimonials = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            nextSlide();
        }, 3000);
        return () => clearInterval(timer);
    }, [currentIndex]);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    const getInitials = (name) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };

    return (
        <section id="testimonials" className="py-20 bg-slate-50 dark:bg-slate-800 relative z-10 overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-4">Apa Kata Mereka?</h2>
                    <p className="text-slate-600 dark:text-slate-300 text-lg">
                        Kepuasan klien adalah prioritas utama kami.
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
                                    {getInitials(testimonials[currentIndex].name)}
                                </div>
                                <div>
                                    <p className="text-xl text-slate-700 dark:text-slate-300 italic mb-6 leading-relaxed">
                                        "{testimonials[currentIndex].content}"
                                    </p>
                                    <div>
                                        <h4 className="text-lg font-bold text-slate-900 dark:text-white">{testimonials[currentIndex].name}</h4>
                                        <p className="text-primary dark:text-brand-emerald-400 font-medium">{testimonials[currentIndex].role}</p>
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
