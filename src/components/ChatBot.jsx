import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User, ChevronRight, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const ChatBot = () => {
    const { t, i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [showTooltip, setShowTooltip] = useState(true);
    const [messages, setMessages] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const scrollRef = useRef(null);

    // Keyboard Shortcut Effect (Ctrl+Alt+M)
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.ctrlKey && e.altKey && (e.key === 'm' || e.key === 'M')) {
                e.preventDefault();
                setIsOpen(prev => !prev);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Tooltip Auto-Dismiss Effect
    useEffect(() => {
        const timer = setTimeout(() => {
            setShowTooltip(false);
        }, 8000); // Hide after 8 seconds
        return () => clearTimeout(timer);
    }, []);

    // Initial message on first open
    useEffect(() => {
        if (isOpen && messages.length === 0) {
            setIsTyping(true);
            setTimeout(() => {
                setMessages([
                    {
                        id: 1,
                        type: 'bot',
                        text: t('chatbot.initial_message'),
                        timestamp: new Date()
                    }
                ]);
                setIsTyping(false);
            }, 1000);
        }
    }, [isOpen, messages.length, t]);

    // Scroll to bottom when messages change
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const handleSendMessage = (text) => {
        if (!text.trim()) return;

        const newUserMessage = {
            id: `user-${Date.now()}`,
            type: 'user',
            text: text,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, newUserMessage]);
        setInputValue('');
        setIsTyping(true);

        // Simulate Bot Response
        setTimeout(() => {
            let botResponse = t('chatbot.fallback_response');

            // Simple Keyword Matching
            const lowerText = text.toLowerCase();
            if (lowerText.includes('harga') || lowerText.includes('paket') || lowerText.includes('biaya')) {
                botResponse = t('chatbot.faq.price');
            } else if (lowerText.includes('fitur') || lowerText.includes('fasilitas')) {
                botResponse = t('chatbot.faq.features');
            } else if (lowerText.includes('order') || lowerText.includes('pesan') || lowerText.includes('cara')) {
                botResponse = t('chatbot.faq.order');
            } else if (lowerText.includes('kontak') || lowerText.includes('wa') || lowerText.includes('hubungi')) {
                botResponse = t('chatbot.faq.contact');
            }

            const newBotMessage = {
                id: `bot-${Date.now()}`,
                type: 'bot',
                text: botResponse,
                timestamp: new Date()
            };

            setMessages(prev => [...prev, newBotMessage]);
            setIsTyping(false);
        }, 1500);
    };


    const quickActions = [
        { key: 'price', label: t('chatbot.quick_actions.price'), text: 'Berapa harga paket websitenya?' },
        { key: 'features', label: t('chatbot.quick_actions.features'), text: 'Apa saja fitur yang didapat?' },
        { key: 'order', label: t('chatbot.quick_actions.order'), text: 'Bagaimana cara ordernya?' },
        { key: 'contact', label: t('chatbot.quick_actions.contact'), text: 'Minta nomor WhatsApp kak' }
    ];

    return (
        <>
            {/* Backdrop Blur Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 z-[9998] bg-slate-900/40 backdrop-blur-[4px] transition-all"
                    />
                )}
            </AnimatePresence>

            <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end">
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 20, scale: 0.95, transformOrigin: 'bottom right' }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 20, scale: 0.95 }}
                            className="mb-2 w-[calc(100vw-32px)] sm:w-[450px] md:w-[500px] h-[500px] md:h-[640px] max-h-[85vh] bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.2)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.4)] flex flex-col border border-slate-100 dark:border-slate-800 overflow-hidden"
                        >
                            {/* Header */}
                            <div className="p-5 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 text-white shrink-0 relative overflow-hidden border-b border-white/5">
                                {/* Animated Background Decoration */}
                                <motion.div
                                    animate={{
                                        scale: [1, 1.2, 1],
                                        rotate: [0, 45, 0],
                                    }}
                                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                    className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl"
                                />

                                <div className="flex items-center justify-between relative z-10">
                                    <div className="flex items-center gap-3">
                                        <div className="relative">
                                            <div className="w-14 h-14 bg-white/10 rounded-2xl backdrop-blur-xl flex items-center justify-center border border-white/20 shadow-xl">
                                                <motion.div
                                                    animate={{
                                                        y: [0, -4, 0],
                                                    }}
                                                    transition={{
                                                        duration: 2,
                                                        repeat: Infinity,
                                                        ease: "easeInOut"
                                                    }}
                                                >
                                                    <Bot size={32} className="text-emerald-400" />
                                                </motion.div>
                                            </div>
                                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-slate-900 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                                        </div>
                                        <div>
                                            <h3 className="font-black text-xl tracking-tight flex items-center gap-2">
                                                {t('chatbot.header_title')}
                                            </h3>
                                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">
                                                {t('chatbot.header_subtitle')}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 relative z-10">
                                        <button
                                            onClick={() => setIsOpen(false)}
                                            className="p-2.5 bg-white/5 hover:bg-white/10 rounded-2xl transition-all border border-white/5 hover:border-white/20 text-white/50 hover:text-white"
                                        >
                                            <X size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Messages Area */}
                            <div className="flex-1 relative overflow-hidden flex flex-col bg-slate-50/50 dark:bg-slate-950/20">
                                <div
                                    ref={scrollRef}
                                    className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar relative"
                                >
                                    <div className="text-center pb-4">
                                        <span className="text-[10px] font-black text-slate-300 dark:text-slate-800 uppercase tracking-[0.3em] bg-white dark:bg-slate-900 px-4 py-1.5 rounded-full border border-slate-100 dark:border-slate-800 shadow-sm">
                                            Live Support Active
                                        </span>
                                    </div>

                                    {messages.map((msg) => (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            key={msg.id}
                                            className={`flex ${msg.type === 'bot' ? 'justify-start' : 'justify-end'}`}
                                        >
                                            <div className={`flex gap-4 max-w-[90%] ${msg.type === 'bot' ? 'flex-row' : 'flex-row-reverse'}`}>
                                                {msg.type === 'bot' && (
                                                    <div className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-800 text-emerald-500 flex items-center justify-center shrink-0 mt-1 shadow-md border border-slate-100 dark:border-slate-700">
                                                        <Bot size={22} />
                                                    </div>
                                                )}
                                                <div className="flex flex-col gap-1.5">
                                                    <div className={`p-5 rounded-[2rem] text-sm leading-relaxed shadow-sm border ${msg.type === 'bot'
                                                        ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border-slate-100 dark:border-slate-700 rounded-tl-none'
                                                        : 'bg-emerald-600 text-white border-emerald-700 rounded-tr-none'
                                                        }`}>
                                                        <div className="font-semibold whitespace-pre-line">{msg.text}</div>
                                                    </div>
                                                    <div className={`flex items-center gap-2 px-2 font-black uppercase tracking-tighter opacity-30 ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                                                        <span className="text-[9px]">
                                                            {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                    {isTyping && (
                                        <motion.div
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="flex justify-start"
                                        >
                                            <div className="flex gap-4">
                                                <div className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-800 text-emerald-500 flex items-center justify-center shadow-md border border-slate-100 dark:border-slate-700">
                                                    <Bot size={22} />
                                                </div>
                                                <div className="bg-white dark:bg-slate-800 p-5 rounded-[2rem] rounded-tl-none border border-slate-100 dark:border-slate-700 flex gap-2 shadow-sm items-center">
                                                    <motion.span
                                                        animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
                                                        transition={{ repeat: Infinity, duration: 1 }}
                                                        className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_5px_rgba(16,185,129,0.5)]"
                                                    ></motion.span>
                                                    <motion.span
                                                        animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
                                                        transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                                                        className="w-2 h-2 bg-emerald-400 rounded-full"
                                                    ></motion.span>
                                                    <motion.span
                                                        animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
                                                        transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                                                        className="w-2 h-2 bg-emerald-300 rounded-full"
                                                    ></motion.span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </div>
                            </div>

                            {/* Quick Actions & Input */}
                            <div className="shrink-0 p-6 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 shadow-[0_-10px_40px_rgba(0,0,0,0.03)]">
                                <div className="mb-6">
                                    <span className="block text-[9px] font-black text-slate-400 dark:text-slate-500 mb-3 tracking-[0.2em] uppercase">
                                        {t('chatbot.quick_actions.label')}
                                    </span>
                                    <div className="flex flex-nowrap gap-2.5 overflow-x-auto pb-2 scrollbar-hide no-scrollbar -mx-1 px-1">
                                        {quickActions.map(action => (
                                            <button
                                                key={action.key}
                                                onClick={() => handleSendMessage(action.text)}
                                                className="px-5 py-2.5 bg-slate-50 hover:bg-emerald-500 hover:text-white dark:bg-slate-800 dark:hover:bg-emerald-600 transition-all rounded-2xl text-[10px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-300 border border-slate-200/50 dark:border-slate-700/50 flex items-center gap-2 group shadow-sm active:scale-95 whitespace-nowrap shrink-0"
                                            >
                                                {action.label}
                                                <ChevronRight size={12} className="opacity-30 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        handleSendMessage(inputValue);
                                    }}
                                    className="relative group"
                                >
                                    <input
                                        type="text"
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        placeholder={t('chatbot.input_placeholder')}
                                        className="w-full pl-7 pr-16 py-5 bg-slate-100 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/50 rounded-[2.5rem] text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500/50 transition-all dark:text-white placeholder:text-slate-400"
                                    />
                                    <button
                                        type="submit"
                                        disabled={!inputValue.trim()}
                                        className={`absolute right-2.5 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full transition-all flex items-center justify-center ${inputValue.trim()
                                            ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 hover:scale-110 active:scale-95'
                                            : 'bg-slate-200 dark:bg-slate-700 text-slate-400'
                                            }`}
                                    >
                                        <Send size={20} strokeWidth={2.5} />
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Bubble Toggle Container */}
                <div className="relative">
                    {/* Floating Tooltip with Auto-Dismiss */}
                    <AnimatePresence>
                        {!isOpen && showTooltip && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.8 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8, y: 10 }}
                                className="absolute bottom-full right-0 mb-6 flex flex-col items-end z-50 pointer-events-none"
                            >
                                <div className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-4 rounded-[1.5rem] shadow-2xl border border-white/10 dark:border-slate-100 text-[11px] font-black whitespace-nowrap relative flex items-center gap-3">
                                    <div className="flex gap-1">
                                        <motion.div
                                            animate={{ scale: [1, 1.4, 1] }}
                                            transition={{ duration: 1, repeat: Infinity }}
                                            className="w-2.5 h-2.5 bg-emerald-400 rounded-full shadow-[0_0_8px_rgba(52,211,153,0.6)]"
                                        />
                                        <motion.div
                                            animate={{ scale: [1, 1.4, 1] }}
                                            transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                                            className="w-2.5 h-2.5 bg-emerald-400/60 rounded-full"
                                        />
                                    </div>
                                    {t('chatbot.bubble_text')}
                                    <div className="absolute top-full right-10 w-4 h-4 bg-slate-900 dark:bg-white border-r border-b border-white/10 dark:border-slate-100 transform rotate-45 -translate-y-1/2"></div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <motion.button
                        onClick={() => setIsOpen(!isOpen)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="relative w-20 h-20 bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.4)] border-4 border-white dark:border-slate-900 flex items-center justify-center overflow-hidden group z-40"
                        style={{ width: '85px', height: '85px' }}
                    >
                        <AnimatePresence mode="wait">
                            {isOpen ? (
                                <motion.div
                                    key="close"
                                    initial={{ opacity: 0, rotate: -90 }}
                                    animate={{ opacity: 1, rotate: 0 }}
                                    exit={{ opacity: 0, rotate: 90 }}
                                >
                                    <X size={36} className="text-white" strokeWidth={2.5} />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="mascot"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="relative flex flex-col items-center"
                                >
                                    <motion.div
                                        animate={{
                                            y: [0, -6, 0],
                                            rotate: [0, 8, -8, 0]
                                        }}
                                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    >
                                        <Bot size={44} className="text-emerald-400 shadow-emerald-500/50" strokeWidth={1.5} />
                                    </motion.div>
                                    <div className="absolute -bottom-1 w-10 h-1.5 bg-black/40 blur-md rounded-full"></div>

                                    {/* Dynamic Background Glow */}
                                    <div className="absolute inset-0 bg-emerald-500/20 blur-2xl rounded-full scale-150 group-hover:bg-emerald-500/40 transition-all duration-700"></div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.button>
                </div>
            </div>
        </>
    );
};

export default ChatBot;
