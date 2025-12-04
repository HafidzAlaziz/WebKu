import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const Pricing = () => {
    const plans = [
        {
            name: 'Paket Hemat',
            price: '100rb',
            description: 'Cocok untuk landing page sederhana, undangan digital, atau bio link.',
            features: [
                '1 Halaman Landing Page',
                'Desain Template Premium',
                'Mobile Responsive',
                'Gratis Konsultasi',
                'Revisi Sepuasnya',
            ],
            recommended: false,
        },
        {
            name: 'Custom / UMKM',
            price: 'Fleksibel',
            description: 'Paling laris! Website custom sesuai kebutuhan bisnis Anda.',
            features: [
                'Desain Custom (Bisa Request)',
                'Halaman Sesuai Kebutuhan',
                'Fitur Bebas Request',
                'Gratis Domain & Hosting',
                'Support & Maintenance',
                'Gratis Revisi Sepuasnya',
                'Tech Stack Bebas (React/Next.js/dll)',
            ],
            recommended: true,
        },
        {
            name: 'Full Custom',
            price: 'Diskusi',
            description: 'Solusi kompleks untuk perusahaan, startup, atau toko online besar.',
            features: [
                'Unlimited Pages',
                'Sistem Kompleks (Backend+DB)',
                'Payment Gateway',
                'Dashboard Admin Custom',
                'Prioritas Support 24/7',
                'Dokumentasi Lengkap',
                'Garansi Error Selamanya',
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
                            className={`relative bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden border ${plan.recommended ? 'border-blue-500 ring-4 ring-blue-500/20' : 'border-slate-100 dark:border-slate-700'
                                } flex flex-col`}
                        >
                            {plan.recommended && (
                                <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">
                                    Terlaris
                                </div>
                            )}

                            <div className="p-8 flex-grow">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{plan.name}</h3>
                                <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">{plan.description}</p>
                                <div className="mb-6">
                                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">
                                        {plan.price === '100rb' ? 'Mulai dari' : 'Harga'}
                                    </p>
                                    <div className="flex items-baseline">
                                        {plan.price === '100rb' && <span className="text-sm text-slate-500 dark:text-slate-400 font-semibold">Rp</span>}
                                        <span className="text-4xl font-bold text-slate-900 dark:text-white mx-1">{plan.price}</span>
                                    </div>
                                </div>

                                <ul className="space-y-4 mb-8">
                                    {plan.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-start gap-3 text-slate-600 dark:text-slate-300 text-sm">
                                            <Check size={18} className="text-green-500 flex-shrink-0 mt-0.5" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="p-8 pt-0 mt-auto">
                                <a
                                    href={`https://wa.me/6281234567890?text=Halo, saya tertarik dengan paket website ${plan.name}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`block w-full py-4 text-center rounded-xl font-semibold transition-all ${plan.recommended
                                        ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-blue-500/30'
                                        : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                                        }`}
                                >
                                    Pesan Paket Ini
                                </a>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Pricing;
