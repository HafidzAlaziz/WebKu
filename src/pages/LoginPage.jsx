import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock, User, ArrowRight, CheckCircle2, AlertCircle, Mail } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

// Hardcoded for synchronous checking on login, matching AuthContext
const ADMIN_EMAILS = ['admin@webkuu.com', 'hafidz@webkuu.com', 'web.kuu3@gmail.com'];

const LoginPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const redirectPath = searchParams.get('redirect') || '/dashboard';
    const { signIn, signInWithGoogle } = useAuth();

    // Admin Login only - No Sign Up
    const isSignUp = false;

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleGoogleLogin = async () => {
        setError('');
        setIsSubmitting(true);
        try {
            const { error } = await signInWithGoogle();
            if (error) throw error;
            // Redirect depends on AuthContext logic or automatic
        } catch (err) {
            setError(err.message);
            setIsSubmitting(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.email.trim()) {
            setError(t('login.error_empty_username') || "Email is required");
            return;
        }

        if (!formData.password.trim()) {
            setError(t('login.error_empty_password'));
            return;
        }

        setIsSubmitting(true);

        try {
            const { error: signInError, data } = await signIn(formData.email, formData.password);
            if (signInError) throw signInError;

            setShowSuccess(true);

            // Determine redirect path based on role
            const isUserAdmin = data.user && ADMIN_EMAILS.includes(data.user.email);
            const targetPath = isUserAdmin ? '/dashboard' : '/blog'; // If not admin, go to blog

            setTimeout(() => {
                navigate(targetPath);
            }, 1000);
        } catch (err) {
            setError(err.message);
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center px-4 overflow-hidden">
            {/* Success Notification Pop-up */}
            <AnimatePresence>
                {showSuccess && (
                    <motion.div
                        initial={{ opacity: 0, x: 100, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 100, scale: 0.9 }}
                        className="fixed top-6 right-6 z-50 flex items-center gap-4 bg-emerald-500 text-white px-6 py-4 rounded-2xl shadow-2xl shadow-emerald-500/20"
                    >
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                            <CheckCircle2 size={24} />
                        </div>
                        <div>
                            <p className="font-bold text-lg leading-tight">{t('login.success_title')}</p>
                            <p className="text-white/90 text-sm">
                                {t('login.success_message')}
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="max-w-md w-full">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden"
                >
                    <div className="p-8">
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mb-4">
                                <Lock size={32} />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                                {t('Admin Login')}
                            </h2>
                            <p className="text-slate-500 dark:text-slate-400 mt-2">
                                {t('Enter your credentials to access dashboard')}
                            </p>
                        </div>

                        <button
                            onClick={handleGoogleLogin}
                            disabled={showSuccess || isSubmitting}
                            className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white border border-slate-300 dark:border-slate-600 rounded-xl hover:bg-slate-50 dark:bg-slate-700 dark:hover:bg-slate-600 transition-all shadow-sm hover:shadow-md group mb-6"
                        >
                            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                            <span className="font-bold text-slate-700 dark:text-white">
                                {t('login.continue_with_google') || "Continue with Google"}
                            </span>
                        </button>

                        <div className="relative flex justify-center text-xs mb-6">
                            <div className="absolute inset-x-0 top-1/2 h-px bg-slate-200 dark:bg-slate-700"></div>
                            <span className="relative bg-white dark:bg-slate-800 px-2 text-slate-400">Or use email</span>
                        </div>

                        <form onSubmit={handleSubmit} noValidate className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Email
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                        <Mail size={20} />
                                    </div>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        disabled={showSuccess || isSubmitting}
                                        className={`block w-full pl-10 pr-3 py-2.5 bg-slate-50 dark:bg-slate-900 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white transition-all outline-none ${error && !formData.email.trim() ? 'border-red-500 shadow-sm shadow-red-500/10' : 'border-slate-200 dark:border-slate-700'
                                            }`}
                                        placeholder="your@email.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    {t('login.password')}
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                        <Lock size={20} />
                                    </div>
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        disabled={showSuccess || isSubmitting}
                                        className={`block w-full pl-10 pr-3 py-2.5 bg-slate-50 dark:bg-slate-900 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white transition-all outline-none ${error && !formData.password.trim() ? 'border-red-500 shadow-sm shadow-red-500/10' : 'border-slate-200 dark:border-slate-700'
                                            }`}
                                        placeholder={t('login.password_placeholder')}
                                    />
                                </div>
                            </div>

                            <AnimatePresence mode="wait">
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 text-sm rounded-lg flex items-center gap-2 font-medium"
                                    >
                                        <AlertCircle size={16} />
                                        {error}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <button
                                type="submit"
                                disabled={showSuccess || isSubmitting}
                                className={`w-full py-3 px-4 rounded-lg font-semibold shadow-lg transition-all flex items-center justify-center gap-2 ${showSuccess
                                    ? 'bg-emerald-500 text-white shadow-emerald-500/30 cursor-default'
                                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/30 active:scale-[0.98]'
                                    } disabled:opacity-70 disabled:cursor-not-allowed`}
                            >
                                {isSubmitting ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        <span>{t('common.loading')}</span>
                                    </div>
                                ) : showSuccess ? (
                                    <CheckCircle2 size={20} />
                                ) : (
                                    <>
                                        {t('login.submit')}
                                        <ArrowRight size={20} />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default LoginPage;
