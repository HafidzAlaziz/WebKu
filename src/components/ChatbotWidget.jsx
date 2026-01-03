import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send } from 'lucide-react';

const ChatbotWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [showBubble, setShowBubble] = useState(true);
    const [isBlinking, setIsBlinking] = useState(false);
    const [messages, setMessages] = useState([
        {
            type: 'bot',
            text: 'Halo! 👋 Saya RoboBot, asisten virtual WebKuu. Ada yang bisa saya bantu tentang layanan Website Custom kami?',
            timestamp: new Date(),
        }
    ]);
    const [inputText, setInputText] = useState('');

    // Blinking animation
    useEffect(() => {
        const blinkInterval = setInterval(() => {
            setIsBlinking(true);
            setTimeout(() => setIsBlinking(false), 200);
        }, 3000);
        return () => clearInterval(blinkInterval);
    }, []);

    // Hide bubble after some time
    useEffect(() => {
        const timer = setTimeout(() => setShowBubble(false), 10000);
        return () => clearTimeout(timer);
    }, []);

    // FAQ Database
    const faqDatabase = [
        {
            keywords: ['halo', 'hai', 'hello', 'hi', 'pagi', 'siang', 'sore', 'malam'],
            response: 'Halo! 👋 Senang bertemu dengan Anda! Saya RoboBot, asisten virtual WebKuu yang siap membantu Anda.\n\nAda yang ingin Anda tanyakan tentang layanan website kami? Saya bisa bantu jelaskan tentang harga, fitur, proses pembuatan, atau apapun yang Anda butuhkan! 😊'
        },
        {
            keywords: ['apa itu', 'website custom', 'custom website', 'pengertian', 'jelaskan'],
            response: 'Website Custom adalah layanan pembuatan website yang dibuat khusus sesuai kebutuhan Anda. Bukan template! 🎨\n\nKeuntungannya:\n✨ Desain unik sesuai brand Anda\n✨ Fitur yang Anda mau, bukan yang sudah jadi\n✨ Teknologi modern dan terkini\n✨ Lebih fleksibel untuk dikembangkan\n\nJadi website Anda benar-benar mencerminkan bisnis Anda, bukan copy-paste dari orang lain! 💪'
        },
        {
            keywords: ['harga', 'biaya', 'berapa', 'tarif', 'price', 'mahal'],
            response: 'Harga layanan kami sangat terjangkau dan fleksibel! 💰\n\n📌 Paket Hemat: Mulai Rp 100.000\n   → Landing page sederhana\n   → Cocok untuk portfolio atau promosi\n\n📌 Custom/UMKM: Harga Fleksibel\n   → Sesuai fitur yang Anda butuhkan\n   → Desain custom 100%\n\n📌 Full Custom: Harga Diskusi\n   → Sistem kompleks dengan database\n   → Backend + Admin panel\n\nHarga final tergantung fitur yang Anda mau. Konsultasi gratis dulu yuk, kita diskusikan kebutuhan Anda! 😊'
        },
        {
            keywords: ['fitur', 'request', 'bisa', 'dapat', 'tersedia', 'ada'],
            response: 'Anda bisa request berbagai fitur sesuai kebutuhan! 🚀\n\n✅ Desain custom 100% (sesuai brand Anda)\n✅ Sistem booking/reservasi online\n✅ Payment gateway (terima pembayaran online)\n✅ Dashboard admin (kelola konten sendiri)\n✅ Integrasi API (Google Maps, sosmed, dll)\n✅ E-commerce lengkap (toko online)\n✅ Multi-bahasa\n✅ SEO optimization\n✅ Dan masih banyak lagi!\n\nPunya ide fitur tertentu? Ceritakan aja, kami bantu wujudkan! 💡'
        },
        {
            keywords: ['lama', 'pengerjaan', 'waktu', 'berapa lama', 'durasi', 'cepat'],
            response: 'Kami kerja cepat tapi tetap berkualitas! ⚡\n\n⏱️ Landing Page Sederhana: 3-5 hari kerja\n⏱️ Website UMKM/Company Profile: 5-7 hari kerja\n⏱️ Toko Online/E-commerce: 1-2 minggu\n⏱️ Sistem Kompleks (Custom): 2-4 minggu\n\nWaktu bisa lebih cepat atau lambat tergantung:\n• Kompleksitas fitur yang diminta\n• Kecepatan feedback dari Anda\n• Ketersediaan konten (teks, gambar, dll)\n\nYang pasti, kami selalu prioritaskan kualitas! 🎯'
        },
        {
            keywords: ['teknologi', 'tech stack', 'react', 'next', 'framework', 'bahasa'],
            response: 'Kami pakai teknologi modern dan terkini! 💻\n\n🔧 Frontend:\n   • React.js + Tailwind CSS\n   • Next.js (untuk SEO maksimal)\n   • Vue.js (jika diminta)\n\n🔧 Backend:\n   • Node.js + Express\n   • Laravel + PHP\n   • Python Django/Flask\n\n🔧 CMS:\n   • WordPress (jika Anda prefer)\n   • Custom CMS\n\n🔧 Database:\n   • MySQL, PostgreSQL, MongoDB\n\nAnda juga bisa request tech stack tertentu sesuai kebutuhan! Kami fleksibel kok! 😊'
        },
        {
            keywords: ['order', 'pesan', 'cara', 'bagaimana', 'proses', 'mulai'],
            response: 'Cara order sangat mudah dan simple! 📝\n\n1️⃣ Konsultasi Gratis\n   → Hubungi kami via WhatsApp/Email\n   → Ceritakan kebutuhan website Anda\n\n2️⃣ Diskusi & Penawaran\n   → Kami bantu tentukan fitur yang tepat\n   → Sepakati harga dan timeline\n\n3️⃣ Pengerjaan\n   → Kami mulai kerjakan website Anda\n   → Update progress secara berkala\n\n4️⃣ Review & Revisi\n   → Anda cek hasilnya\n   → Revisi GRATIS sampai puas!\n\n5️⃣ Launching! 🎉\n   → Website siap online\n   → Dapat support selamanya\n\nMau mulai? Hubungi kami sekarang! 📱'
        },
        {
            keywords: ['paket', 'pilihan', 'tersedia', 'rekomendasi'],
            response: 'Kami punya 3 paket yang bisa disesuaikan! 📦\n\n💼 Paket Hemat (Mulai Rp 100rb)\n   • Landing page 1-3 halaman\n   • Desain modern & responsive\n   • Cocok untuk: Portfolio, promosi produk\n\n🏢 Custom/UMKM (Harga Fleksibel)\n   • Desain custom sesuai brand\n   • Fitur sesuai kebutuhan\n   • Cocok untuk: Company profile, UMKM\n\n🚀 Full Custom (Harga Diskusi)\n   • Sistem kompleks + database\n   • Backend & admin panel\n   • Cocok untuk: E-commerce, booking system\n\nBingung pilih yang mana? Konsultasi gratis aja, kami bantu tentukan yang paling cocok! 😊'
        },
        {
            keywords: ['revisi', 'gratis', 'garansi', 'support', 'maintenance'],
            response: 'Kami berikan jaminan terbaik untuk Anda! 🌟\n\n✅ Revisi GRATIS sampai puas\n   → Tidak ada batasan jumlah revisi\n   → Sampai Anda benar-benar puas!\n\n✅ Garansi Bug Fix\n   → Gratis perbaikan jika ada error\n   → Berlaku selamanya\n\n✅ Support Selamanya\n   → Konsultasi gratis kapanpun\n   → Bantuan teknis jika ada masalah\n\n✅ Update Konten\n   → Kami ajari cara update sendiri\n   → Atau bisa request ke kami (gratis!)\n\nKepuasan dan kesuksesan Anda adalah prioritas kami! 💪'
        },
        {
            keywords: ['kontak', 'hubungi', 'whatsapp', 'contact', 'email', 'telepon'],
            response: 'Yuk hubungi kami sekarang! 📞\n\n📱 WhatsApp: +62 851 2295 9690\n   → Chat langsung dengan tim kami\n   → Konsultasi gratis!\n\n📧 Email: web.kuu@gmail.com\n   → Untuk pertanyaan detail\n   → Kirim brief project Anda\n\n🌐 Website: Anda sedang di sini! 😊\n\n⏰ Jam Operasional:\n   → Siap melayani 24/7 (24 jam setiap hari)\n   → Fast response!\n\nKami siap membantu Anda kapan saja! 💬'
        },
        {
            keywords: ['portfolio', 'contoh', 'hasil', 'karya', 'project'],
            response: 'Kami sudah banyak mengerjakan berbagai project! 🎨\n\nAnda bisa lihat portfolio kami di halaman Portfolio website ini. Ada berbagai jenis website yang sudah kami buat:\n\n✨ Company Profile\n✨ Toko Online\n✨ Landing Page\n✨ Website UMKM\n✨ Sistem Booking\n✨ Dan masih banyak lagi!\n\nSetiap project dikerjakan dengan detail dan sesuai kebutuhan klien. Mau lihat? Klik menu Portfolio di atas! 👆'
        },
        {
            keywords: ['terima kasih', 'thanks', 'makasih', 'ok', 'oke', 'siap'],
            response: 'Sama-sama! 😊🙏\n\nSenang bisa membantu Anda! Kalau ada pertanyaan lain, jangan ragu untuk tanya ya.\n\nKalau sudah siap untuk mulai project, langsung hubungi kami via WhatsApp atau email. Kami tunggu kabar baiknya! 💙\n\nSemoga harimu menyenangkan! ✨'
        },
        {
            keywords: ['responsive', 'mobile', 'hp', 'handphone', 'tablet'],
            response: 'Semua website yang kami buat PASTI mobile-friendly! 📱💻\n\n✅ Responsive Design\n   → Tampil sempurna di semua device\n   → HP, tablet, laptop, desktop\n\n✅ Fast Loading\n   → Optimasi kecepatan maksimal\n   → User experience terbaik\n\n✅ Touch-Friendly\n   → Tombol dan menu mudah diklik\n   → Navigasi smooth di touchscreen\n\nDi era sekarang, 70% pengunjung dari mobile. Jadi responsive design itu WAJIB! 🎯'
        },
        {
            keywords: ['seo', 'google', 'ranking', 'optimasi', 'pencarian'],
            response: 'SEO adalah salah satu fokus utama kami! 🔍\n\n✅ SEO-Friendly Structure\n   → Kode yang clean dan terstruktur\n   → Meta tags yang optimal\n\n✅ Fast Loading Speed\n   → Google suka website cepat\n   → Kami optimasi maksimal\n\n✅ Mobile Optimization\n   → Google prioritaskan mobile-first\n   → Website kami pasti responsive\n\n✅ Content Optimization\n   → Heading structure yang benar\n   → Alt text untuk gambar\n\n✅ Sitemap & Analytics\n   → Submit ke Google Search Console\n   → Tracking dengan Google Analytics\n\nWebsite bagus tapi gak keliatan di Google = percuma! Makanya kami pastikan website Anda SEO-friendly! 📈'
        }
    ];

    const quickActions = [
        { text: '💰 Lihat Harga', query: 'harga' },
        { text: '🚀 Cara Order', query: 'cara order' },
        { text: '⚡ Fitur Apa Saja?', query: 'fitur' },
        { text: '📞 Kontak', query: 'kontak' },
    ];

    const findResponse = (userInput) => {
        const input = userInput.toLowerCase();

        for (const faq of faqDatabase) {
            if (faq.keywords.some(keyword => input.includes(keyword))) {
                return faq.response;
            }
        }

        return 'Hmm, saya belum sepenuhnya mengerti pertanyaan Anda. 😅\n\nTapi tenang! Saya bisa bantu jelaskan tentang:\n\n💡 Harga & Paket Layanan\n💡 Fitur yang Bisa Direquest\n💡 Cara Order & Proses Kerja\n💡 Teknologi yang Digunakan\n💡 Waktu Pengerjaan\n💡 Portfolio & Contoh Karya\n💡 Garansi & Support\n💡 SEO & Mobile Optimization\n\nCoba tanyakan salah satu topik di atas, atau langsung hubungi kami via WhatsApp untuk konsultasi lebih detail! 📱\n\nAtau gunakan tombol pertanyaan cepat di bawah untuk mulai! 👇';
    };

    const handleSendMessage = (text = inputText) => {
        if (!text.trim()) return;

        const userMessage = {
            type: 'user',
            text: text,
            timestamp: new Date(),
        };
        setMessages(prev => [...prev, userMessage]);
        setInputText('');

        setTimeout(() => {
            const botResponse = {
                type: 'bot',
                text: findResponse(text),
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, botResponse]);
        }, 800);
    };

    const handleQuickAction = (query) => {
        handleSendMessage(query);
    };

    // Robot SVG Component
    const RobotCharacter = ({ isBlinking }) => (
        <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Antenna */}
            <motion.line
                x1="30" y1="8" x2="30" y2="15"
                stroke="#60A5FA"
                strokeWidth="2"
                strokeLinecap="round"
                animate={{ y: [0, -2, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.circle
                cx="30" cy="6" r="3"
                fill="#60A5FA"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Head */}
            <rect x="15" y="15" width="30" height="25" rx="5" fill="url(#robotGradient)" />

            {/* Eyes */}
            <motion.circle
                cx="23" cy="25" r={isBlinking ? "1" : "3"}
                fill="#FFFFFF"
                transition={{ duration: 0.1 }}
            />
            <motion.circle
                cx="37" cy="25" r={isBlinking ? "1" : "3"}
                fill="#FFFFFF"
                transition={{ duration: 0.1 }}
            />

            {/* Mouth */}
            <path d="M 22 32 Q 30 35 38 32" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" fill="none" />

            {/* Body */}
            <rect x="20" y="42" width="20" height="15" rx="3" fill="url(#robotGradient)" />

            {/* Arms */}
            <motion.rect
                x="12" y="45" width="6" height="10" rx="2"
                fill="#60A5FA"
                animate={{ rotate: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                style={{ transformOrigin: "15px 45px" }}
            />
            <motion.rect
                x="42" y="45" width="6" height="10" rx="2"
                fill="#60A5FA"
                animate={{ rotate: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                style={{ transformOrigin: "45px 45px" }}
            />

            {/* Gradient Definition */}
            <defs>
                <linearGradient id="robotGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#059669" />
                    <stop offset="100%" stopColor="#047857" />
                </linearGradient>
            </defs>
        </svg>
    );

    return (
        <>
            {/* Floating Robot Button */}
            <motion.div
                className="fixed bottom-6 right-6 z-50"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
                {/* Speech Bubble */}
                <AnimatePresence>
                    {showBubble && !isOpen && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, x: 20 }}
                            animate={{ opacity: 1, scale: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.8, x: 20 }}
                            className="absolute bottom-full right-0 mb-4 bg-white dark:bg-slate-800 text-slate-800 dark:text-white px-4 py-3 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 whitespace-nowrap"
                        >
                            <p className="text-sm font-medium">Ada yang bisa saya bantu?</p>
                            <div className="absolute bottom-0 right-8 transform translate-y-1/2 rotate-45 w-3 h-3 bg-white dark:bg-slate-800 border-r border-b border-slate-200 dark:border-slate-700"></div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Robot Button */}
                <motion.button
                    onClick={() => {
                        setIsOpen(!isOpen);
                        setShowBubble(false);
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="relative w-20 h-20 bg-gradient-to-br from-primary to-primary-light rounded-full shadow-2xl flex items-center justify-center hover:shadow-primary/50 transition-all border-2 border-white/20"
                    aria-label="Toggle chatbot"
                >
                    <AnimatePresence mode="wait">
                        {isOpen ? (
                            <motion.div
                                key="close"
                                initial={{ rotate: -90, opacity: 0 }}
                                animate={{ rotate: 0, opacity: 1 }}
                                exit={{ rotate: 90, opacity: 0 }}
                            >
                                <X size={32} className="text-white" />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="robot"
                                initial={{ rotate: -90, opacity: 0 }}
                                animate={{ rotate: 0, opacity: 1 }}
                                exit={{ rotate: 90, opacity: 0 }}
                            >
                                <RobotCharacter isBlinking={isBlinking} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.button>
            </motion.div>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="fixed bottom-32 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] h-[600px] max-h-[calc(100vh-10rem)] bg-white dark:bg-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden border-2 border-brand-emerald-100 dark:border-primary-dark"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-primary via-primary-light to-primary-dark text-white p-5 flex items-center gap-3 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10 rotate-12">
                                <Send size={80} />
                            </div>
                            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30">
                                <RobotCharacter isBlinking={false} />
                            </div>
                            <div className="flex-1 relative z-10">
                                <h3 className="font-bold text-lg">RoboBot</h3>
                                <p className="text-xs text-brand-emerald-50">Asisten WebKuu • Online</p>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-brand-emerald-50/30 to-brand-gold-50/30 dark:from-slate-900 dark:to-slate-900">
                            {messages.map((message, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[80%] rounded-2xl px-4 py-3 ${message.type === 'user'
                                            ? 'bg-gradient-to-r from-primary to-primary-light text-white rounded-br-sm shadow-md'
                                            : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-white rounded-bl-sm shadow-md border border-brand-emerald-100 dark:border-slate-700'
                                            }`}
                                    >
                                        <p className="text-sm whitespace-pre-line leading-relaxed">{message.text}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Quick Actions */}
                        {messages.length <= 2 && (
                            <div className="p-3 bg-white dark:bg-slate-800 border-t border-brand-emerald-100 dark:border-slate-700">
                                <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 font-bold uppercase tracking-wider">Pertanyaan cepat:</p>
                                <div className="grid grid-cols-2 gap-2">
                                    {quickActions.map((action, index) => (
                                        <button
                                            key={index}
                                            onClick={() => handleQuickAction(action.query)}
                                            className="text-xs px-3 py-2 bg-brand-emerald-50 dark:bg-slate-700 hover:bg-primary hover:text-white dark:hover:bg-primary-dark text-slate-700 dark:text-slate-200 rounded-lg transition-all text-left border border-brand-emerald-100 dark:border-slate-600 font-medium"
                                        >
                                            {action.text}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}



                        {/* Input */}
                        <div className="p-4 bg-white dark:bg-slate-800 border-t-2 border-brand-emerald-100 dark:border-slate-700">
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleSendMessage();
                                }}
                                className="flex gap-2"
                            >
                                <input
                                    type="text"
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    placeholder="Ketik pertanyaan Anda..."
                                    className="flex-1 px-4 py-3 rounded-xl border-2 border-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-sm"
                                />
                                <button
                                    type="submit"
                                    className="px-4 py-3 bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white rounded-xl transition-all shadow-lg shadow-primary/20"
                                >
                                    <Send size={18} />
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default ChatbotWidget;
