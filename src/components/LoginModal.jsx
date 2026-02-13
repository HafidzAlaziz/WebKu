import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

const LoginModal = ({ isOpen, onClose }) => {
    const { t } = useTranslation();
    const { signInWithGoogle } = useAuth();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    if (!isOpen) return null;


    const handleGoogleLogin = async () => {
        setLoading(true);
        setError('');
        try {
            const { error } = await signInWithGoogle();
            if (error) throw error;

            setSuccess(true);
            setTimeout(() => {
                onClose();
            }, 1000);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };


    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-md p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    onClick={(e) => e.stopPropagation()}
                    className="relative w-full max-w-md"
                >
                    <div className="bg-white/90 dark:bg-slate-900/80 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] overflow-hidden border border-white/20 dark:border-white/5">
                        {/* Top Gradient Bar */}
                        <div className="h-2 w-full bg-gradient-to-r from-brand-emerald-400 via-brand-emerald-500 to-brand-emerald-600" />

                        <div className="p-8 md:p-10">
                            {/* Header */}
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                                        {t('blog.login_to_write') || "Join the Discussion"}
                                    </h2>
                                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-base">
                                        {t('login.subtitle') || "Sign in with Google to continue"}
                                    </p>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all hover:rotate-90"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="space-y-6">
                                <button
                                    onClick={handleGoogleLogin}
                                    disabled={loading || success}
                                    className="w-full flex items-center justify-center gap-4 py-4.5 px-6 bg-white dark:bg-white text-slate-900 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all group relative overflow-hidden h-[64px]"
                                >
                                    <div className="absolute inset-0 bg-slate-900/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <img src="https://www.google.com/favicon.ico" alt="Google" className="w-6 h-6 z-10" />
                                    <span className="text-lg font-bold tracking-tight z-10">
                                        {t('login.continue_with_google') || "Lanjutkan dengan Google"}
                                    </span>
                                </button>

                                <AnimatePresence mode="wait">
                                    {error && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0, y: -10 }}
                                            animate={{ opacity: 1, height: 'auto', y: 0 }}
                                            exit={{ opacity: 0, height: 0, y: -10 }}
                                            className="p-4 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm rounded-2xl flex items-center gap-3 font-medium"
                                        >
                                            <AlertCircle size={20} className="shrink-0" />
                                            <p>{error}</p>
                                        </motion.div>
                                    )}
                                    {success && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0, y: -10 }}
                                            animate={{ opacity: 1, height: 'auto', y: 0 }}
                                            className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm rounded-2xl flex items-center gap-3 font-medium"
                                        >
                                            <CheckCircle2 size={20} className="shrink-0" />
                                            <p>Berhasil! Mengalihkan...</p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default LoginModal;
