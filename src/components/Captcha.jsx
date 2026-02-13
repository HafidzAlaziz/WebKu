import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ShieldCheck, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Captcha = ({ onVerify, error }) => {
    const { t } = useTranslation();
    const [status, setStatus] = useState('idle'); // idle, verifying, verified

    const handleVerify = () => {
        if (status !== 'idle') return;

        setStatus('verifying');

        // Simulasikan verifikasi dengan delay sedikit (biar terasa beneran)
        setTimeout(() => {
            setStatus('verified');
            if (onVerify) onVerify(true);
        }, 1500);
    };

    return (
        <div className="space-y-2">
            <div
                onClick={handleVerify}
                className={`flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 border-2 rounded-2xl cursor-pointer transition-all ${status === 'verified'
                        ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/20'
                        : error
                            ? 'border-red-500'
                            : 'border-slate-100 dark:border-slate-700 hover:border-primary/50'
                    }`}
            >
                <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${status === 'verified'
                            ? 'bg-emerald-500 text-white'
                            : status === 'verifying'
                                ? 'bg-primary/10 text-primary'
                                : 'bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-600'
                        }`}>
                        {status === 'verifying' ? (
                            <Loader2 size={18} className="animate-spin" />
                        ) : status === 'verified' ? (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                            >
                                <Check size={18} />
                            </motion.div>
                        ) : null}
                    </div>

                    <div className="flex flex-col">
                        <span className={`font-bold text-sm ${status === 'verified'
                                ? 'text-emerald-700 dark:text-emerald-400'
                                : 'text-slate-700 dark:text-slate-200'
                            }`}>
                            {status === 'verifying'
                                ? t('common.captcha.verifying')
                                : status === 'verified'
                                    ? t('common.captcha.verified')
                                    : t('common.captcha.label')}
                        </span>
                        {status === 'idle' && (
                            <span className="text-[10px] text-slate-400 font-medium">
                                {t('common.captcha.help_text')}
                            </span>
                        )}
                    </div>
                </div>

                <div className="flex flex-col items-end opacity-40">
                    <ShieldCheck size={24} className={status === 'verified' ? 'text-emerald-500' : 'text-slate-400'} />
                    <span className="text-[8px] font-black tracking-tighter uppercase mt-1">WebKuu Verify</span>
                </div>
            </div>

            {error && !status === 'verified' && (
                <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs text-red-500 font-bold flex items-center gap-1 pl-2"
                >
                    {t('common.captcha.error')}
                </motion.p>
            )}
        </div>
    );
};

export default Captcha;
