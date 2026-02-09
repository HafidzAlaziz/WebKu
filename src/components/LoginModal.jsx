import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

const LoginModal = ({ isOpen, onClose }) => {
    const { t } = useTranslation();
    const { signIn, signUp, signInWithGoogle } = useAuth();
    const [isEmailLogin, setIsEmailLogin] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    if (!isOpen) return null;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        setError('');
        try {
            const { error } = await signInWithGoogle();
            if (error) throw error;
            // Redirect happens automatically
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isSignUp) {
                const { error } = await signUp(formData.email, formData.password);
                if (error) throw error;
                setSuccess(true);
                setTimeout(() => {
                    onClose(); // Close modal on success (and user is logged in)
                    window.location.reload(); // Refresh to update auth state if needed, or AuthContext handles it
                }, 1500);
            } else {
                const { error } = await signIn(formData.email, formData.password);
                if (error) throw error;
                setSuccess(true);
                setTimeout(() => {
                    onClose();
                }, 1000);
            }
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
                className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4"
                onClick={onClose}
            >
                <div onClick={(e) => e.stopPropagation()} className="relative w-full max-w-md">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-6 pb-0 flex justify-between items-start">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                                {t('blog.login_to_write') || "Login to Write Article"}
                            </h2>
                            <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                                <X size={20} className="text-slate-500" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            {/* Google Login Button */}
                            {!isEmailLogin && (
                                <div className="space-y-4">
                                    <button
                                        onClick={handleGoogleLogin}
                                        disabled={loading}
                                        className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white border border-slate-300 dark:border-slate-600 rounded-xl hover:bg-slate-50 dark:bg-slate-700 dark:hover:bg-slate-600 transition-all shadow-sm hover:shadow-md group"
                                    >
                                        <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                                        <span className="font-bold text-slate-700 dark:text-white">
                                            {t('login.continue_with_google') || "Continue with Google"}
                                        </span>
                                    </button>

                                    <div className="relative flex justify-center text-xs">
                                        <div className="absolute inset-x-0 top-1/2 h-px bg-slate-200 dark:bg-slate-700"></div>
                                        <span className="relative bg-white dark:bg-slate-800 px-2 text-slate-400">Or</span>
                                    </div>

                                    <button
                                        onClick={() => setIsEmailLogin(true)}
                                        className="w-full py-3 px-4 rounded-xl font-bold text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20 transition-all"
                                    >
                                        Use Email & Password
                                    </button>
                                </div>
                            )}

                            {/* Email Login Form */}
                            {isEmailLogin && (
                                <form onSubmit={handleEmailSubmit} className="space-y-4">
                                    {error && (
                                        <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg flex items-center gap-2">
                                            <AlertCircle size={16} />
                                            {error}
                                        </div>
                                    )}

                                    {success && (
                                        <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-sm rounded-lg flex items-center gap-2">
                                            <CheckCircle2 size={16} />
                                            Success!
                                        </div>
                                    )}

                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 mb-1">Email</label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                                                    placeholder="your@email.com"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 mb-1">Password</label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                                <input
                                                    type="password"
                                                    name="password"
                                                    value={formData.password}
                                                    onChange={handleChange}
                                                    className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                                                    placeholder="••••••••"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading || success}
                                        className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 relative overflow-hidden"
                                    >
                                        {loading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                                        {isSignUp ? "Sign Up" : "Login"}
                                    </button>

                                    <div className="flex justify-between items-center text-sm">
                                        <button
                                            type="button"
                                            onClick={() => setIsEmailLogin(false)}
                                            className="text-slate-500 hover:text-slate-700 dark:text-slate-400"
                                        >
                                            &larr; Back
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setIsSignUp(!isSignUp)}
                                            className="text-blue-600 font-bold hover:underline"
                                        >
                                            {isSignUp ? "Have an account? Login" : "No account? Sign Up"}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default LoginModal;
