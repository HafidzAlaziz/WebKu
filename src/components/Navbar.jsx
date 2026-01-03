import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const Logo = () => (
    <div className="flex items-center gap-3 group">
        <div className="relative w-11 h-11">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-accent/20 rounded-xl blur-md"
            />
            <div className="relative h-full w-full bg-white dark:bg-slate-900 rounded-xl border-2 border-slate-100 dark:border-slate-800 shadow-xl group-hover:border-primary/50 transition-all duration-500 overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative z-10 transition-transform duration-500 group-hover:scale-110">
                    <path d="M4 8L7 17L12 9L17 17L20 8" stroke="url(#logo-gradient)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12 9L12 17" stroke="url(#logo-gradient)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="opacity-30" />
                    <defs>
                        <linearGradient id="logo-gradient" x1="4" y1="8" x2="20" y2="17" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#064e3b" />
                            <stop offset="1" stopColor="#d97706" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>
        </div>
        <div className="flex flex-col -space-y-1">
            <span className="text-2xl font-black tracking-tighter text-slate-900 dark:text-white transition-colors">
                WEB<span className="text-primary">KUU</span>
            </span>
            <span className="text-[10px] font-bold text-primary-light dark:text-brand-emerald-400 uppercase tracking-widest leading-none">
                Digital Solutions
            </span>
        </div>
    </div>
);

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    // Scroll Progress Logic
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    // Get theme context
    let isDark = false;
    let toggleTheme = () => { };

    try {
        const theme = useTheme();
        isDark = theme.isDark;
        toggleTheme = theme.toggleTheme;
    } catch (error) {
        console.error('Theme context error:', error);
    }

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', href: '#home' },
        { name: 'Layanan', href: '#services' },
        { name: 'Portfolio', href: '/portfolio', isRoute: true },
        { name: 'Harga', href: '#pricing' },
        { name: 'Testimoni', href: '#testimonials' },
    ];

    const handleToggleTheme = () => {
        console.log('Toggle theme clicked, current isDark:', isDark);
        toggleTheme();
    };

    const handleScroll = (e, href) => {
        e.preventDefault();
        const targetId = href.replace('#', '');
        const element = document.getElementById(targetId);

        setIsMobileMenuOpen(false);

        if (element) {
            const headerOffset = 80;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.scrollY - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        } else {
            navigate('/');
            setTimeout(() => {
                const el = document.getElementById(targetId);
                if (el) {
                    const headerOffset = 80;
                    const elementPosition = el.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.scrollY - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }, 300);
        }
    };

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-md py-3'
                : 'bg-transparent py-5'
                }`}
        >
            <div className="container mx-auto px-6 flex justify-between items-center">
                <Link to="/" className="flex-shrink-0">
                    <Logo />
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center space-x-8">
                    {navLinks.map((link) => (
                        link.isRoute ? (
                            <Link
                                key={link.name}
                                to={link.href}
                                className="relative group text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-brand-emerald-400 font-medium transition-colors py-1"
                            >
                                {link.name}
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary dark:bg-brand-emerald-400 transition-all duration-300 group-hover:w-full" />
                            </Link>
                        ) : (
                            <a
                                key={link.name}
                                href={link.href}
                                onClick={(e) => handleScroll(e, link.href)}
                                className="relative group text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-brand-emerald-400 font-medium transition-colors cursor-pointer py-1"
                            >
                                {link.name}
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary dark:bg-brand-emerald-400 transition-all duration-300 group-hover:w-full" />
                            </a>
                        )
                    ))}
                    <motion.button
                        onClick={handleToggleTheme}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                        aria-label="Toggle theme"
                    >
                        {isDark ? <Sun size={20} /> : <Moon size={20} />}
                    </motion.button>
                    <Link
                        to="/order"
                        className="px-6 py-2.5 bg-primary hover:bg-primary-light text-white font-semibold rounded-full transition-all shadow-lg hover:shadow-primary/30"
                    >
                        Order Sekarang
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden flex items-center gap-3">
                    <motion.button
                        onClick={handleToggleTheme}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                        aria-label="Toggle theme"
                    >
                        {isDark ? <Sun size={20} /> : <Moon size={20} />}
                    </motion.button>
                    <button
                        className="text-slate-700 dark:text-slate-300 focus:outline-none"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Toggle navigation menu"
                    >
                        {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </div>

            {/* Scroll Progress Bar */}
            <motion.div
                className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-accent origin-left"
                style={{ scaleX }}
            />

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className="md:hidden absolute top-full left-0 w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-xl"
                    >
                        <div className="flex flex-col p-4 space-y-2">
                            {navLinks.map((link) => (
                                link.isRoute ? (
                                    <Link
                                        key={link.name}
                                        to={link.href}
                                        className="relative group block w-full py-3 px-4 text-slate-600 dark:text-slate-300 font-medium hover:text-primary dark:hover:text-brand-emerald-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors overflow-hidden"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        <span className="relative z-10">{link.name}</span>
                                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary dark:bg-brand-emerald-400 transition-all duration-300 group-hover:w-full" />
                                    </Link>
                                ) : (
                                    <a
                                        key={link.name}
                                        href={link.href}
                                        onClick={(e) => handleScroll(e, link.href)}
                                        className="relative group block w-full py-3 px-4 text-slate-600 dark:text-slate-300 font-medium hover:text-primary dark:hover:text-brand-emerald-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer overflow-hidden"
                                    >
                                        <span className="relative z-10">{link.name}</span>
                                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary dark:bg-brand-emerald-400 transition-all duration-300 group-hover:w-full" />
                                    </a>
                                )
                            ))}
                            <Link
                                to="/order"
                                className="block w-full py-3 px-4 mt-2 bg-primary text-white text-center font-semibold rounded-lg hover:bg-primary-light transition-colors shadow-md"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Order Sekarang
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
