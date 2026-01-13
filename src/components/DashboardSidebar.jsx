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

const DashboardSidebar = ({ activeTab, setActiveTab, portfolioCount = 0, isMobileOpen, setIsMobileOpen }) => {
    const { t, i18n } = useTranslation();
    const { isDark, toggleTheme } = useTheme();
    const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

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
            {/* Mobile Backdrop */}
            <AnimatePresence>
                {isMobileOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsMobileOpen?.(false)}
                        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar Container */}
            <aside className={`
                fixed md:sticky top-0 left-0 h-screen z-50
                w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800
                flex flex-col transition-transform duration-300 ease-in-out
                ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}>
                {/* Logo Section */}
                <div className="p-6 flex items-center justify-between">
                    <Logo />
                    {/* Close button for mobile */}
                    <button
                        onClick={() => setIsMobileOpen?.(false)}
                        className="md:hidden p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                    >
                        <ChevronLeft size={24} />
                    </button>
                </div>

                {/* Menu Items */}
                <div className="flex-1 px-4 space-y-6 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
                    {Object.entries(menuSections).map(([section, items]) => (
                        <div key={section} className="space-y-2">
                            {section !== 'menu' && (
                                <h3 className="px-4 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">
                                    {section === 'general' ? t('dashboard.sidebar.general') : section}
                                </h3>
                            )}

                            {items.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        if (item.isComingSoon) return;
                                        if (item.isLogout) {
                                            // Handle logout via parent or context if needed, but here simple tab switch for now
                                            // Or better: pass a prop. For now, matching original behavior:
                                            setActiveTab(item.id);
                                            setIsMobileOpen?.(false);
                                            return;
                                        }
                                        setActiveTab(item.id);
                                        setIsMobileOpen?.(false);
                                    }}
                                    className={`
                                        w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium text-sm group
                                        ${activeTab === item.id
                                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                                            : item.isLogout
                                                ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10'
                                                : item.isComingSoon
                                                    ? 'text-slate-400 dark:text-slate-600 cursor-not-allowed'
                                                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                                        }
                                    `}
                                >
                                    <item.icon size={20} className={activeTab === item.id ? 'text-white' : ''} />
                                    <span className="flex-1 text-left">{item.label}</span>

                                    {item.badge && (
                                        <span className={`
                                            px-2 py-0.5 rounded-full text-[10px] font-bold
                                            ${activeTab === item.id
                                                ? 'bg-white/20 text-white'
                                                : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
                                            }
                                        `}>
                                            {item.badge}
                                        </span>
                                    )}

                                    {item.isComingSoon && (
                                        <span className="px-1.5 py-0.5 text-[10px] bg-slate-100 dark:bg-slate-800 rounded text-slate-400">Soon</span>
                                    )}
                                </button>
                            ))}
                        </div>
                    ))}
                </div>

                {/* Footer / Settings */}
                <div className="p-4 border-t border-slate-100 dark:border-slate-800">
                    {/* Simplified Footer for space */}
                    <div className="flex items-center gap-2">
                        {/* Language */}
                        <div className="relative flex-1">
                            <button
                                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-medium transition-colors"
                            >
                                <Languages size={14} />
                                <span>{i18n.language.toUpperCase()}</span>
                            </button>

                            <AnimatePresence>
                                {isLangMenuOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="absolute bottom-full left-0 w-full mb-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden z-50 p-1"
                                    >
                                        {languages.map((lang) => (
                                            <button
                                                key={lang.code}
                                                onClick={() => changeLanguage(lang.code)}
                                                className="w-full flex items-center gap-2 px-3 py-2 text-xs rounded-md hover:bg-slate-100 dark:hover:bg-slate-700/50 text-slate-600 dark:text-slate-300"
                                            >
                                                <span>{lang.flag}</span>
                                                <span className="flex-1 text-left">{lang.name}</span>
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Theme */}
                        <button
                            onClick={toggleTheme}
                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-medium transition-colors"
                        >
                            {isDark ? <Sun size={14} /> : <Moon size={14} />}
                            <span>{isDark ? 'Light' : 'Dark'}</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Mobile Bottom Navigation */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-slate-800/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-700 p-2 z-40 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
                <nav className="flex items-center justify-around max-w-md mx-auto">
                    {menuItems.slice(0, 5).filter(item => item.id !== 'visitors').map((item) => {
                        const isActive = activeTab === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-200 relative ${isActive
                                        ? 'text-blue-600 dark:text-blue-400'
                                        : 'text-slate-500 dark:text-slate-400 inactive'
                                    }`}
                            >
                                <div className={`
                                    p-1.5 rounded-full transition-all duration-300
                                    ${isActive ? 'bg-blue-50 dark:bg-blue-900/20' : ''}
                                `}>
                                    <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                                </div>
                                <span className="text-[10px] font-bold">{item.label}</span>

                                {item.badge && (
                                    <span className="absolute top-1 right-2 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-slate-800" />
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
