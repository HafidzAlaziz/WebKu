import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';

const Pricing = () => {
    const plans = [
        {
            name: 'Starter / Landing Page',
            price: '100rb',
            description: 'Solusi hemat untuk landing page sederhana atau profil usaha.',
            features: [
                '1 Halaman Website',
                'Desain Rapih & Modern',
                'Mobile Responsive',
                'Tombol ke WhatsApp/Sosmed',
                'Pengerjaan Cepat (24 Jam)',
                'Gratis Hosting (Subdomain)',
            ],
            recommended: false,
        },
        {
            name: 'Enterprise / Full Custom',
            price: 'Diskusi',
            description: 'Harga menyesuaikan fitur dan tingkat kesulitan website.',
            features: [
                'Fitur Sesuai Request & Budget',
                'Konsultasi Teknis Mendalam',
                'Prioritas Support & Garansi',
            ],
            recommended: true,
        },
        {
            name: 'Professional / UMKM',
            price: '1 Juta',
            description: 'Website bisnis profesional untuk meningkatkan kredibilitas.',
            features: [
                'Desain Eksklusif (Bukan Template)',
                'Hingga 5 Halaman (Home, About, dll)',
                'Gratis Domain .com (1 Tahun)',
                'Optimasi SEO Dasar (Google)',
                'Integrasi Maps & Form Kontak',
                'Revisi Desain 3x',
                'Gratis Maintenance 1 Bulan',
            ],
            recommended: false,
        },
    ];

    return (
        <section id="pricing" className="py-20 bg-slate-50 dark:bg-slate-800">
            <div className="container mx-auto px-6">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-4">Pilihan Paket Harga</h2>
                    <p className="text-slate-600 dark:text-slate-300 text-lg">
                        Transparan, tanpa biaya tersembunyi. Pilih paket yang sesuai dengan budget Anda.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className={`relative bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden border ${plan.recommended ? 'border-primary ring-4 ring-primary/10' : 'border-slate-100 dark:border-slate-700'
                                } flex flex-col`}
                        >
                            {plan.recommended && (
                                <div className="absolute top-0 right-0 bg-accent text-white text-xs font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">
                                    Terlaris
                                </div>
                            )}

                            <div className="p-8 flex-grow">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{plan.name}</h3>
                                <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">{plan.description}</p>
                                <div className="mb-6">
                                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">
                                        {(plan.price === '100rb' || plan.price === '1 Juta') ? 'Mulai dari' : 'Harga'}
                                    </p>
                                    <div className="flex items-baseline">
                                        {(plan.price === '100rb' || plan.price === '1 Juta') && <span className="text-sm text-slate-500 dark:text-slate-400 font-semibold">Rp</span>}
                                        <span className="text-4xl font-bold text-slate-900 dark:text-white mx-1">{plan.price}</span>
                                    </div>
                                </div>

                                <ul className="space-y-4 mb-8">
                                    {plan.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-start gap-3 text-slate-600 dark:text-slate-300 text-sm">
                                            <Check size={18} className="text-accent flex-shrink-0 mt-0.5" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="p-8 pt-0 mt-auto">
                                <Link
                                    to="/order"
                                    className={`block w-full py-4 text-center rounded-xl font-semibold transition-all ${plan.recommended
                                        ? 'bg-primary hover:bg-primary-light text-white shadow-lg hover:shadow-primary/30'
                                        : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                                        }`}
                                >
                                    Pesan Paket Ini
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Pricing;
