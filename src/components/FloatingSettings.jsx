import React, { useState, useEffect } from 'react';
import { FaSun, FaMoon, FaGlobe } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

const FloatingSettings = () => {
    const { i18n } = useTranslation();
    const location = useLocation();
    const [isDark, setIsDark] = useState(false);
    const [showLanguages, setShowLanguages] = useState(false);

    const languages = [
        { code: 'id', label: 'ID', flag: '🇮🇩' },
        { code: 'en', label: 'EN', flag: '🇬🇧' },
        { code: 'es', label: 'ES', flag: '🇪🇸' },
        { code: 'fr', label: 'FR', flag: '🇫🇷' },
        { code: 'ja', label: 'JA', flag: '🇯🇵' }
    ];

    useEffect(() => {
        // Check initial dark mode state
        const isDarkMode = document.documentElement.classList.contains('dark');
        setIsDark(isDarkMode);
    }, []);

    const toggleDarkMode = () => {
        document.documentElement.classList.toggle('dark');
        setIsDark(!isDark);
    };

    const changeLanguage = (langCode) => {
        i18n.changeLanguage(langCode);
        localStorage.setItem('i18nextLng', langCode);
        setShowLanguages(false);
    };

    const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

    // Show on blog list and blog detail pages
    if (!location.pathname.startsWith('/blog')) {
        return null;
    }

    return (
        <div className="fixed bottom-6 left-6 z-50 flex flex-col-reverse gap-3">
            {/* Language Selector */}
            <div className="relative">
                {showLanguages && (
                    <div className="absolute bottom-full mb-2 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                        {languages.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => changeLanguage(lang.code)}
                                className={`w-full px-4 py-2 text-left hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-2 ${i18n.language === lang.code ? 'bg-blue-50 dark:bg-slate-700' : ''
                                    }`}
                            >
                                <span className="text-xl">{lang.flag}</span>
                                <span className="font-medium text-slate-700 dark:text-slate-200">{lang.label}</span>
                            </button>
                        ))}
                    </div>
                )}
                <button
                    onClick={() => setShowLanguages(!showLanguages)}
                    className="w-14 h-14 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center border border-slate-200 dark:border-slate-700 hover:scale-110"
                    title="Change Language"
                >
                    <div className="flex flex-col items-center">
                        <FaGlobe size={20} />
                        <span className="text-xs font-bold mt-0.5">{currentLanguage.label}</span>
                    </div>
                </button>
            </div>

            {/* Dark Mode Toggle */}
            <button
                onClick={toggleDarkMode}
                className="w-14 h-14 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center border border-slate-200 dark:border-slate-700 hover:scale-110"
                title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
                {isDark ? <FaSun size={24} className="text-yellow-400" /> : <FaMoon size={24} className="text-slate-600" />}
            </button>
        </div>
    );
};

export default FloatingSettings;
