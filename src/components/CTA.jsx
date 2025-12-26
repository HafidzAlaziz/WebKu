import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';

const CTA = () => {
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
        <section id="order" className="py-20 bg-blue-600 relative z-10 overflow-hidden">
            {/* Background Patterns */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
                <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white blur-3xl" />
                <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-white blur-3xl" />
            </div>

            <div className="container mx-auto px-6 relative z-10 text-center">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">
                        Siap Mewujudkan Website Impian Anda?
                    </h2>
                    <p className="text-blue-100 text-lg lg:text-xl max-w-2xl mx-auto mb-10">
                        Jangan tunda lagi! Konsultasikan kebutuhan website Anda sekarang juga. Selengkapnya bisa order langsung di website ini.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link to="/order">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="inline-flex items-center gap-3 px-8 py-4 bg-white hover:bg-slate-50 text-blue-600 font-bold text-lg rounded-full shadow-lg hover:shadow-xl transition-all"
                            >
                                <ShoppingCart size={24} />
                                Order Sekarang!!!
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
                            Konsultasi via WhatsApp
                        </motion.a>
                    </div>

                    <p className="mt-6 text-blue-200 text-sm">
                        Respon Cepat 24/7 • Konsultasi Gratis
                    </p>
                </motion.div>
            </div>
        </section>
    );
};

export default CTA;
