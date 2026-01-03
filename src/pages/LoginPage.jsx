import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

const LoginPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
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

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        // Custom validation for empty fields
        if (!formData.username.trim()) {
            setError(t('login.error_empty_username'));
            return;
        }

        if (!formData.password.trim()) {
            setError(t('login.error_empty_password'));
            return;
        }

        setIsSubmitting(true);

        // Simulate a small delay for better feel
        setTimeout(() => {
            // Hardcoded simple auth logic
            if (formData.username !== 'admin') {
                setError(t('login.error_user_not_found'));
                setIsSubmitting(false);
            } else if (formData.password !== 'admin123') {
                setError(t('login.error_wrong_password'));
                setIsSubmitting(false);
            } else {
                setShowSuccess(true);
                sessionStorage.setItem('isAuthenticated', 'true');

                // Delay redirect to show the success message
                setTimeout(() => {
                    navigate('/dashboard');
                }, 2000);
            }
        }, 600);
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
                                {t('login.title')}
                            </h2>
                            <p className="text-slate-500 dark:text-slate-400 mt-2">
                                {t('login.subtitle')}
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} noValidate className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    {t('login.username')}
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                        <User size={20} />
                                    </div>
                                    <input
                                        type="text"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        disabled={showSuccess || isSubmitting}
                                        className={`block w-full pl-10 pr-3 py-2.5 bg-slate-50 dark:bg-slate-900 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white transition-all outline-none ${error && !formData.username.trim() ? 'border-red-500 shadow-sm shadow-red-500/10' : 'border-slate-200 dark:border-slate-700'
                                            }`}
                                        placeholder={t('login.username_placeholder')}
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
