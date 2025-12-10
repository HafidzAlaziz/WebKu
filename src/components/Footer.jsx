import React from 'react';
import { Facebook, Instagram, Mail, Phone, MapPin, Heart } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-slate-900 dark:bg-slate-950 text-slate-300 pt-16 pb-8">
            <div className="container mx-auto px-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

                    {/* Brand Info */}
                    <div>
                        <h3 className="text-2xl font-bold text-white mb-6">WebKuu</h3>
                        <p className="text-slate-400 mb-6 leading-relaxed">
                            Jasa pembuatan website profesional terpercaya. Kami membantu bisnis Anda tumbuh di era digital dengan solusi website terbaik.
                        </p>
                        <div className="flex gap-4">
                            <a
                                href="https://www.instagram.com/web.kuu3?igsh=MWxoc2tiOG85dmh3Zg=="
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full bg-slate-800 dark:bg-slate-900 flex items-center justify-center hover:bg-pink-600 hover:text-white transition-all"
                                aria-label="Instagram WebKuu"
                            >
                                <Instagram size={20} />
                            </a>
                            <a
                                href="https://www.facebook.com/share/1FpmQZd6nW/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full bg-slate-800 dark:bg-slate-900 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all"
                                aria-label="Facebook WebKuu"
                            >
                                <Facebook size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-bold text-white mb-6">Navigasi Cepat</h4>
                        <ul className="space-y-3">
                            <li><a href="#home" className="hover:text-blue-400 transition-colors">Home</a></li>
                            <li><a href="#services" className="hover:text-blue-400 transition-colors">Layanan</a></li>
                            <li><a href="#pricing" className="hover:text-blue-400 transition-colors">Harga</a></li>
                            <li><a href="/portfolio" className="hover:text-blue-400 transition-colors">Portfolio</a></li>
                            <li><a href="#testimonials" className="hover:text-blue-400 transition-colors">Testimoni</a></li>
                            <li><a href="#order" className="hover:text-blue-400 transition-colors">Order</a></li>
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h4 className="text-lg font-bold text-white mb-6">Layanan</h4>
                        <ul className="space-y-3">
                            <li className="hover:text-blue-400 transition-colors cursor-pointer">Company Profile</li>
                            <li className="hover:text-blue-400 transition-colors cursor-pointer">Toko Online</li>
                            <li className="hover:text-blue-400 transition-colors cursor-pointer">Landing Page</li>
                            <li className="hover:text-blue-400 transition-colors cursor-pointer">Website UMKM</li>
                            <li className="hover:text-blue-400 transition-colors cursor-pointer">Maintenance</li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-lg font-bold text-white mb-6">Hubungi Kami</h4>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <MapPin size={20} className="text-blue-400 flex-shrink-0 mt-1" />
                                <span>Jawa Barat, Indonesia</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone size={20} className="text-blue-400 flex-shrink-0" />
                                <span>+62 851 2295 9690</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail size={20} className="text-blue-400 flex-shrink-0" />
                                <span>web.kuu@gmail.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-slate-800 dark:border-slate-900 pt-8 text-center text-sm text-slate-500 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p>&copy; 2025 WebKuu. All rights reserved.</p>
                    <p className="flex items-center gap-1">
                        Dibuat oleh tim WebKuu
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
