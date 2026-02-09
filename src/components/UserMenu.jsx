import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, LogOut, FileText, ChevronDown, PenTool } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const UserMenu = ({ onWriteClick, onMyArticlesClick }) => {
    const { t } = useTranslation();
    const { user, signOut } = useAuth();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = async () => {
        await signOut();
        setIsOpen(false);
        navigate(0); // Refresh/Reload page to clear state clearly or just re-render
    };

    if (!user) return null;

    // Get display name or email part
    const displayName = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'User';
    const avatarUrl = user.user_metadata?.avatar_url || user.user_metadata?.picture;
    const [imgError, setImgError] = useState(false);

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all group"
            >
                {/* Avatar */}
                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden border border-slate-200 dark:border-slate-600 flex items-center justify-center">
                    {avatarUrl && !imgError ? (
                        <img
                            src={avatarUrl}
                            alt={displayName}
                            className="w-full h-full object-cover"
                            onError={() => setImgError(true)}
                        />
                    ) : (
                        <User size={16} className="text-slate-500 dark:text-slate-400" />
                    )}
                </div>

                {/* Name */}
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200 max-w-[100px] truncate hidden sm:block">
                    {displayName}
                </span>

                <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden z-50"
                    >
                        <div className="p-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                            <p className="text-sm font-bold text-slate-800 dark:text-white truncate">
                                {displayName}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                {user.email}
                            </p>
                        </div>

                        <div className="p-2 space-y-1">
                            <button
                                onClick={() => {
                                    onWriteClick();
                                    setIsOpen(false);
                                }}
                                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg transition-colors text-left"
                            >
                                <PenTool size={16} className="text-blue-500" />
                                {t('blog.write_article') || "Write Article"}
                            </button>

                            <button
                                onClick={() => {
                                    onMyArticlesClick();
                                    setIsOpen(false);
                                }}
                                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg transition-colors text-left"
                            >
                                <FileText size={16} className="text-emerald-500" />
                                {t('blog.my_articles') || "My Articles"}
                            </button>
                        </div>

                        <div className="p-2 border-t border-slate-100 dark:border-slate-700">
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-left font-medium"
                            >
                                <LogOut size={16} />
                                {t('blog.logout') || "Logout"}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default UserMenu;
