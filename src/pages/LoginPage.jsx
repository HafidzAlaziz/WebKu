import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock, User, ArrowRight, CheckCircle2, AlertCircle, Mail } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import SEO from '../components/SEO';

// Hardcoded for synchronous checking on login, matching AuthContext
const ADMIN_EMAILS = ['admin@webkuu.com', 'hafidz@webkuu.com', 'web.kuu3@gmail.com'];
const LoginPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const redirectPath = searchParams.get('redirect') || '/dashboard';
    const { signInWithGoogle } = useAuth();

    const [error, setError] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleGoogleLogin = async () => {
        setError('');
        setIsSubmitting(true);
        try {
            const { error, user } = await signInWithGoogle();
            if (error) {
                throw error;
            }
            // If login is successful, show success message and redirect
            setShowSuccess(true);
            setTimeout(() => {
                setShowSuccess(false);
                navigate(redirectPath);
            }, 2000); // Show success for 2 seconds
        } catch (err) {
            setError(err.message);
            setIsSubmitting(false);
        }
    };


    return (
        <>
            <SEO noindex={true} title="Login Admin - WebKu" />
            <div className="relative min-h-screen bg-slate-50 dark:bg-[#020617] flex items-center justify-center px-4 overflow-hidden">
                {/* Premium Background Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            rotate: [0, 90, 0],
                            x: [-20, 20, -20],
                            y: [-20, 20, -20],
                        }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-emerald-500/10 dark:bg-emerald-600/20 rounded-full blur-[120px]"
                    />
                    <motion.div
                        animate={{
                            scale: [1, 1.3, 1],
                            rotate: [0, -90, 0],
                            x: [20, -20, 20],
                            y: [20, -20, 20],
                        }}
                        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                        className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-emerald-500/10 dark:bg-emerald-600/20 rounded-full blur-[120px]"
                    />
                </div>

                {/* Success Notification Pop-up */}
                <AnimatePresence>
                    {showSuccess && (
                        <motion.div
                            initial={{ opacity: 0, y: -20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.95 }}
                            className="fixed top-8 z-[100] flex items-center gap-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-emerald-500/20 dark:border-emerald-500/30 text-slate-900 dark:text-white px-6 py-4 rounded-2xl shadow-[0_20px_50px_rgba(16,185,129,0.15)]"
                        >
                            <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white">
                                <CheckCircle2 size={24} />
                            </div>
                            <div>
                                <p className="font-bold text-lg leading-tight">{t('login.success_title') || "Berhasil!"}</p>
                                <p className="text-slate-500 dark:text-slate-400 text-sm">
                                    {t('login.success_message') || "Login berhasil! Mengalihkan ke dashboard..."}
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="max-w-[440px] w-full relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="group"
                    >
                        {/* Main Card with Glassmorphism */}
                        <div className="relative bg-white/70 dark:bg-slate-900/40 backdrop-blur-2xl rounded-3xl p-8 md:p-10 border border-slate-200/50 dark:border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)] overflow-hidden transition-all duration-500 group-hover:shadow-[0_20px_60px_rgba(0,0,0,0.1)] dark:group-hover:shadow-[0_20px_60px_rgba(0,0,0,0.6)] group-hover:-translate-y-1">

                            {/* Decorative Gradient Line */}
                            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brand-emerald-400 via-brand-emerald-500 to-brand-emerald-600 opacity-80" />

                            <div className="text-center mb-10">
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-tr from-brand-emerald-600 to-emerald-700 text-white shadow-lg shadow-emerald-500/25 mb-6 rotate-3 transform transition-transform group-hover:rotate-0"
                                >
                                    <Lock size={40} />
                                </motion.div>
                                <motion.h2
                                    initial={{ y: 10, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                    className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight"
                                >
                                    {t('Admin Login') || "Admin Access"}
                                </motion.h2>
                                <motion.p
                                    initial={{ y: 10, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.4 }}
                                    className="text-slate-500 dark:text-slate-400 mt-3 text-lg"
                                >
                                    {t('Enter your credentials to access dashboard') || "Sign in with your admin account"}
                                </motion.p>
                            </div>

                            <div className="space-y-6">
                                <motion.button
                                    initial={{ y: 10, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                    onClick={handleGoogleLogin}
                                    disabled={showSuccess || isSubmitting}
                                    className="w-full flex items-center justify-center gap-4 py-4.5 px-6 bg-white dark:bg-white text-slate-900 rounded-2xl border border-slate-200 dark:border-transparent transition-all shadow-sm hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] group/btn relative overflow-hidden h-[64px]"
                                >
                                    <div className="absolute inset-0 bg-slate-900/5 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                                    <img src="https://www.google.com/favicon.ico" alt="Google" className="w-6 h-6 z-10" />
                                    <span className="text-lg font-bold tracking-tight z-10">
                                        {t('login.continue_with_google') || "Lanjutkan dengan Google"}
                                    </span>
                                </motion.button>

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
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Footer link */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7 }}
                            className="text-center mt-8"
                        >
                            <p className="text-slate-500 dark:text-slate-500 text-sm">
                                &copy; {new Date().getFullYear()} WebKu Portal • Protected Access
                            </p>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </>
    );
};

export default LoginPage;
