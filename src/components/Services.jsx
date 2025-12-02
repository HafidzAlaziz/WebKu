import React from 'react';
import { motion } from 'framer-motion';
import { Building2, ShoppingBag, Globe, Layout, Smartphone, Search } from 'lucide-react';

const services = [
    {
        icon: <Building2 size={32} />,
        title: 'Website Company Profile',
        description: 'Tampilkan profesionalitas perusahaan Anda dengan desain elegan dan informatif.',
        color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    },
    {
        icon: <ShoppingBag size={32} />,
        title: 'Toko Online (E-commerce)',
        description: 'Jual produk Anda secara online dengan fitur keranjang, checkout, dan pembayaran otomatis.',
        color: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
    },
    {
        icon: <Layout size={32} />,
        title: 'Landing Page',
        description: 'Halaman khusus untuk promosi produk atau jasa dengan konversi tinggi.',
        color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
    },
    {
        icon: <Smartphone size={32} />,
        title: 'Website UMKM',
        description: 'Solusi hemat biaya untuk UMKM yang ingin Go Digital dengan cepat.',
        color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
    },
    {
        icon: <Globe size={32} />,
        title: 'Web Portal Berita',
        description: 'Website untuk media online dengan manajemen konten yang mudah.',
        color: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
    },
    {
        icon: <Search size={32} />,
        title: 'SEO Optimization',
        description: 'Optimasi agar website Anda mudah ditemukan di halaman pertama Google.',
        color: 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400',
    },
];

const Services = () => {
    return (
        <section id="services" className="py-20 bg-white dark:bg-slate-900">
            <div className="container mx-auto px-6">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-4">Layanan Kami</h2>
                    <p className="text-slate-600 dark:text-slate-300 text-lg">
                        Kami menyediakan berbagai jenis layanan pembuatan website sesuai dengan kebutuhan bisnis Anda.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
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
            </div>
        </section>
    );
};

export default Services;
