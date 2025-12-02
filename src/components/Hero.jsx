import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle } from 'lucide-react';

const Hero = () => {
    return (
        <section id="home" className="relative pt-24 pb-20 lg:pt-28 lg:pb-32 overflow-hidden">
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
                        className="lg:w-1/2"
                    >
                        <div className="inline-flex items-center px-4 py-2 bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 rounded-full text-sm font-semibold mb-6">
                            <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                            Jasa Pembuatan Website Terpercaya
                        </div>
                        <h1 className="text-4xl lg:text-6xl font-bold text-slate-900 dark:text-white leading-tight mb-6">
                            Jasa Pembuatan Website <span className="text-blue-600 dark:text-blue-400">Profesional & Cepat</span>
                        </h1>
                        <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
                            Tingkatkan kredibilitas bisnis Anda dengan website modern, responsif, dan SEO-friendly. Kami membantu Anda menjangkau lebih banyak pelanggan secara online.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <a
                                href="#order"
                                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full shadow-lg hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-2"
                            >
                                Buat Website Sekarang <ArrowRight size={20} />
                            </a>
                            <a
                                href="#pricing"
                                className="px-8 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-200 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold rounded-full transition-all flex items-center justify-center"
                            >
                                Lihat Paket Harga
                            </a>
                        </div>

                        <div className="mt-10 flex items-center gap-6 text-sm text-slate-500">
                            <div className="flex items-center gap-2">
                                <CheckCircle size={18} className="text-green-500" />
                                <span>Gratis Domain</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle size={18} className="text-green-500" />
                                <span>Hosting Cepat</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle size={18} className="text-green-500" />
                                <span>Support 24/7</span>
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
