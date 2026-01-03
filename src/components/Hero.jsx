import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Star, Award, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
    return (
        <section id="home" className="relative pt-20 pb-12 lg:pt-28 lg:pb-16 overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 right-0 -z-10 w-1/2 h-full bg-gradient-to-bl from-blue-50 dark:from-blue-950/30 to-transparent rounded-bl-[100px]" />
            <div className="absolute bottom-0 left-0 -z-10 w-1/3 h-1/2 bg-gradient-to-tr from-indigo-50 dark:from-indigo-950/30 to-transparent rounded-tr-[100px]" />

            <div className="container mx-auto px-6">
                <div className="flex flex-col lg:flex-row items-center gap-12">

                    {/* Text Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="lg:w-1/2 text-center lg:text-left flex flex-col items-center lg:items-start"
                    >
                        <div className="inline-flex items-center px-4 py-2 bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 rounded-full text-sm font-semibold mb-6">
                            <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                            Jasa Pembuatan Website Profesional
                        </div>
                        <h1 className="text-4xl lg:text-6xl font-bold text-slate-900 dark:text-white leading-tight mb-6">
                            Website <span className="text-blue-600 dark:text-blue-400">Premium</span> Untuk Bisnis Anda
                        </h1>
                        <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 leading-relaxed max-w-xl lg:max-w-none">
                            Kami menciptakan website modern yang tidak hanya cantik, tapi juga fungsional dan dikerjakan secara profesional untuk meningkatkan kredibilitas bisnis Anda.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 mb-10 w-full sm:w-auto">
                            <Link
                                to="/portfolio"
                                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full shadow-lg hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-2"
                            >
                                Lihat Portofolio <ArrowRight size={20} />
                            </Link>
                            <a
                                href="#pricing"
                                className="px-8 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-200 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold rounded-full transition-all flex items-center justify-center"
                            >
                                Paket Harga
                            </a>
                        </div>

                        {/* Quick Professional Stats */}
                        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 lg:gap-10 border-t border-slate-100 dark:border-slate-800 pt-8 w-full">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg text-yellow-600 dark:text-yellow-400">
                                    <Star size={20} fill="currentColor" />
                                </div>
                                <div className="text-left">
                                    <p className="text-xl font-bold text-slate-900 dark:text-white">5.0</p>
                                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Rating Bintang</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                                    <Award size={20} />
                                </div>
                                <div className="text-left">
                                    <p className="text-xl font-bold text-slate-900 dark:text-white">50+</p>
                                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Project Selesai</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-600 dark:text-green-400">
                                    <Zap size={20} fill="currentColor" />
                                </div>
                                <div className="text-left">
                                    <p className="text-xl font-bold text-slate-900 dark:text-white">24/7</p>
                                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Fast Response</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Image/Illustration */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="lg:w-1/2 relative"
                    >
                        <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-4 border border-slate-100 transform rotate-2 hover:rotate-0 transition-transform duration-500">
                            <img
                                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                                alt="Website Dashboard"
                                className="rounded-xl w-full h-auto"
                                loading="lazy"
                            />

                            {/* Floating Badge */}
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ repeat: Infinity, duration: 3 }}
                                className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-xl border border-slate-100 flex items-center gap-3"
                            >
                                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold">
                                    98%
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500">Kepuasan Klien</p>
                                    <p className="font-bold text-slate-800">Sangat Puas</p>
                                </div>
                            </motion.div>
                        </div>

                        {/* Decorative Blobs */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-100/50 rounded-full blur-3xl -z-10" />
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Hero;

