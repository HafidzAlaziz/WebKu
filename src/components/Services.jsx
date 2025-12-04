import React from 'react';
import { motion } from 'framer-motion';
import { Building2, ShoppingBag, Globe, Layout, Smartphone, Search } from 'lucide-react';

const services = [
    {
        icon: <Layout size={32} />,
        title: 'Full Custom Design',
        description: 'Desain website unik sesuai brand identity Anda, bukan template pasaran.',
        color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    },
    {
        icon: <Smartphone size={32} />,
        title: 'Mobile Friendly',
        description: 'Tampilan responsif yang sempurna di semua perangkat (HP, Tablet, Desktop).',
        color: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
    },
    {
        icon: <Globe size={32} />,
        title: 'Bebas Request Fitur',
        description: 'Butuh fitur khusus? Kami buatkan sesuai permintaan (Booking, Payment, dll).',
        color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
    },
    {
        icon: <Building2 size={32} />,
        title: 'Modern Tech Stack',
        description: 'Dibuat dengan teknologi terbaru: React, Next.js, Tailwind, Node.js, dll.',
        color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
    },
    {
        icon: <Search size={32} />,
        title: 'SEO Optimized',
        description: 'Struktur kode yang rapi dan cepat, disukai oleh mesin pencari Google.',
        color: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
    },
    {
        icon: <ShoppingBag size={32} />,
        title: 'Support & Maintenance',
        description: 'Kami tidak lari setelah project selesai. Support penuh jika ada kendala.',
        color: 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400',
    },
];

const Services = () => {
    return (
        <section id="services" className="py-20 bg-white dark:bg-slate-900">
            <div className="container mx-auto px-6">
                {/* Services Grid */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-4">Kenapa Memilih Jasa Kami?</h2>
                    <p className="text-slate-600 dark:text-slate-300 text-lg">
                        Solusi website custom terbaik untuk UMKM, Personal, hingga Perusahaan.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
                    {services.map((service, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -10 }}
                            className="p-8 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800 shadow-lg hover:shadow-xl transition-all duration-300 group"
                        >
                            <div className={`w-16 h-16 rounded-xl flex items-center justify-center mb-6 ${service.color} group-hover:scale-110 transition-transform duration-300`}>
                                {service.icon}
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{service.title}</h3>
                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                                {service.description}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* Alur Pemesanan */}
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Alur Pemesanan Mudah</h2>
                        <p className="text-slate-600 dark:text-slate-300">
                            4 Langkah mudah memiliki website impian Anda.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-4 gap-8 relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-slate-200 dark:bg-slate-700 -z-10" />

                        {[
                            { step: '01', title: 'Konsultasi', desc: 'Hubungi kami & diskusikan kebutuhan website Anda.' },
                            { step: '02', title: 'Deal Harga', desc: 'Sepakati fitur dan harga yang sesuai budget.' },
                            { step: '03', title: 'Pengerjaan', desc: 'Kami kerjakan website Anda dengan cepat & rapi.' },
                            { step: '04', title: 'Website Jadi', desc: 'Review, revisi (jika ada), dan website siap online!' },
                        ].map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.2 }}
                                className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm text-center relative"
                            >
                                <div className="w-12 h-12 mx-auto bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg mb-4 shadow-lg shadow-blue-500/30">
                                    {item.step}
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                    {item.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Services;
