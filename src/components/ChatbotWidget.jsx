import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, ExternalLink } from 'lucide-react';

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
            keywords: ['apa itu', 'website custom', 'custom website', 'pengertian'],
            response: 'Website Custom adalah layanan pembuatan website yang dibuat khusus sesuai kebutuhan Anda. Bukan template! Anda bisa request desain, fitur, dan teknologi yang diinginkan. 🎨✨'
        },
        {
            keywords: ['harga', 'biaya', 'berapa', 'tarif', 'price'],
            response: 'Harga layanan kami sangat terjangkau:\n\n💰 Paket Hemat: Mulai Rp 100rb (Landing Page)\n💼 Custom/UMKM: Harga Fleksibel (sesuai kebutuhan)\n🏢 Full Custom: Harga Diskusi (sistem kompleks)\n\nHarga bervariasi tergantung fitur yang Anda butuhkan!'
        },
        {
            keywords: ['fitur', 'request', 'bisa', 'dapat'],
            response: 'Anda bisa request berbagai fitur:\n\n✅ Desain custom 100%\n✅ Sistem booking/reservasi\n✅ Payment gateway\n✅ Dashboard admin\n✅ Integrasi API\n✅ E-commerce lengkap\n✅ Dan fitur lainnya!\n\nBeritahu kami kebutuhan Anda, kami wujudkan! 🚀'
        },
        {
            keywords: ['lama', 'pengerjaan', 'waktu', 'berapa lama', 'durasi'],
            response: 'Pengerjaan website kami cepat:\n\n⚡ Landing Page: 3-5 hari\n⚡ Website UMKM: 5-7 hari\n⚡ Sistem Kompleks: 2-4 minggu\n\nTergantung kompleksitas fitur. Kami prioritaskan kualitas tanpa mengorbankan kecepatan! ⏱️'
        },
        {
            keywords: ['teknologi', 'tech stack', 'react', 'next', 'framework'],
            response: 'Kami menggunakan teknologi modern:\n\n🔧 React.js + Tailwind CSS\n🔧 Next.js (SEO Friendly)\n🔧 Node.js + Express\n🔧 Laravel + PHP\n🔧 WordPress (jika diminta)\n🔧 Dan framework lainnya\n\nAnda juga bisa request tech stack tertentu! 💻'
        },
        {
            keywords: ['order', 'pesan', 'cara', 'bagaimana', 'proses'],
            response: 'Cara order sangat mudah:\n\n1️⃣ Konsultasi gratis (via WhatsApp/Form)\n2️⃣ Sepakati fitur & harga\n3️⃣ Kami kerjakan website Anda\n4️⃣ Review & revisi (gratis!)\n5️⃣ Website siap online! 🎉\n\nKlik tombol "Konsultasi via WhatsApp" di bawah untuk mulai!'
        },
        {
            keywords: ['paket', 'pilihan', 'tersedia'],
            response: 'Kami punya 3 paket:\n\n📦 Paket Hemat (Rp 100rb)\n- Landing page sederhana\n- Mobile responsive\n\n📦 Custom/UMKM (Fleksibel)\n- Desain custom\n- Fitur sesuai kebutuhan\n\n📦 Full Custom (Diskusi)\n- Sistem kompleks\n- Backend + Database\n\nPilih yang sesuai kebutuhan Anda!'
        },
        {
            keywords: ['revisi', 'gratis', 'garansi'],
            response: 'Kami berikan:\n\n✅ Revisi GRATIS sampai puas\n✅ Garansi bug fix\n✅ Support selamanya\n✅ Konsultasi gratis\n\nKepuasan Anda prioritas kami! 🌟'
        },
        {
            keywords: ['kontak', 'hubungi', 'whatsapp', 'contact'],
            response: 'Hubungi kami:\n\n📱 WhatsApp: +62 895 6131 14028\n📧 Email: web.kuu@gmail.com\n\nKami siap membantu Anda 24/7! 💬'
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

        return 'Maaf, saya belum mengerti pertanyaan Anda. 😅\n\nCoba tanyakan tentang:\n• Harga layanan\n• Fitur yang tersedia\n• Cara order\n• Tech stack\n• Waktu pengerjaan\n\nAtau hubungi kami langsung via WhatsApp untuk konsultasi gratis! 📱';
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
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#06B6D4" />
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
                    className="relative w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full shadow-2xl flex items-center justify-center hover:shadow-blue-500/50 transition-all"
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
                        className="fixed bottom-32 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] h-[600px] max-h-[calc(100vh-10rem)] bg-white dark:bg-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden border-2 border-blue-200 dark:border-blue-900"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-5 flex items-center gap-3">
                            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                                <RobotCharacter isBlinking={false} />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-lg">RoboBot</h3>
                                <p className="text-xs text-blue-100">Asisten WebKuu • Online</p>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-blue-50/50 to-cyan-50/50 dark:from-slate-900 dark:to-slate-900">
                            {messages.map((message, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[80%] rounded-2xl px-4 py-3 ${message.type === 'user'
                                            ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-br-sm'
                                            : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-white rounded-bl-sm shadow-md border border-blue-100 dark:border-slate-700'
                                            }`}
                                    >
                                        <p className="text-sm whitespace-pre-line leading-relaxed">{message.text}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Quick Actions */}
                        {messages.length <= 2 && (
                            <div className="p-3 bg-white dark:bg-slate-800 border-t border-blue-100 dark:border-slate-700">
                                <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 font-medium">Pertanyaan cepat:</p>
                                <div className="grid grid-cols-2 gap-2">
                                    {quickActions.map((action, index) => (
                                        <button
                                            key={index}
                                            onClick={() => handleQuickAction(action.query)}
                                            className="text-xs px-3 py-2 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-slate-700 dark:to-slate-600 hover:from-blue-100 hover:to-cyan-100 dark:hover:from-slate-600 dark:hover:to-slate-500 text-slate-700 dark:text-slate-300 rounded-lg transition-all text-left border border-blue-200 dark:border-slate-600"
                                        >
                                            {action.text}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* WhatsApp CTA */}
                        <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-t-2 border-green-200 dark:border-green-800">
                            <a
                                href="https://wa.me/62895613114028?text=Halo, saya ingin konsultasi pembuatan website"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold rounded-xl transition-all text-sm shadow-lg hover:shadow-green-500/30"
                            >
                                <ExternalLink size={16} />
                                Konsultasi WhatsApp
                            </a>
                        </div>

                        {/* Input */}
                        <div className="p-4 bg-white dark:bg-slate-800 border-t-2 border-blue-100 dark:border-slate-700">
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
                                    className="flex-1 px-4 py-3 rounded-xl border-2 border-blue-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-sm"
                                />
                                <button
                                    type="submit"
                                    className="px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-xl transition-all shadow-lg hover:shadow-blue-500/30"
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
