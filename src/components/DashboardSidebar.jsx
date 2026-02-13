import React, { useState } from 'react';
import { LayoutGrid, ShoppingCart, Briefcase, BarChart3, Users, Settings, LogOut, Sun, Moon, Languages, ChevronLeft, ChevronRight, History, FileText } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const Logo = ({ isCollapsed }) => {
    const { t } = useTranslation();
    return (
        <div className={`flex items-center gap-3 ${isCollapsed ? 'mb-0 px-0' : 'mb-4 px-2'} transition-all duration-300 ${isCollapsed ? 'justify-center' : ''}`}>
            <div className="relative w-9 h-9 flex items-center justify-center bg-white dark:bg-slate-800 rounded-xl border-2 border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden flex-shrink-0">
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
            {!isCollapsed && (
                <div className="flex flex-col space-y-0.5">
                    <span className="text-2xl font-black tracking-tighter text-slate-900 dark:text-white leading-tight">
                        WEB<span className="text-emerald-600">KUU</span>
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-tight">
                        {t('dashboard.sidebar.branding')}
                    </span>
                </div>
            )}
        </div>
    );
};

const DashboardSidebar = ({ activeTab, setActiveTab, isMobileOpen, setIsMobileOpen, isCollapsed, setIsCollapsed, blogBadgeCount = 0, unreadOrdersCount = 0 }) => {
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
            { id: 'orders', icon: ShoppingCart, label: t('dashboard.sidebar.items.orders') },
            { id: 'portfolio', icon: Briefcase, label: t('dashboard.sidebar.items.portfolio') },
            { id: 'blog', icon: FileText, label: t('dashboard.sidebar.items.blog') },
            { id: 'history', icon: History, label: t('dashboard.sidebar.items.history') },
            { id: 'visitors', icon: Users, label: t('dashboard.sidebar.items.visitors') },
        ],
        general: [
            { id: 'settings', icon: Settings, label: t('dashboard.sidebar.items.settings') },
            { id: 'logout', icon: LogOut, label: t('dashboard.sidebar.items.logout'), isLogout: true },
        ]
    };

    const handleLogoutClick = () => {
        window.dispatchEvent(new CustomEvent('trigger-logout-confirm'));
        setIsMobileOpen?.(false);
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
                fixed top-0 md:top-5 left-0 md:left-4 h-screen md:h-[calc(100vh-2.5rem)] z-40
                ${isCollapsed ? 'w-20' : 'w-64'} bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700/50 md:rounded-[2.5rem]
                flex flex-col transition-all duration-300 ease-in-out shadow-2xl
                ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}>
                {/* Logo Section */}
                <div className={`p-4 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} relative`}>
                    <Logo isCollapsed={isCollapsed} />
                    {/* Collapse button for desktop */}
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className={`hidden md:block p-1.5 text-slate-400 hover:text-emerald-600 dark:hover:text-white bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700/50 rounded-full transition-all shadow-xl z-50
                            ${isCollapsed
                                ? 'absolute -right-3 top-1/2 -translate-y-1/2'
                                : 'hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg'
                            }
                        `}
                    >
                        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={16} />}
                    </button>
                    {/* Close button for mobile */}
                    {!isCollapsed && (
                        <button
                            onClick={() => setIsMobileOpen?.(false)}
                            className="md:hidden p-2 text-slate-400 hover:text-slate-300"
                        >
                            <ChevronLeft size={24} />
                        </button>
                    )}
                </div>

                {/* Menu Items */}
                <div className="flex-1 px-4 space-y-4 overflow-y-auto overflow-x-hidden scrollbar-hide">
                    {/* MENU Section */}
                    <div className="space-y-1">
                        {!isCollapsed && (
                            <h3 className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                                {t('dashboard.sidebar.sections.menu')}
                            </h3>
                        )}

                        {menuSections.menu.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => {
                                    setActiveTab(item.id);
                                    setIsMobileOpen?.(false);
                                }}
                                className={`
                                    w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 font-medium text-sm group relative
                                    ${activeTab === item.id
                                        ? 'bg-emerald-600 text-white'
                                        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-slate-200'
                                    }
                                    ${isCollapsed ? 'justify-center' : ''}
                                `}
                                title={isCollapsed ? item.label : ''}
                            >
                                {/* Left border indicator for active state */}
                                {activeTab === item.id && (
                                    <div className={`absolute ${isCollapsed ? 'left-1.5' : '-left-4'} top-1 bottom-1 w-1.5 bg-emerald-400 rounded-full z-10`} />
                                )}

                                <item.icon size={18} className="flex-shrink-0" />

                                {!isCollapsed && (
                                    <span className="flex-1 text-left">{item.label}</span>
                                )}

                                {/* Notification Badges */}
                                {item.id === 'orders' && unreadOrdersCount > 0 && (
                                    <div className={`${isCollapsed ? 'absolute top-1 right-1' : ''} bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] h-[18px] flex items-center justify-center`}>
                                        {unreadOrdersCount}
                                    </div>
                                )}
                                {item.id === 'blog' && blogBadgeCount > 0 && (
                                    <div className={`${isCollapsed ? 'absolute top-1 right-1' : ''} bg-yellow-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] h-[18px] flex items-center justify-center animate-pulse shadow-lg shadow-yellow-500/30`}>
                                        {blogBadgeCount}
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* GENERAL Section */}
                    <div className="space-y-1">
                        {!isCollapsed && (
                            <h3 className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                                {t('dashboard.sidebar.sections.general')}
                            </h3>
                        )}

                        {menuSections.general.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => {
                                    if (item.isLogout) {
                                        handleLogoutClick();
                                        return;
                                    }
                                    setActiveTab(item.id);
                                    setIsMobileOpen?.(false);
                                }}
                                className={`
                                    w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 font-medium text-sm group
                                    ${item.isLogout
                                        ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
                                        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-slate-200'
                                    }
                                    ${isCollapsed ? 'justify-center' : ''}
                                `}
                                title={isCollapsed ? item.label : ''}
                            >
                                <item.icon size={18} className="flex-shrink-0" />
                                {!isCollapsed && <span className="flex-1 text-left">{item.label}</span>}
                            </button>
                        ))}
                    </div>
                </div>

                {/* PREFERENCES Section */}
                {!isCollapsed && (
                    <div className="p-3 border-t border-slate-100 dark:border-slate-700 space-y-2">
                        <h3 className="px-3 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
                            {t('dashboard.sidebar.sections.preferences')}
                        </h3>

                        {/* Language */}
                        <div className="relative">
                            <button
                                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                                className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700/50 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 text-sm transition-colors"
                            >
                                <div className="flex items-center gap-2">
                                    <Languages size={16} />
                                    <span className="text-sm">{t('dashboard.sidebar.items.language')}</span>
                                </div>
                                <span className="text-xs text-slate-500">{i18n.language.toUpperCase()}</span>
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
                                                className="w-full flex items-center gap-2 px-3 py-2 text-xs rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
                                            >
                                                <span>{lang.flag}</span>
                                                <span className="flex-1 text-left">{lang.name}</span>
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Light Mode */}
                        <button
                            onClick={toggleTheme}
                            className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700/50 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 text-sm transition-colors"
                        >
                            <div className="flex items-center gap-2">
                                {isDark ? <Sun size={16} /> : <Moon size={16} />}
                                <span className="text-sm">{isDark ? t('dashboard.sidebar.items.theme_light') : t('dashboard.sidebar.items.theme_dark')}</span>
                            </div>
                            <div className={`w-10 h-5 rounded-full transition-colors ${!isDark ? 'bg-emerald-600' : 'bg-slate-600'} relative`}>
                                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${!isDark ? 'left-5' : 'left-0.5'}`} />
                            </div>
                        </button>
                    </div>
                )}

                {/* Collapsed Preferences */}
                {isCollapsed && (
                    <div className="p-4 border-t border-slate-100 dark:border-slate-700 space-y-2">
                        <button
                            onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                            className="w-full flex items-center justify-center p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700/50 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
                            title="Language"
                        >
                            <Languages size={18} />
                        </button>
                        <button
                            onClick={toggleTheme}
                            className="w-full flex items-center justify-center p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700/50 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
                            title="Light Mode"
                        >
                            {isDark ? <Sun size={18} /> : <Moon size={18} />}
                        </button>
                    </div>
                )}
            </aside>

            {/* Mobile Bottom Navigation */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-[#1e293b] border-t border-slate-100 dark:border-slate-700 p-1.5 z-[100] shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] pb-safe">
                <nav className="flex items-center justify-around max-w-md mx-auto">
                    {menuSections.menu.slice(0, 5).map((item) => {
                        const isActive = activeTab === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`flex flex-col items-center gap-0.5 p-1 px-2 rounded-xl transition-all duration-200 relative ${isActive
                                    ? 'text-emerald-500'
                                    : 'text-slate-500'
                                    }`}
                            >
                                {item.id === 'blog' && blogBadgeCount > 0 && (
                                    <span className="absolute top-0 right-2 w-4 h-4 bg-yellow-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-white dark:border-[#1e293b] animate-pulse">
                                        {blogBadgeCount}
                                    </span>
                                )}
                                <div className={`
                                    p-1 rounded-full transition-all duration-300
                                    ${isActive ? 'bg-emerald-600/10' : ''}
                                `}>
                                    <item.icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                                </div>
                                <span className="text-[9px] font-bold">{item.label}</span>
                            </button>
                        );
                    })}
                </nav>
            </div>
        </>
    );
};

export default DashboardSidebar;
