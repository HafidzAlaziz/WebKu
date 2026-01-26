import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle, AlertCircle, Sparkles, Code, Palette, Zap, Shield, HeadphonesIcon, Rocket } from 'lucide-react';
import emailjs from '@emailjs/browser';
import Navbar from '../components/Navbar';
import { useTranslation } from 'react-i18next';
import { useTracker } from '../hooks/useTracker';
import { formatCurrency } from '../utils/currencyUtils';

import SEO from '../components/SEO';

const OrderPage = () => {
    const { t, i18n } = useTranslation();
    const { trackOrder } = useTracker();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        company: '',
        package: 'starter',
        websiteType: '',
        techStack: '',
        message: '',
    });

    const [status, setStatus] = useState({
        loading: false,
        success: false,
        error: false,
        message: '',
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        // Clear error saat user mulai mengisi
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: '',
            });
        }
    };

    const validateForm = () => {
        const newErrors = {};

        // Validasi Nama
        if (!formData.name.trim()) {
            newErrors.name = t('order_page.form.validation.name_required');
        } else if (formData.name.trim().length < 3) {
            newErrors.name = t('order_page.form.validation.name_min');
        }

        // Validasi Email
        if (!formData.email.trim()) {
            newErrors.email = t('order_page.form.validation.email_required');
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = t('order_page.form.validation.email_invalid');
        }

        // Validasi WhatsApp
        const cleanPhone = formData.phone.replace(/[\s-]/g, '');
        if (!formData.phone.trim()) {
            newErrors.phone = t('order_page.form.validation.phone_required');
        } else if (!/^[0-9]+$/.test(cleanPhone)) {
            newErrors.phone = t('order_page.form.validation.phone_numeric');
        } else if (cleanPhone.length < 10) {
            newErrors.phone = t('order_page.form.validation.phone_min');
        } else if (cleanPhone.length > 15) {
            newErrors.phone = t('order_page.form.validation.phone_max');
        }

        // Validasi Jenis Website
        if (!formData.websiteType) {
            newErrors.websiteType = t('order_page.form.validation.type_required');
        }

        // Validasi Pesan/Deskripsi
        if (!formData.message.trim()) {
            newErrors.message = t('order_page.form.validation.message_required');
        } else if (formData.message.trim().length < 20) {
            newErrors.message = t('order_page.form.validation.message_min');
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validasi form
        const formErrors = validateForm();
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            setStatus({
                loading: false,
                success: false,
                error: true,
                message: t('order_page.form.validation.form_invalid'),
            });

            // Auto-focus ke input pertama yang error
            const firstErrorKey = Object.keys(formErrors)[0];
            const errorElement = document.getElementById(firstErrorKey);
            if (errorElement) {
                errorElement.focus();
                // Smooth scroll ke elemen yang error agar terlihat jelas
                errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }

        setErrors({});
        setStatus({ loading: true, success: false, error: false, message: '' });

        // Format data untuk WhatsApp
        const packageNames = {
            starter: t('order_page.form.options.package_starter'),
            professional: t('order_page.form.options.package_professional'),
            enterprise: t('order_page.form.options.package_enterprise')
        };

        const websiteTypes = {
            'landing-page': t('order_page.form.options.type_landing'),
            'company-profile': t('order_page.form.options.type_company'),
            'ecommerce': t('order_page.form.options.type_ecommerce'),
            'portfolio': t('order_page.form.options.type_portfolio'),
            'umkm': t('order_page.form.options.type_umkm'),
            'custom-system': t('order_page.form.options.type_custom'),
            'other': t('order_page.form.options.type_other')
        };

        // Buat pesan WhatsApp dengan emoji paling standar (High Compatibility)
        let waMessage = `✨ *WEB KUU - PREMIUM ORDER* ✨\n\n`;
        waMessage += `📝 *IDENTITAS PEMESAN:*\n`;
        waMessage += `Nama: ${formData.name}\n`;
        waMessage += `Email: ${formData.email}\n`;
        waMessage += `WhatsApp: ${formData.phone}\n`;
        if (formData.company) {
            waMessage += `Perusahaan: ${formData.company}\n`;
        }
        waMessage += `\n`;

        waMessage += `📦 *DETAIL PESANAN:*\n`;
        waMessage += `Paket: ${packageNames[formData.package]}\n`;
        waMessage += `Jenis Website: ${websiteTypes[formData.websiteType] || formData.websiteType}\n`;
        if (formData.techStack) {
            waMessage += `Tech Stack: ${formData.techStack}\n`;
        }
        waMessage += `\n`;

        waMessage += `🚀 *KEBUTUHAN KHUSUS:*\n`;
        waMessage += `${formData.message}\n`;
        waMessage += `\n`;
        waMessage += `-----------------------------------\n`;
        waMessage += `*Sent via WebKuu Official Form*`;

        // Encode untuk URL
        const encodedMessage = encodeURIComponent(waMessage);
        // Menggunakan api.whatsapp.com untuk kompatibilitas lebih baik di desktop
        const whatsappUrl = `https://api.whatsapp.com/send?phone=6285122959690&text=${encodedMessage}`;

        // Tampilkan success message sebentar sebelum redirect
        setStatus({
            loading: false,
            success: true,
            error: false,
            message: t('order_page.form.success.redirect'),
        });

        // Track Order
        trackOrder({
            customerName: formData.name,
            customerEmail: formData.email,
            customerPhone: formData.phone,
            customerCompany: formData.company,
            orderPackage: formData.package,
            orderType: formData.websiteType,
            techStack: formData.techStack,
            message: formData.message,
            total: formData.package === 'starter' ? 100000 : formData.package === 'professional' ? 1000000 : 0,
            status: 'pending'
        });

        // Redirect ke WhatsApp setelah 1.5 detik
        setTimeout(() => {
            window.open(whatsappUrl, '_blank');

            // Reset form setelah redirect
            setFormData({
                name: '',
                email: '',
                phone: '',
                company: '',
                package: 'starter',
                websiteType: '',
                techStack: '',
                message: '',
            });

            setStatus({
                loading: false,
                success: true,
                error: false,
                message: t('order_page.form.success.sent'),
            });
        }, 1500);
    };

    const advantages = [
        {
            icon: <Code className="w-6 h-6" />,
            title: t('order_page.advantages.items.tech_stack.title'),
            description: t('order_page.advantages.items.tech_stack.desc'),
            color: 'from-blue-500 to-cyan-500',
        },
        {
            icon: <Palette className="w-6 h-6" />,
            title: t('order_page.advantages.items.custom_design.title'),
            description: t('order_page.advantages.items.custom_design.desc'),
            color: 'from-purple-500 to-pink-500',
        },
        {
            icon: <Zap className="w-6 h-6" />,
            title: t('order_page.advantages.items.fast_delivery.title'),
            description: t('order_page.advantages.items.fast_delivery.desc'),
            color: 'from-yellow-500 to-orange-500',
        },
        {
            icon: <Shield className="w-6 h-6" />,
            title: t('order_page.advantages.items.warranty.title'),
            description: t('order_page.advantages.items.warranty.desc'),
            color: 'from-green-500 to-emerald-500',
        },
        {
            icon: <HeadphonesIcon className="w-6 h-6" />,
            title: t('order_page.advantages.items.support.title'),
            description: t('order_page.advantages.items.support.desc'),
            color: 'from-red-500 to-rose-500',
        },
        {
            icon: <Rocket className="w-6 h-6" />,
            title: t('order_page.advantages.items.seo.title'),
            description: t('order_page.advantages.items.seo.desc'),
            color: 'from-indigo-500 to-blue-500',
        },
    ];

    return (
        <>
            <SEO
                title={t('meta.order.title')}
                description={t('meta.order.description')}
                keywords={t('meta.order.keywords')}
            />
            <Navbar />
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-brand-emerald-50 to-brand-gold-50 dark:from-slate-900 dark:via-primary-dark dark:to-slate-900">
                {/* Decorative Background */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-brand-emerald-200 dark:bg-primary-light/10 rounded-full blur-3xl opacity-20 animate-pulse" />
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-gold-200 dark:bg-accent/10 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }} />
                </div>

                <div className="relative z-10 pt-24 pb-16">
                    <div className="container mx-auto px-6">
                        <div className="max-w-6xl mx-auto">
                            {/* Header */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-center mb-12"
                            >
                                <div className="inline-flex items-center gap-2 px-6 py-2 bg-brand-emerald-100 dark:bg-primary-dark/50 text-primary dark:text-brand-emerald-400 rounded-full text-sm font-bold mb-4 border border-brand-emerald-200 dark:border-primary-light/20">
                                    <Sparkles size={16} />
                                    {t('order_page.header.badge')}
                                </div>
                                <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white mb-6">
                                    {t('order_page.header.title_part1')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">{t('order_page.header.title_part2')}</span>
                                </h1>
                                <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
                                    {t('order_page.header.subtitle')}
                                </p>
                            </motion.div>

                            {/* Advantages Section */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="mb-16"
                            >
                                <h2 className="text-3xl font-bold text-slate-900 dark:text-white text-center mb-10 border-b-2 border-accent w-fit mx-auto pb-2">
                                    🌟 {t('order_page.advantages.title')}
                                </h2>
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {advantages.map((advantage, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.1 + index * 0.05 }}
                                            whileHover={{ y: -8 }}
                                            className="bg-white dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-slate-100 dark:border-slate-700 hover:shadow-2xl transition-all group"
                                        >
                                            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${advantage.color === 'from-blue-500 to-cyan-500' ? 'from-primary to-primary-light' : advantage.color === 'from-purple-500 to-pink-500' ? 'from-accent to-accent-light' : advantage.color === 'from-yellow-500 to-orange-500' ? 'from-brand-gold-600 to-brand-gold-400' : advantage.color === 'from-green-500 to-emerald-500' ? 'from-brand-emerald-700 to-brand-emerald-500' : 'from-slate-700 to-slate-500'} flex items-center justify-center text-white mb-6 group-hover:rotate-6 transition-transform shadow-lg`}>
                                                {advantage.icon}
                                            </div>
                                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{advantage.title}</h3>
                                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{advantage.description}</p>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Form Card */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-700 overflow-hidden"
                            >
                                {/* Form Header */}
                                <div className="bg-gradient-to-r from-primary via-primary-light to-primary-dark p-10 text-white relative">
                                    <h2 className="text-3xl font-bold mb-3 flex items-center gap-3">
                                        <Rocket className="text-accent" />
                                        {t('order_page.form.title')}
                                    </h2>
                                    <p className="text-brand-emerald-50 text-lg opacity-90">{t('order_page.form.subtitle')}</p>
                                    <div className="absolute top-0 right-0 p-10 opacity-10">
                                        <Sparkles size={120} />
                                    </div>
                                </div>

                                <form onSubmit={handleSubmit} noValidate className="p-8 md:p-16 space-y-8">
                                    {/* Nama Lengkap */}
                                    <div>
                                        <label htmlFor="name" className="block text-base font-bold text-slate-700 dark:text-slate-200 mb-3">
                                            {t('order_page.form.labels.name')} <span className="text-accent">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            className={`w-full px-5 py-4 rounded-xl border-2 ${errors.name
                                                ? 'border-red-500'
                                                : 'border-slate-100 dark:border-slate-700'
                                                } dark:bg-slate-900 dark:text-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-lg`}
                                            placeholder={t('order_page.form.placeholders.name')}
                                        />
                                        {errors.name && (
                                            <p className="mt-2 text-sm text-red-500 font-medium flex items-center gap-1">
                                                <AlertCircle size={14} />
                                                {errors.name}
                                            </p>
                                        )}
                                    </div>

                                    {/* Email & Phone */}
                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div>
                                            <label htmlFor="email" className="block text-base font-bold text-slate-700 dark:text-slate-200 mb-3">
                                                {t('order_page.form.labels.email')} <span className="text-accent">*</span>
                                            </label>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                                className={`w-full px-5 py-4 rounded-xl border-2 ${errors.email
                                                    ? 'border-red-500'
                                                    : 'border-slate-100 dark:border-slate-700'
                                                    } dark:bg-slate-900 dark:text-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-lg`}
                                                placeholder={t('order_page.form.placeholders.email')}
                                            />
                                            {errors.email && (
                                                <p className="mt-2 text-sm text-red-500 font-medium flex items-center gap-1">
                                                    <AlertCircle size={14} />
                                                    {errors.email}
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <label htmlFor="phone" className="block text-base font-bold text-slate-700 dark:text-slate-200 mb-3">
                                                {t('order_page.form.labels.phone')} <span className="text-accent">*</span>
                                            </label>
                                            <input
                                                type="tel"
                                                id="phone"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                required
                                                className={`w-full px-5 py-4 rounded-xl border-2 ${errors.phone
                                                    ? 'border-red-500'
                                                    : 'border-slate-100 dark:border-slate-700'
                                                    } dark:bg-slate-900 dark:text-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-lg`}
                                                placeholder={t('order_page.form.placeholders.phone')}
                                            />
                                            {errors.phone && (
                                                <p className="mt-2 text-sm text-red-500 font-medium flex items-center gap-1">
                                                    <AlertCircle size={14} />
                                                    {errors.phone}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Nama Perusahaan */}
                                    <div>
                                        <label htmlFor="company" className="block text-base font-bold text-slate-700 dark:text-slate-200 mb-3">
                                            {t('order_page.form.labels.company')}
                                        </label>
                                        <input
                                            type="text"
                                            id="company"
                                            name="company"
                                            value={formData.company}
                                            onChange={handleChange}
                                            className="w-full px-5 py-4 rounded-xl border-2 border-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-lg"
                                            placeholder={t('order_page.form.placeholders.company')}
                                        />
                                    </div>

                                    {/* Paket & Jenis Website */}
                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div>
                                            <label htmlFor="package" className="block text-base font-bold text-slate-700 dark:text-slate-200 mb-3">
                                                {t('order_page.form.labels.package')} <span className="text-accent">*</span>
                                            </label>
                                            <div className="relative">
                                                <select
                                                    id="package"
                                                    name="package"
                                                    value={formData.package}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full px-5 py-4 rounded-xl border-2 border-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-lg appearance-none cursor-pointer"
                                                >
                                                    <option value="starter">
                                                        {t('order_page.form.options.package_starter')} - {formatCurrency(100000, i18n.language, t)}
                                                    </option>
                                                    <option value="professional">
                                                        {t('order_page.form.options.package_professional')} - {formatCurrency(1000000, i18n.language, t)}
                                                    </option>
                                                    <option value="enterprise">
                                                        {t('order_page.form.options.package_enterprise')} - {formatCurrency('discussion', i18n.language, t)}
                                                    </option>
                                                </select>
                                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                                    <Zap size={20} />
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="websiteType" className="block text-base font-bold text-slate-700 dark:text-slate-200 mb-3">
                                                {t('order_page.form.labels.website_type')} <span className="text-accent">*</span>
                                            </label>
                                            <div className="relative">
                                                <select
                                                    id="websiteType"
                                                    name="websiteType"
                                                    value={formData.websiteType}
                                                    onChange={handleChange}
                                                    className={`w-full px-5 py-4 rounded-xl border-2 ${errors.websiteType
                                                        ? 'border-red-500'
                                                        : 'border-slate-100 dark:border-slate-700'
                                                        } dark:bg-slate-900 dark:text-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-lg appearance-none cursor-pointer`}
                                                >
                                                    <option value="">{t('order_page.form.placeholders.website_type')}</option>
                                                    <option value="landing-page">{t('order_page.form.options.type_landing')}</option>
                                                    <option value="company-profile">{t('order_page.form.options.type_company')}</option>
                                                    <option value="ecommerce">{t('order_page.form.options.type_ecommerce')}</option>
                                                    <option value="portfolio">{t('order_page.form.options.type_portfolio')}</option>
                                                    <option value="umkm">{t('order_page.form.options.type_umkm')}</option>
                                                    <option value="custom-system">{t('order_page.form.options.type_custom')}</option>
                                                    <option value="other">{t('order_page.form.options.type_other')}</option>
                                                </select>
                                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                                    <Palette size={20} />
                                                </div>
                                            </div>
                                            {errors.websiteType && (
                                                <p className="mt-2 text-sm text-red-500 font-medium flex items-center gap-1">
                                                    <AlertCircle size={14} />
                                                    {errors.websiteType}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Tech Stack */}
                                    <div>
                                        <label htmlFor="techStack" className="block text-base font-bold text-slate-700 dark:text-slate-200 mb-3">
                                            {t('order_page.form.labels.tech_stack')}
                                        </label>
                                        <div className="relative">
                                            <select
                                                id="techStack"
                                                name="techStack"
                                                value={formData.techStack}
                                                onChange={handleChange}
                                                className="w-full px-5 py-4 rounded-xl border-2 border-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-lg appearance-none cursor-pointer"
                                            >
                                                <option value="">{t('order_page.form.placeholders.tech_stack')}</option>
                                                <option value="react">{t('order_page.form.options.tech_react')}</option>
                                                <option value="nextjs">{t('order_page.form.options.tech_next')}</option>
                                                <option value="vue">{t('order_page.form.options.tech_vue')}</option>
                                                <option value="wordpress">{t('order_page.form.options.tech_wordpress')}</option>
                                                <option value="laravel">{t('order_page.form.options.tech_laravel')}</option>
                                                <option value="html-css-js">{t('order_page.form.options.tech_html')}</option>
                                                <option value="other">{t('order_page.form.options.tech_other')}</option>
                                            </select>
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                                <Code size={20} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Pesan */}
                                    <div>
                                        <label htmlFor="message" className="block text-base font-bold text-slate-700 dark:text-slate-200 mb-3">
                                            {t('order_page.form.labels.message')} <span className="text-accent">*</span>
                                        </label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            rows="6"
                                            className={`w-full px-6 py-5 rounded-2xl border-2 ${errors.message
                                                ? 'border-red-500'
                                                : 'border-slate-100 dark:border-slate-700'
                                                } dark:bg-slate-900 dark:text-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all resize-none text-lg`}
                                            placeholder={t('order_page.form.placeholders.message')}
                                        />
                                        {errors.message && (
                                            <p className="mt-2 text-sm text-red-500 font-medium flex items-center gap-1">
                                                <AlertCircle size={14} />
                                                {errors.message}
                                            </p>
                                        )}
                                    </div>

                                    {/* Status Messages */}
                                    {status.message && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className={`p-6 rounded-2xl flex items-center gap-4 ${status.success
                                                ? 'bg-brand-emerald-50 dark:bg-primary-dark/30 text-primary dark:text-brand-emerald-400 border border-brand-emerald-200 dark:border-primary-light/20'
                                                : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800'
                                                }`}
                                        >
                                            {status.success ? <CheckCircle className="shrink-0 text-primary" size={28} /> : <AlertCircle className="shrink-0 text-red-500" size={28} />}
                                            <p className="font-bold text-lg">{status.message}</p>
                                        </motion.div>
                                    )}

                                    {/* Submit Button */}
                                    <motion.button
                                        whileHover={{ scale: 1.02, backgroundColor: '#065f46' }}
                                        whileTap={{ scale: 0.98 }}
                                        type="submit"
                                        disabled={status.loading}
                                        className={`w-full py-5 rounded-2xl font-extrabold text-xl text-white shadow-2xl transition-all ${status.loading
                                            ? 'bg-slate-400 cursor-not-allowed'
                                            : 'bg-gradient-to-r from-primary via-primary-light to-primary-dark hover:shadow-primary/40'
                                            }`}
                                    >
                                        {status.loading ? (
                                            <span className="flex items-center justify-center gap-3">
                                                <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                {t('order_page.form.submit.processing')}
                                            </span>
                                        ) : (
                                            <span className="flex items-center justify-center gap-3">
                                                <Send size={24} />
                                                {t('order_page.form.submit.default')}
                                            </span>
                                        )}
                                    </motion.button>
                                </form>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default OrderPage;
