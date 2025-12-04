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
        package: 'basic',
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

        if (!formData.name.trim()) {
            newErrors.name = 'Nama lengkap wajib diisi';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email wajib diisi';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Format email tidak valid';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Nomor WhatsApp wajib diisi';
        } else if (!/^[0-9]{10,15}$/.test(formData.phone.replace(/[\s-]/g, ''))) {
            newErrors.phone = 'Nomor telepon tidak valid (10-15 digit)';
        }

        if (!formData.websiteType) {
            newErrors.websiteType = 'Pilih jenis website terlebih dahulu';
        }

        if (!formData.message.trim()) {
            newErrors.message = 'Deskripsi kebutuhan wajib diisi';
        } else if (formData.message.trim().length < 20) {
            newErrors.message = 'Deskripsi minimal 20 karakter';
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
            return;
        }

        setErrors({});
        setStatus({ loading: true, success: false, error: false, message: '' });

        // Format data untuk WhatsApp
        const packageNames = {
            hemat: 'Paket Hemat - Rp 100rb',
            custom: 'Custom / UMKM - Harga Fleksibel',
            fullcustom: 'Full Custom - Harga Diskusi'
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

        // Buat pesan WhatsApp
        let waMessage = `*FORM PEMESANAN WEBSITE - WebKuu*\n\n`;
        waMessage += `📝 *Data Pemesan:*\n`;
        waMessage += `Nama: ${formData.name}\n`;
        waMessage += `Email: ${formData.email}\n`;
        waMessage += `WhatsApp: ${formData.phone}\n`;
        if (formData.company) {
            waMessage += `Perusahaan: ${formData.company}\n`;
        }
        waMessage += `\n`;

        waMessage += `📦 *Detail Pesanan:*\n`;
        waMessage += `Paket: ${packageNames[formData.package]}\n`;
        waMessage += `Jenis Website: ${websiteTypes[formData.websiteType] || formData.websiteType}\n`;
        if (formData.techStack) {
            waMessage += `Tech Stack: ${formData.techStack}\n`;
        }
        waMessage += `\n`;

        waMessage += `💬 *Deskripsi Kebutuhan:*\n`;
        waMessage += `${formData.message}\n`;
        waMessage += `\n`;
        waMessage += `---\n`;
        waMessage += `Dikirim via Form Order WebKuu`;

        // Encode untuk URL
        const encodedMessage = encodeURIComponent(waMessage);
        const whatsappUrl = `https://wa.me/62895613114028?text=${encodedMessage}`;

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
                package: 'hemat',
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
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
                {/* Decorative Background */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200 dark:bg-blue-900/20 rounded-full blur-3xl opacity-20 animate-pulse" />
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-200 dark:bg-purple-900/20 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }} />
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
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-semibold mb-4">
                                    <Sparkles size={16} />
                                    Form Pemesanan Website
                                </div>
                                <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4">
                                    Wujudkan Website <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Impian Anda</span>
                                </h1>
                                <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                                    Isi form di bawah ini dan dapatkan konsultasi gratis dari tim expert kami
                                </p>
                            </motion.div>

                            {/* Advantages Section */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="mb-12"
                            >
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white text-center mb-8">
                                    🌟 Keunggulan Kami
                                </h2>
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {advantages.map((advantage, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.1 + index * 0.05 }}
                                            whileHover={{ y: -5 }}
                                            className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-100 dark:border-slate-700 hover:shadow-xl transition-all group"
                                        >
                                            <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${advantage.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                                                {advantage.icon}
                                            </div>
                                            <h3 className="font-bold text-slate-900 dark:text-white mb-2">{advantage.title}</h3>
                                            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{advantage.description}</p>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Form Card */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 overflow-hidden"
                            >
                                {/* Form Header */}
                                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
                                    <h2 className="text-2xl font-bold mb-2">📝 Detail Pemesanan</h2>
                                    <p className="text-blue-100">Lengkapi informasi di bawah ini dengan detail</p>
                                </div>

                                <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-6">
                                    {/* Nama Lengkap */}
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                            Nama Lengkap <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-3 rounded-lg border-2 ${errors.name
                                                ? 'border-red-500 dark:border-red-500'
                                                : 'border-slate-200 dark:border-slate-600'
                                                } dark:bg-slate-700 dark:text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all`}
                                            placeholder="Masukkan nama lengkap Anda"
                                        />
                                        {errors.name && (
                                            <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                                                <AlertCircle size={14} />
                                                {errors.name}
                                            </p>
                                        )}
                                    </div>

                                    {/* Email & Phone */}
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="email" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                                Email <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className={`w-full px-4 py-3 rounded-lg border-2 ${errors.email
                                                    ? 'border-red-500 dark:border-red-500'
                                                    : 'border-slate-200 dark:border-slate-600'
                                                    } dark:bg-slate-700 dark:text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all`}
                                                placeholder="email@example.com"
                                            />
                                            {errors.email && (
                                                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                                                    <AlertCircle size={14} />
                                                    {errors.email}
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <label htmlFor="phone" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                                No. WhatsApp <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="tel"
                                                id="phone"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                className={`w-full px-4 py-3 rounded-lg border-2 ${errors.phone
                                                    ? 'border-red-500 dark:border-red-500'
                                                    : 'border-slate-200 dark:border-slate-600'
                                                    } dark:bg-slate-700 dark:text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all`}
                                                placeholder="08123456789"
                                            />
                                            {errors.phone && (
                                                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                                                    <AlertCircle size={14} />
                                                    {errors.phone}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Nama Perusahaan */}
                                    <div>
                                        <label htmlFor="company" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                            Nama Perusahaan/Bisnis (Opsional)
                                        </label>
                                        <input
                                            type="text"
                                            id="company"
                                            name="company"
                                            value={formData.company}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all"
                                            placeholder="PT. Contoh Perusahaan"
                                        />
                                    </div>

                                    {/* Paket & Jenis Website */}
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="package" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                                Pilih Paket <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                id="package"
                                                name="package"
                                                value={formData.package}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all"
                                            >
                                                <option value="hemat">Paket Hemat - Rp 100rb</option>
                                                <option value="custom">Custom / UMKM - Harga Fleksibel</option>
                                                <option value="fullcustom">Full Custom - Harga Diskusi</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label htmlFor="websiteType" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                                Jenis Website <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                id="websiteType"
                                                name="websiteType"
                                                value={formData.websiteType}
                                                onChange={handleChange}
                                                className={`w-full px-4 py-3 rounded-lg border-2 ${errors.websiteType
                                                    ? 'border-red-500 dark:border-red-500'
                                                    : 'border-slate-200 dark:border-slate-600'
                                                    } dark:bg-slate-700 dark:text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all`}
                                            >
                                                <option value="">Pilih jenis website</option>
                                                <option value="landing-page">Landing Page</option>
                                                <option value="company-profile">Company Profile</option>
                                                <option value="ecommerce">Toko Online / E-commerce</option>
                                                <option value="portfolio">Portfolio</option>
                                                <option value="umkm">Website UMKM</option>
                                                <option value="custom-system">Sistem Custom (Booking, CRM, dll)</option>
                                                <option value="other">Lainnya</option>
                                            </select>
                                            {errors.websiteType && (
                                                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                                                    <AlertCircle size={14} />
                                                    {errors.websiteType}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Tech Stack */}
                                    <div>
                                        <label htmlFor="techStack" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                            Preferensi Tech Stack (Opsional)
                                        </label>
                                        <select
                                            id="techStack"
                                            name="techStack"
                                            value={formData.techStack}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all"
                                        >
                                            <option value="">Pilih tech stack (opsional)</option>
                                            <option value="react">React.js + Tailwind</option>
                                            <option value="nextjs">Next.js (SEO Friendly)</option>
                                            <option value="vue">Vue.js</option>
                                            <option value="wordpress">WordPress</option>
                                            <option value="laravel">Laravel + PHP</option>
                                            <option value="html-css-js">HTML/CSS/JS (Static)</option>
                                            <option value="other">Lainnya (Tulis di deskripsi)</option>
                                        </select>
                                        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                                            💡 Tidak yakin? Biarkan kosong dan kami akan merekomendasikan tech stack terbaik untuk kebutuhan Anda
                                        </p>
                                    </div>

                                    {/* Pesan */}
                                    <div>
                                        <label htmlFor="message" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                            Deskripsi Kebutuhan Website <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            rows="6"
                                            className={`w-full px-4 py-3 rounded-lg border-2 ${errors.message
                                                ? 'border-red-500 dark:border-red-500'
                                                : 'border-slate-200 dark:border-slate-600'
                                                } dark:bg-slate-700 dark:text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all resize-none`}
                                            placeholder="Ceritakan tentang website yang Anda inginkan:&#10;- Fitur-fitur yang dibutuhkan&#10;- Referensi website yang Anda suka&#10;- Target audience&#10;- Deadline yang diharapkan&#10;- Informasi lain yang relevan"
                                        />
                                        {errors.message && (
                                            <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                                                <AlertCircle size={14} />
                                                {errors.message}
                                            </p>
                                        )}
                                    </div>

                                    {/* Status Messages */}
                                    {status.message && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className={`p-4 rounded-lg flex items-start gap-3 ${status.success
                                                ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800'
                                                : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800'
                                                }`}
                                        >
                                            {status.success ? <CheckCircle className="shrink-0" /> : <AlertCircle className="shrink-0" />}
                                            <p>{status.message}</p>
                                        </motion.div>
                                    )}

                                    {/* Submit Button */}
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="submit"
                                        disabled={status.loading}
                                        className={`w-full py-4 rounded-xl font-bold text-lg text-white shadow-xl transition-all ${status.loading
                                            ? 'bg-slate-400 cursor-not-allowed'
                                            : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-blue-500/30'
                                            }`}
                                    >
                                        {status.loading ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Memproses...
                                            </span>
                                        ) : (
                                            <span className="flex items-center justify-center gap-2">
                                                <Send size={20} />
                                                Kirim Pesanan
                                            </span>
                                        )}
                                    </motion.button>
                                </form>
                            </motion.div>

                            {/* Contact Alternative */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="mt-12 text-center"
                            >
                                <p className="text-slate-600 dark:text-slate-300 mb-4">Atau hubungi kami langsung melalui:</p>
                                <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                                    <a
                                        href="https://wa.me/62895613114028"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-green-500/30"
                                    >
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                                        </svg>
                                        WhatsApp: +62 895 6131 14028
                                    </a>
                                    <a
                                        href="mailto:web.kuu@gmail.com"
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-slate-600 hover:bg-slate-700 text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-slate-500/30"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                        Email: web.kuu@gmail.com
                                    </a>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default OrderPage;
