import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

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
                ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-md py-4'
                : 'bg-transparent py-6'
                }`}
        >
            <div className="container mx-auto px-6 flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    WebKuu
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center space-x-8">
                    {navLinks.map((link) => (
                        link.isRoute ? (
                            <Link
                                key={link.name}
                                to={link.href}
                                className="relative group text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors py-1"
                            >
                                {link.name}
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 dark:bg-blue-400 transition-all duration-300 group-hover:w-full" />
                            </Link>
                        ) : (
                            <a
                                key={link.name}
                                href={link.href}
                                onClick={(e) => handleScroll(e, link.href)}
                                className="relative group text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors cursor-pointer py-1"
                            >
                                {link.name}
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 dark:bg-blue-400 transition-all duration-300 group-hover:w-full" />
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
                        className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full transition-all shadow-lg hover:shadow-blue-500/30"
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
                className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 origin-left"
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
                                        className="relative group block w-full py-3 px-4 text-slate-600 dark:text-slate-300 font-medium hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors overflow-hidden"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        <span className="relative z-10">{link.name}</span>
                                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 dark:bg-blue-400 transition-all duration-300 group-hover:w-full" />
                                    </Link>
                                ) : (
                                    <a
                                        key={link.name}
                                        href={link.href}
                                        onClick={(e) => handleScroll(e, link.href)}
                                        className="relative group block w-full py-3 px-4 text-slate-600 dark:text-slate-300 font-medium hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer overflow-hidden"
                                    >
                                        <span className="relative z-10">{link.name}</span>
                                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 dark:bg-blue-400 transition-all duration-300 group-hover:w-full" />
                                    </a>
                                )
                            ))}
                            <Link
                                to="/order"
                                className="block w-full py-3 px-4 mt-2 bg-blue-600 text-white text-center font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-md"
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
