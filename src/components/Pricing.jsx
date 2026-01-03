import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Pricing = () => {
    const { t } = useTranslation();

    const plans = [
        {
            name: t('pricing.plans.starter.name'),
            price: t('pricing.plans.starter.price'),
            description: t('pricing.plans.starter.desc'),
            features: t('pricing.plans.starter.features', { returnObjects: true }),
            recommended: false,
            isStarter: true
        },
        {
            name: t('pricing.plans.custom.name'),
            price: t('pricing.plans.custom.price'),
            description: t('pricing.plans.custom.desc'),
            features: t('pricing.plans.custom.features', { returnObjects: true }),
            recommended: true,
            isStarter: false
        },
        {
            name: t('pricing.plans.umkm.name'),
            price: t('pricing.plans.umkm.price'),
            description: t('pricing.plans.umkm.desc'),
            features: t('pricing.plans.umkm.features', { returnObjects: true }),
            recommended: false,
            isStarter: true
        },
    ];

    return (
        <section id="pricing" className="py-20 bg-slate-50 dark:bg-slate-800">
            <div className="container mx-auto px-6">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-4">{t('pricing.title')}</h2>
                    <p className="text-slate-600 dark:text-slate-300 text-lg">
                        {t('pricing.subtitle')}
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
                                    {t('pricing.bestseller')}
                                </div>
                            )}

                            <div className="p-8 flex-grow">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{plan.name}</h3>
                                <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">{plan.description}</p>
                                <div className="mb-6">
                                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">
                                        {plan.isStarter ? t('pricing.labels.starting_from') : t('pricing.labels.price')}
                                    </p>
                                    <div className="flex items-baseline">
                                        {plan.isStarter && <span className="text-sm text-slate-500 dark:text-slate-400 font-semibold">{t('pricing.labels.rp')}</span>}
                                        <span className="text-4xl font-bold text-slate-900 dark:text-white mx-1">{plan.price}</span>
                                    </div>
                                </div>

                                <ul className="space-y-4 mb-8">
                                    {Array.isArray(plan.features) && plan.features.map((feature, idx) => (
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
                                    {t('pricing.cta')}
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
