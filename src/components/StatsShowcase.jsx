import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Star, Users, Award, Zap } from 'lucide-react';
import { useCountAnimation } from '../hooks/useCountAnimation';

const StatItem = ({ stat, index }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    // Parse value for animation
    let endValue = 0;
    let formatFn = (val) => val;

    if (stat.value.includes('/')) {
        endValue = parseInt(stat.value.split('/')[0]);
        formatFn = (val) => `${val}/${stat.value.split('/')[1]}`;
    } else if (stat.value.includes('.')) {
        endValue = parseFloat(stat.value) * 10;
        formatFn = (val) => (val / 10).toFixed(1);
    } else if (stat.value.includes('+')) {
        endValue = parseInt(stat.value);
        formatFn = (val) => `${val}+`;
    } else {
        endValue = parseInt(stat.value);
    }

    const count = useCountAnimation(endValue, 2000, isInView);

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -5 }}
            className="text-center bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100 dark:border-slate-700"
        >
            <div className="flex flex-col items-center">
                {/* Icon with Gradient Background */}
                <motion.div
                    className={`w-14 h-14 lg:w-16 lg:h-16 rounded-2xl bg-gradient-to-br ${stat.color} p-3 lg:p-4 mb-3 lg:mb-4 shadow-lg`}
                    whileHover={{ rotate: 5, scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                >
                    <stat.icon className="w-full h-full text-white" strokeWidth={2} />
                </motion.div>

                {/* Value */}
                <motion.div
                    initial={{ scale: 0.5 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                    className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-1"
                >
                    {formatFn(count)}
                </motion.div>

                {/* Stars for Rating */}
                {stat.showStars && (
                    <div className="flex gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.3, delay: index * 0.1 + 0.3 + i * 0.05 }}
                            >
                                <Star
                                    size={16}
                                    className="fill-yellow-400 text-yellow-400"
                                />
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Label */}
                <p className="text-sm lg:text-base text-slate-600 dark:text-slate-400 font-medium">
                    {stat.label}
                </p>
            </div>
        </motion.div>
    );
};

const StatsShowcase = () => {
    const stats = [
        {
            icon: Award,
            value: "50+",
            label: "Project Selesai",
            color: "from-primary to-brand-emerald-400"
        },
        {
            icon: Star,
            value: "5.0",
            label: "Rating Bintang",
            color: "from-accent to-brand-gold-400",
            showStars: true
        },
        {
            icon: Users,
            value: "45+",
            label: "Klien Puas",
            color: "from-brand-emerald-600 to-brand-emerald-400"
        },
        {
            icon: Zap,
            value: "24/7",
            label: "Fast Response",
            color: "from-accent-dark to-accent"
        }
    ];

    return (
        <section className="py-16 bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 border-y border-slate-200 dark:border-slate-700">
            <div className="container mx-auto px-6">
                {/* Section Title */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-10"
                >
                    <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white mb-2">
                        Dikerjakan Secara <span className="text-primary dark:text-brand-emerald-400">Profesional</span> oleh Ahlinya
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400">
                        Standar kualitas tinggi, dikerjakan langsung oleh ahlinya untuk hasil yang kredibel
                    </p>
                </motion.div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                    {stats.map((stat, index) => (
                        <StatItem key={index} stat={stat} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default StatsShowcase;
