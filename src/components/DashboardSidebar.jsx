import React, { useState } from 'react';
import { LayoutGrid, ListTodo, Calendar, BarChart3, Users, Settings, HelpCircle, LogOut, Sun, Moon, ChevronDown, Languages, Smartphone, ArrowUpRight, ChevronLeft, ChevronRight, Briefcase, ShoppingCart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { Link } from 'react-router-dom';

const Logo = () => {
    return (
        <div className="flex items-center gap-3 mb-6 px-2 transition-transform hover:scale-[1.02] duration-300">
            <div className="relative w-10 h-10 flex items-center justify-center bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-100 dark:border-slate-800 shadow-xl overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <svg
                    viewBox="0 0 64 64"
                    className="w-8 h-8 relative z-10"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M12 22L20 46L32 25L45 46L52 22"
                        stroke="url(#logo-sidebar-grad)"
                        strokeWidth="6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M32 25L32 46"
                        stroke="url(#logo-sidebar-grad)"
                        strokeWidth="6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        opacity="0.3"
                    />
                    <defs>
                        <linearGradient id="logo-sidebar-grad" x1="12" y1="22" x2="52" y2="46" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#064e3b" />
                            <stop offset="1" stopColor="#d97706" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>
            <div className="flex flex-col space-y-0.5">
                <span className="text-2xl font-black tracking-tighter text-slate-900 dark:text-white leading-tight">
                    WEB<span className="text-emerald-600">KUU</span>
                </span>
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-tight">
                    SOLUSI DIGITAL
                </span>
            </div>
        </div>
    );
};

const DashboardSidebar = ({ activeTab, setActiveTab, portfolioCount = 0 }) => {
    const { t, i18n } = useTranslation();
    const { isDark, toggleTheme } = useTheme();
    const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

    const languages = [
        { code: 'en', name: 'English', flag: '🇺🇸' },
        { code: 'id', name: 'Indonesia', flag: '🇮🇩' },
        { code: 'ja', name: '日本語', flag: '🇯🇵' },
        { code: 'es', name: 'Español', flag: '🇪🇸' },
        { code: 'fr', name: 'Français', flag: '🇫🇷' }
    ];

    const changeLanguage = (langCode) => {
        i18n.changeLanguage(langCode);
        setIsLangMenuOpen(false);
    };

    const menuSections = {
        menu: [
            { id: 'dashboard', icon: LayoutGrid, label: t('dashboard.sidebar.items.dashboard') },
            {
                id: 'portfolio',
                icon: Briefcase,
                label: t('dashboard.sidebar.items.portfolio'),
                badge: portfolioCount > 0 ? portfolioCount.toString().padStart(2, '0') : null
            },
            { id: 'orders', icon: ShoppingCart, label: t('dashboard.sidebar.items.orders') },
            { id: 'analytics', icon: BarChart3, label: t('dashboard.sidebar.items.analytics') },
            { id: 'visitors', icon: Users, label: t('dashboard.sidebar.items.team') },
        ],
        general: [
            { id: 'settings', icon: Settings, label: t('dashboard.sidebar.items.settings'), isComingSoon: true },
            { id: 'help', icon: HelpCircle, label: t('dashboard.sidebar.items.help'), isComingSoon: true },
            { id: 'logout', icon: LogOut, label: t('dashboard.sidebar.items.logout'), isLogout: true },
        ]
    };

    return (
        <>
            {/* Desktop Sidebar */}
            <motion.aside
                initial={{ opacity: 0, x: -20 }}
                animate={{
                    opacity: 1,
                    x: 0,
                    width: isCollapsed ? 80 : 256
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="hidden lg:flex flex-col bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200/60 dark:border-slate-700/50 px-4 py-5 sticky top-2 h-[calc(100vh-1.5rem)]"
                style={{
                    boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.02), 0 1px 2px -1px rgb(0 0 0 / 0.02)'
                }}
            >
                {/* Collapse Toggle Button */}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="absolute -right-3 top-8 w-6 h-6 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-full flex items-center justify-center text-slate-500 hover:text-emerald-600 transition-colors shadow-sm z-50 hover:scale-110"
                >
                    {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                </button>

                {/* Branding */}
                <Link to="/" className="block">
                    <div className={`flex items-center gap-3 mb-6 px-2 transition-all duration-300 ${isCollapsed ? 'justify-center' : ''}`}>
                        <div className="relative w-10 h-10 flex-shrink-0 flex items-center justify-center bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-100 dark:border-slate-800 shadow-xl overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <svg viewBox="0 0 64 64" className="w-8 h-8 relative z-10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 22L20 46L32 25L45 46L52 22" stroke="url(#logo-sidebar-grad)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M32 25L32 46" stroke="url(#logo-sidebar-grad)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" opacity="0.3" />
                                <defs>
                                    <linearGradient id="logo-sidebar-grad" x1="12" y1="22" x2="52" y2="46" gradientUnits="userSpaceOnUse">
                                        <stop stopColor="#064e3b" />
                                        <stop offset="1" stopColor="#d97706" />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>
                        {!isCollapsed && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex flex-col space-y-0.5 overflow-hidden whitespace-nowrap"
                            >
                                <span className="text-2xl font-black tracking-tighter text-slate-900 dark:text-white leading-tight">
                                    WEB<span className="text-emerald-600">KUU</span>
                                </span>
                                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-tight">
                                    SOLUSI DIGITAL
                                </span>
                            </motion.div>
                        )}
                    </div>
                </Link>

                {/* MENU Section */}
                <div className={`mb-2 px-3 pt-1 transition-opacity duration-200 ${isCollapsed ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'}`}>
                    <h2 className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
                        {t('dashboard.sidebar.sections.menu')}
                    </h2>
                </div>

                <nav className="space-y-0.5 mb-6">
                    {menuSections.menu.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                title={isCollapsed ? item.label : ''}
                                className={`group relative w-full flex items-center ${isCollapsed ? 'justify-center px-0' : 'justify-between px-4'} gap-3 py-2 rounded-xl font-medium transition-all duration-200 ${isActive
                                    ? 'text-emerald-800 dark:text-emerald-300 bg-emerald-50/80 dark:bg-emerald-900/20'
                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/40 hover:text-slate-900 dark:hover:text-slate-200'
                                    }`}
                            >
                                {/* Left Border Indicator */}
                                {isActive && (
                                    <motion.div
                                        layoutId="activeIndicator"
                                        className="absolute left-0 top-2 bottom-2 w-1.5 bg-emerald-600 dark:bg-emerald-500 rounded-r-full"
                                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                    />
                                )}

                                <div className="flex items-center gap-3">
                                    <div className={`flex items-center justify-center ${isActive ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-500'}`}>
                                        <Icon size={18} strokeWidth={2.2} />
                                    </div>
                                    {!isCollapsed && (
                                        <span className="text-[13px] font-semibold tracking-tight whitespace-nowrap">{item.label}</span>
                                    )}
                                </div>

                                {/* Badge */}
                                {item.badge && !isCollapsed && (
                                    <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-600 dark:bg-emerald-500 text-white rounded-md shadow-sm shadow-emerald-500/30">
                                        {item.badge}
                                    </span>
                                )}
                                {item.badge && isCollapsed && (
                                    <div className="absolute top-1 right-2 w-2 h-2 bg-emerald-500 rounded-full border border-white dark:border-slate-800" />
                                )}
                            </button>
                        );
                    })}
                </nav>

                {/* GENERAL Section */}
                <div className={`mb-2 px-3 pt-2 border-t border-slate-100 dark:border-slate-700/50 transition-opacity duration-200 ${isCollapsed ? 'opacity-0 h-0 overflow-hidden border-t-0' : 'opacity-100'}`}>
                    <h2 className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mt-1">
                        {t('dashboard.sidebar.sections.general')}
                    </h2>
                </div>

                <nav className="space-y-0.5">
                    {menuSections.general.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => {
                                    if (item.isComingSoon) return;
                                    if (item.isLogout) {
                                        // We will handle this by a prop or window event
                                        window.dispatchEvent(new CustomEvent('trigger-logout-confirm'));
                                        return;
                                    }
                                    setActiveTab(item.id);
                                }}
                                title={isCollapsed ? item.label : ''}
                                className={`group relative w-full flex items-center ${isCollapsed ? 'justify-center px-0' : 'justify-between px-4'} py-2 rounded-xl font-medium transition-all duration-200 ${isActive
                                    ? 'text-emerald-800 dark:text-emerald-300 bg-emerald-50/80 dark:bg-emerald-900/20'
                                    : item.isComingSoon
                                        ? 'text-slate-400 dark:text-slate-600 cursor-not-allowed opacity-70'
                                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/40 hover:text-slate-900 dark:hover:text-slate-200'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`flex items-center justify-center ${isActive ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-500'}`}>
                                        <Icon size={18} strokeWidth={2.2} />
                                    </div>
                                    {!isCollapsed && (
                                        <span className="text-[13px] font-semibold tracking-tight whitespace-nowrap">{item.label}</span>
                                    )}
                                </div>

                                {item.isComingSoon && !isCollapsed && (
                                    <span className="px-1.5 py-0.5 text-[8px] font-black bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-md uppercase tracking-wider">
                                        {t('dashboard.sidebar.items.coming_soon')}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </nav>

                <div className="mt-4">
                    {/* PREFERENCES Section Header */}
                    <div className={`mb-2 px-3 pt-2 border-t border-slate-100 dark:border-slate-700/50 transition-opacity duration-200 ${isCollapsed ? 'opacity-0 h-0 overflow-hidden border-t-0' : 'opacity-100'}`}>
                        <h2 className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mt-1">
                            {t('dashboard.sidebar.sections.preferences')}
                        </h2>
                    </div>

                    <div className="space-y-0.5">
                        {/* Language Switcher */}
                        <div className="relative">
                            <button
                                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                                title={isCollapsed ? 'Language' : ''}
                                className={`group w-full flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} gap-3 px-4 py-2 rounded-xl font-medium transition-all duration-200 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/40 hover:text-slate-900 dark:hover:text-slate-200`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center justify-center text-slate-500 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                                        <Languages size={18} strokeWidth={2.2} />
                                    </div>
                                    {!isCollapsed && <span className="text-[13px] font-semibold tracking-tight">{t('dashboard.sidebar.items.language')}</span>}
                                </div>
                                {!isCollapsed && (
                                    <div className="flex items-center gap-1.5 bg-slate-100/80 dark:bg-slate-700/50 px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase transition-colors group-hover:bg-emerald-100/50 dark:group-hover:bg-emerald-900/30 group-hover:text-emerald-700 dark:group-hover:text-emerald-400">
                                        <span>{languages.find(l => l.code === i18n.language)?.flag}</span>
                                        <span>{i18n.language}</span>
                                    </div>
                                )}
                            </button>

                            {/* Simplified Language Menu for Collapsed Mode (or keeping same behavior horizontally?) */}
                            {/* For now, just keeping existing dropdown but ensuring it positions correctly if collapsed. 
                               If collapsed, maybe show to the side? The current `absolute` positioning might be cut off or look weird.
                               For simplicity, I will stick to existing logic but it might need adjustment if sidebar is 80px.
                            */}
                            <AnimatePresence>
                                {isLangMenuOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, bottom: '100%', y: -10, scale: 0.95 }}
                                        animate={{ opacity: 1, bottom: '100%', y: -5, scale: 1 }}
                                        exit={{ opacity: 0, bottom: '100%', y: -10, scale: 0.95 }}
                                        className={`absolute left-0 right-0 mb-3 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200/60 dark:border-slate-700/50 overflow-hidden py-1.5 z-50 backdrop-blur-xl ${isCollapsed ? 'w-48 left-full ml-2 bottom-0' : ''}`} // Adjust position if collapsed
                                    >
                                        {languages.map((lang) => (
                                            <button
                                                key={lang.code}
                                                onClick={() => changeLanguage(lang.code)}
                                                className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors hover:bg-slate-50 dark:hover:bg-slate-900/40
                                                    ${i18n.language === lang.code ? 'text-emerald-600 font-bold bg-emerald-50/50 dark:bg-emerald-900/20' : 'text-slate-600 dark:text-slate-300'}
                                                `}
                                            >
                                                <span className="text-lg">{lang.flag}</span>
                                                <span className="text-[12px] font-semibold">{lang.name}</span>
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            title={isCollapsed ? 'Toggle Theme' : ''}
                            className={`group w-full flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} gap-3 px-4 py-2 rounded-xl font-medium transition-all duration-200 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/40 hover:text-slate-900 dark:hover:text-slate-200`}
                        >
                            <div className="flex items-center gap-3">
                                <div className="flex items-center justify-center text-slate-500 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                                    {isDark ? <Sun size={18} strokeWidth={2.2} /> : <Moon size={18} strokeWidth={2.2} />}
                                </div>
                                {!isCollapsed && (
                                    <span className="text-[13px] font-semibold tracking-tight">
                                        {isDark ? t('dashboard.sidebar.items.theme_light') : t('dashboard.sidebar.items.theme_dark')}
                                    </span>
                                )}
                            </div>
                            {!isCollapsed && (
                                <div className={`w-8 h-4.5 rounded-full relative transition-colors duration-300 flex items-center ${isDark ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-600'}`}>
                                    <motion.div
                                        animate={{ x: isDark ? 16 : 3 }}
                                        className="w-2.5 h-2.5 bg-white rounded-full shadow-sm"
                                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                    />
                                </div>
                            )}
                        </button>
                    </div>
                </div>


            </motion.aside>

            {/* Mobile Bottom Navigation */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-slate-800/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-700 p-4 z-50 shadow-2xl">
                <nav className="flex items-center justify-around max-w-md mx-auto gap-2">
                    {menuSections.menu.slice(0, 4).map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`relative flex flex-col items-center gap-1.5 px-5 py-2.5 rounded-xl transition-all duration-200 ${isActive
                                    ? 'bg-emerald-600 dark:bg-emerald-700 text-white shadow-lg shadow-emerald-600/30'
                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                                    }`}
                            >
                                <Icon size={20} strokeWidth={2.2} />
                                <span className="text-[10px] font-bold tracking-tight">{item.label}</span>
                                {item.badge && isActive && (
                                    <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center text-[9px] font-bold bg-white text-emerald-600 rounded-full border-2 border-emerald-600">
                                        {item.badge}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </nav>
            </div>
        </>
    );
};

export default DashboardSidebar;
