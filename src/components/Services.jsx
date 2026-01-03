import React from 'react';
import { motion } from 'framer-motion';
import { Building2, ShoppingBag, Globe, Layout, Smartphone, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Services = () => {
    const { t } = useTranslation();

    const services = [
        {
            icon: <Layout size={32} />,
            title: t('services.items.design.title'),
            description: t('services.items.design.desc'),
            color: 'bg-brand-emerald-100 dark:bg-primary-dark/30 text-primary dark:text-brand-emerald-400',
        },
        {
            icon: <Smartphone size={32} />,
            title: t('services.items.mobile.title'),
            description: t('services.items.mobile.desc'),
            color: 'bg-brand-emerald-100 dark:bg-primary-dark/30 text-primary dark:text-brand-emerald-400',
        },
        {
            icon: <Globe size={32} />,
            title: t('services.items.features.title'),
            description: t('services.items.features.desc'),
            color: 'bg-brand-gold-100 dark:bg-brand-gold-900/30 text-accent dark:text-accent-light',
        },
        {
            icon: <Building2 size={32} />,
            title: t('services.items.tech.title'),
            description: t('services.items.tech.desc'),
            color: 'bg-brand-emerald-100 dark:bg-primary-dark/30 text-primary dark:text-brand-emerald-400',
        },
        {
            icon: <Search size={32} />,
            title: t('services.items.seo.title'),
            description: t('services.items.seo.desc'),
            color: 'bg-brand-emerald-100 dark:bg-primary-dark/30 text-primary dark:text-brand-emerald-400',
        },
        {
            icon: <ShoppingBag size={32} />,
            title: t('services.items.support.title'),
            description: t('services.items.support.desc'),
            color: 'bg-brand-emerald-100 dark:bg-primary-dark/30 text-primary dark:text-brand-emerald-400',
        },
    ];

    const flowSteps = [
        { step: '01', title: t('services.flow.steps.consult.title'), desc: t('services.flow.steps.consult.desc') },
        { step: '02', title: t('services.flow.steps.deal.title'), desc: t('services.flow.steps.deal.desc') },
        { step: '03', title: t('services.flow.steps.work.title'), desc: t('services.flow.steps.work.desc') },
        { step: '04', title: t('services.flow.steps.done.title'), desc: t('services.flow.steps.done.desc') },
    ];

    return (
        <section id="services" className="py-20 bg-white dark:bg-slate-900 relative z-10">
            <div className="container mx-auto px-6">
                {/* Services Grid */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-4">{t('services.title')}</h2>
                    <p className="text-slate-600 dark:text-slate-300 text-lg">
                        {t('services.subtitle')}
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
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">{t('services.flow.title')}</h2>
                        <p className="text-slate-600 dark:text-slate-300">
                            {t('services.flow.subtitle')}
                        </p>
                    </div>

                    <div className="grid md:grid-cols-4 gap-8 relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-slate-200 dark:bg-slate-700 -z-10" />

                        {flowSteps.map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.2 }}
                                className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm text-center relative"
                            >
                                <div className="w-12 h-12 mx-auto bg-primary text-white rounded-full flex items-center justify-center font-bold text-lg mb-4 shadow-lg shadow-primary/30">
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
