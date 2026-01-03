import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const ChatbotWidget = () => {
    const { t, i18n } = useTranslation();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const [showBubble, setShowBubble] = useState(true);
    const [isBlinking, setIsBlinking] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');

    // Hide chatbot on dashboard
    if (location.pathname === '/dashboard') return null;

    // Initialize/Reset messages on language change
    useEffect(() => {
        setMessages([
            {
                type: 'bot',
                text: t('chatbot.initial_message'),
                timestamp: new Date(),
            }
        ]);
    }, [t, i18n.language]);

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
    const faqDatabase = useMemo(() => [
        {
            keywords: ['halo', 'hai', 'hello', 'hi', 'pagi', 'siang', 'sore', 'malam', 'greeting', 'pucuk'],
            response: t('chatbot.faq.greeting')
        },
        {
            keywords: ['apa itu', 'website custom', 'custom website', 'pengertian', 'jelaskan', 'what is', 'definition'],
            response: t('chatbot.faq.what_is')
        },
        {
            keywords: ['harga', 'biaya', 'berapa', 'tarif', 'price', 'mahal', 'cost', 'expensive'],
            response: t('chatbot.faq.price')
        },
        {
            keywords: ['fitur', 'request', 'bisa', 'dapat', 'tersedia', 'ada', 'feature', 'can I', 'available'],
            response: t('chatbot.faq.features')
        },
        {
            keywords: ['lama', 'pengerjaan', 'waktu', 'berapa lama', 'durasi', 'cepat', 'how long', 'duration', 'time'],
            response: t('chatbot.faq.duration')
        },
        {
            keywords: ['teknologi', 'tech stack', 'react', 'next', 'framework', 'bahasa', 'technology', 'stack'],
            response: t('chatbot.faq.tech')
        },
        {
            keywords: ['order', 'pesan', 'cara', 'bagaimana', 'proses', 'mulai', 'how to order', 'process', 'start'],
            response: t('chatbot.faq.order')
        },
        {
            keywords: ['paket', 'pilihan', 'tersedia', 'rekomendasi', 'package', 'option', 'recommendation'],
            response: t('chatbot.faq.packages')
        },
        {
            keywords: ['revisi', 'gratis', 'garansi', 'support', 'maintenance', 'revision', 'warranty', 'guarantee'],
            response: t('chatbot.faq.guarantee')
        },
        {
            keywords: ['kontak', 'hubungi', 'whatsapp', 'contact', 'email', 'telepon', 'call', 'phone'],
            response: t('chatbot.faq.contact')
        },
        {
            keywords: ['portfolio', 'contoh', 'hasil', 'karya', 'project', 'sample', 'work'],
            response: t('chatbot.faq.portfolio')
        },
        {
            keywords: ['terima kasih', 'thanks', 'makasih', 'ok', 'oke', 'siap', 'thank you', 'good'],
            response: t('chatbot.faq.thanks')
        },
        {
            keywords: ['responsive', 'mobile', 'hp', 'handphone', 'tablet', 'gadget'],
            response: t('chatbot.faq.responsive')
        },
        {
            keywords: ['seo', 'google', 'ranking', 'optimasi', 'pencarian', 'search'],
            response: t('chatbot.faq.seo')
        }
    ], [t]);

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

        return t('chatbot.fallback_response');
    };

    const handleSendMessage = (text = inputText, queryOverride = null) => {
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
                text: findResponse(queryOverride || text),
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, botResponse]);
        }, 800);
    };

    const handleQuickAction = (text, query) => {
        handleSendMessage(text, query);
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
                            <p className="text-sm font-medium">{t('chatbot.bubble_text')}</p>
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
                                <h3 className="font-bold text-lg">{t('chatbot.header_title')}</h3>
                                <p className="text-xs text-brand-emerald-50">{t('chatbot.header_subtitle')}</p>
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
                                <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 font-bold uppercase tracking-wider">{t('chatbot.quick_actions.label')}</p>
                                <div className="grid grid-cols-2 gap-2">
                                    {[
                                        { text: t('chatbot.quick_actions.price'), query: 'harga' },
                                        { text: t('chatbot.quick_actions.order'), query: 'cara order' },
                                        { text: t('chatbot.quick_actions.features'), query: 'fitur' },
                                        { text: t('chatbot.quick_actions.contact'), query: 'kontak' },
                                    ].map((action, index) => (
                                        <button
                                            key={index}
                                            onClick={() => handleQuickAction(action.text, action.query)}
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
                                    placeholder={t('chatbot.input_placeholder')}
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
