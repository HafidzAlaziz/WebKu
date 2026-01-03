import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const CTA = () => {
    const { t } = useTranslation();

    // WhatsApp message template from translation
    const whatsappMessage = t('cta.whatsapp_template');
    const encodedMessage = encodeURIComponent(whatsappMessage);

    return (
        <section id="order" className="py-20 bg-primary relative z-10 overflow-hidden">
            {/* Background Patterns */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
                <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-brand-gold-100 blur-3xl" />
                <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-brand-emerald-100 blur-3xl" />
            </div>

            <div className="container mx-auto px-6 relative z-10 text-center">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">
                        {t('cta.title')}
                    </h2>
                    <p className="text-brand-emerald-50 text-lg lg:text-xl max-w-2xl mx-auto mb-10">
                        {t('cta.subtitle')}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link to="/order">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="inline-flex items-center gap-3 px-8 py-4 bg-white hover:bg-slate-50 text-primary font-bold text-lg rounded-full shadow-lg hover:shadow-xl transition-all"
                            >
                                <ShoppingCart size={24} />
                                {t('cta.buttons.order')}
                            </motion.button>
                        </Link>

                        <motion.a
                            href={`https://wa.me/6285122959690?text=${encodedMessage}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="inline-flex items-center gap-3 px-8 py-4 bg-green-500 hover:bg-green-600 text-white font-bold text-lg rounded-full shadow-lg hover:shadow-green-500/30 transition-all"
                        >
                            <MessageCircle size={24} />
                            {t('cta.buttons.whatsapp')}
                        </motion.a>
                    </div>

                    <p className="mt-6 text-brand-emerald-200 text-sm">
                        {t('cta.footer')}
                    </p>
                </motion.div>
            </div>
        </section>
    );
};

export default CTA;
