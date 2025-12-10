import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const PortfolioCTA = () => {
    // Template pesan WhatsApp
    const whatsappMessage = `Halo WebKuu! 👋

Saya ingin konsultasi tentang pembuatan website.

📋 *Informasi Awal:*
• Jenis Website: [Isi jenis website yang diinginkan]
• Budget: [Isi budget yang tersedia]
• Deadline: [Isi deadline yang diharapkan]

Saya tertarik untuk mengetahui lebih lanjut tentang layanan pembuatan website custom dari WebKuu.

Terima kasih! 🙏`;

    const encodedMessage = encodeURIComponent(whatsappMessage);

    return (
        <section className="py-20 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 dark:from-blue-800 dark:via-indigo-900 dark:to-purple-900 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 180, 360],
                        opacity: [0.2, 0.3, 0.2],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"
                />
                <motion.div
                    animate={{
                        scale: [1.2, 1, 1.2],
                        rotate: [360, 180, 0],
                        opacity: [0.2, 0.3, 0.2],
                    }}
                    transition={{
                        duration: 15,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="absolute bottom-0 right-0 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl"
                />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center max-w-4xl mx-auto"
                >
                    {/* Icon */}
                    <motion.div
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                        className="flex justify-center mb-6"
                    >
                        <div className="p-4 bg-white/20 backdrop-blur-sm rounded-full">
                            <Sparkles size={48} className="text-white" />
                        </div>
                    </motion.div>

                    {/* Heading */}
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.15, duration: 0.5 }}
                        className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
                    >
                        Ingin Website Custom Seperti Ini?
                    </motion.h2>

                    {/* Subtitle */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="text-xl md:text-2xl text-blue-100 mb-12 leading-relaxed"
                    >
                        Harga mulai dari <span className="font-bold text-yellow-300">100 ribu</span> dan bisa request sesuai kebutuhan bisnis kamu.
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.25, duration: 0.5 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                    >
                        {/* Order Button */}
                        <Link to="/order">
                            <motion.button
                                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }}
                                whileTap={{ scale: 0.95 }}
                                className="px-8 py-4 bg-white text-blue-600 font-bold text-lg rounded-full shadow-2xl hover:shadow-white/20 transition-all flex items-center gap-2"
                            >
                                <Sparkles size={24} />
                                Order Sekarang
                            </motion.button>
                        </Link>

                        {/* Chat Admin Button */}
                        <motion.a
                            href={`https://wa.me/6285122959690?text=${encodedMessage}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }}
                            whileTap={{ scale: 0.95 }}
                            className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-bold text-lg rounded-full shadow-2xl transition-all flex items-center gap-2"
                        >
                            <MessageCircle size={24} />
                            Chat Admin
                        </motion.a>
                    </motion.div>

                    {/* Additional Info */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className="mt-12 flex flex-wrap justify-center gap-8 text-white/90"
                    >
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                            <span>Konsultasi Gratis</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                            <span>Revisi Unlimited</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                            <span>Support 24/7</span>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default PortfolioCTA;
