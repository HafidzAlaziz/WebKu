import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle, AlertCircle, Sparkles, Code, Palette, Zap, Shield, HeadphonesIcon, Rocket } from 'lucide-react';
import emailjs from '@emailjs/browser';
import Navbar from '../components/Navbar';

const OrderPage = () => {
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
            newErrors.name = 'Nama lengkap wajib diisi';
        } else if (formData.name.trim().length < 3) {
            newErrors.name = 'Nama minimal 3 karakter';
        }

        // Validasi Email
        if (!formData.email.trim()) {
            newErrors.email = 'Email wajib diisi';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Format email tidak valid (contoh: nama@gmail.com)';
        }

        // Validasi WhatsApp
        const cleanPhone = formData.phone.replace(/[\s-]/g, '');
        if (!formData.phone.trim()) {
            newErrors.phone = 'Nomor WhatsApp wajib diisi';
        } else if (!/^[0-9]+$/.test(cleanPhone)) {
            newErrors.phone = 'Nomor WhatsApp hanya boleh berisi angka';
        } else if (cleanPhone.length < 10) {
            newErrors.phone = 'Nomor WhatsApp terlalu pendek (minimal 10 digit)';
        } else if (cleanPhone.length > 15) {
            newErrors.phone = 'Nomor WhatsApp terlalu panjang (maksimal 15 digit)';
        }

        // Validasi Jenis Website
        if (!formData.websiteType) {
            newErrors.websiteType = 'Silakan pilih jenis website yang Anda butuhkan';
        }

        // Validasi Pesan/Deskripsi
        if (!formData.message.trim()) {
            newErrors.message = 'Deskripsi kebutuhan wajib diisi agar kami bisa memahami keinginan Anda';
        } else if (formData.message.trim().length < 20) {
            newErrors.message = 'Deskripsi terlalu singkat, mohon berikan detail minimal 20 karakter';
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
                message: 'Mohon lengkapi semua field yang wajib diisi dengan benar',
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
            starter: 'Starter / Landing Page - Rp 100rb',
            professional: 'Professional / UMKM - Rp 1 Juta',
            enterprise: 'Enterprise / Full Custom - Harga Diskusi'
        };

        const websiteTypes = {
            'landing-page': 'Landing Page',
            'company-profile': 'Company Profile',
            'ecommerce': 'Toko Online / E-commerce',
            'portfolio': 'Portfolio',
            'umkm': 'Website UMKM',
            'custom-system': 'Sistem Custom (Booking, CRM, dll)',
            'other': 'Lainnya'
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
            message: 'Mengarahkan ke WhatsApp...',
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
                message: 'Pesanan berhasil dikirim via WhatsApp! Silakan lanjutkan chat di WhatsApp.',
            });
        }, 1500);
    };

    const advantages = [
        {
            icon: <Code className="w-6 h-6" />,
            title: 'Bebas Pilih Tech Stack',
            description: 'React, Vue, Next.js, WordPress, atau framework lainnya sesuai kebutuhan Anda',
            color: 'from-blue-500 to-cyan-500',
        },
        {
            icon: <Palette className="w-6 h-6" />,
            title: 'Desain Custom 100%',
            description: 'Tidak pakai template! Desain dibuat khusus sesuai brand identity Anda',
            color: 'from-purple-500 to-pink-500',
        },
        {
            icon: <Zap className="w-6 h-6" />,
            title: 'Pengerjaan Cepat',
            description: 'Pengerjaan dalam waktu singkat, tanpa mengurangi kualitas',
            color: 'from-yellow-500 to-orange-500',
        },
        {
            icon: <Shield className="w-6 h-6" />,
            title: 'Garansi & Maintenance',
            description: 'Garansi bug fix 30 hari + maintenance gratis sesuai paket',
            color: 'from-green-500 to-emerald-500',
        },
        {
            icon: <HeadphonesIcon className="w-6 h-6" />,
            title: 'Support 24/7',
            description: 'Tim support siap membantu Anda kapan saja via WhatsApp',
            color: 'from-red-500 to-rose-500',
        },
        {
            icon: <Rocket className="w-6 h-6" />,
            title: 'SEO Ready',
            description: 'Website sudah dioptimasi untuk mesin pencari Google',
            color: 'from-indigo-500 to-blue-500',
        },
    ];

    return (
        <>
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
                                    Form Pemesanan Website Premium
                                </div>
                                <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white mb-6">
                                    Wujudkan Website <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Impian Anda</span>
                                </h1>
                                <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
                                    Isi form di bawah ini dan dapatkan konsultasi GRATIS dari tim expert kami untuk hasil yang kredibel
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
                                    🌟 Mengapa Memilih WebKuu?
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
                                        Detail Pemesanan
                                    </h2>
                                    <p className="text-brand-emerald-50 text-lg opacity-90">Lengkapi informasi di bawah ini untuk memulai project Anda</p>
                                    <div className="absolute top-0 right-0 p-10 opacity-10">
                                        <Sparkles size={120} />
                                    </div>
                                </div>

                                <form onSubmit={handleSubmit} noValidate className="p-8 md:p-16 space-y-8">
                                    {/* Nama Lengkap */}
                                    <div>
                                        <label htmlFor="name" className="block text-base font-bold text-slate-700 dark:text-slate-200 mb-3">
                                            Nama Lengkap <span className="text-accent">*</span>
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
                                            placeholder="Masukkan nama lengkap"
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
                                                Email <span className="text-accent">*</span>
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
                                                placeholder="email@example.com"
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
                                                No. WhatsApp <span className="text-accent">*</span>
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
                                                placeholder="Contoh: 081234567890"
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
                                            Nama Perusahaan/Bisnis (Opsional)
                                        </label>
                                        <input
                                            type="text"
                                            id="company"
                                            name="company"
                                            value={formData.company}
                                            onChange={handleChange}
                                            className="w-full px-5 py-4 rounded-xl border-2 border-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-lg"
                                            placeholder="Masukkan nama perusahaan"
                                        />
                                    </div>

                                    {/* Paket & Jenis Website */}
                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div>
                                            <label htmlFor="package" className="block text-base font-bold text-slate-700 dark:text-slate-200 mb-3">
                                                Pilih Paket Layanan <span className="text-accent">*</span>
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
                                                    <option value="starter">Starter / Landing Page - Rp 100rb</option>
                                                    <option value="professional">Professional / UMKM - Rp 1 Juta</option>
                                                    <option value="enterprise">Enterprise / Full Custom - Harga Diskusi</option>
                                                </select>
                                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                                    <Zap size={20} />
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="websiteType" className="block text-base font-bold text-slate-700 dark:text-slate-200 mb-3">
                                                Jenis Website <span className="text-accent">*</span>
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
                                                    <option value="">Pilih kategori website</option>
                                                    <option value="landing-page">Landing Page</option>
                                                    <option value="company-profile">Company Profile</option>
                                                    <option value="ecommerce">Toko Online / E-commerce</option>
                                                    <option value="portfolio">Portfolio</option>
                                                    <option value="umkm">Website UMKM</option>
                                                    <option value="custom-system">Sistem Custom (Booking, CRM, dll)</option>
                                                    <option value="other">Lainnya</option>
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
                                            Preferensi Teknologi (Opsional)
                                        </label>
                                        <div className="relative">
                                            <select
                                                id="techStack"
                                                name="techStack"
                                                value={formData.techStack}
                                                onChange={handleChange}
                                                className="w-full px-5 py-4 rounded-xl border-2 border-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-lg appearance-none cursor-pointer"
                                            >
                                                <option value="">Biarkan kami merekomendasikan yang terbaik</option>
                                                <option value="react">React.js + Tailwind (Modern & Fast)</option>
                                                <option value="nextjs">Next.js (High Performance + SEO)</option>
                                                <option value="vue">Vue.js</option>
                                                <option value="wordpress">WordPress (CMS Ready)</option>
                                                <option value="laravel">Laravel + PHP (Robust System)</option>
                                                <option value="html-css-js">HTML/CSS/JS (Static Content)</option>
                                                <option value="other">Kebutuhan Lain (Tulis di deskripsi)</option>
                                            </select>
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                                <Code size={20} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Pesan */}
                                    <div>
                                        <label htmlFor="message" className="block text-base font-bold text-slate-700 dark:text-slate-200 mb-3">
                                            Ceritakan Kebutuhan Anda <span className="text-accent">*</span>
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
                                            placeholder="Jelaskan secara detail:&#10;- Apa tujuan website Anda?&#10;- Fitur apa saja yang harus ada?&#10;- Apakah Anda punya referensi desain?&#10;- Berapa lama pengerjaan yang diinginkan?"
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
                                                Sedang Memproses...
                                            </span>
                                        ) : (
                                            <span className="flex items-center justify-center gap-3">
                                                <Send size={24} />
                                                Kirim Pesanan Sekarang
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
