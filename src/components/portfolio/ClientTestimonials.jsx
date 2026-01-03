import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

// Sample testimonials data
const testimonialsData = [
    {
        id: 1,
        name: "Budi Santoso",
        project: "E-Commerce Fashion Store",
        rating: 5,
        avatar: "https://ui-avatars.com/api/?name=Budi+Santoso&background=3b82f6&color=fff&size=128",
        testimonial: "Hasilnya sangat memuaskan! Website toko online saya jadi lebih profesional dan penjualan meningkat 200%. Tim sangat responsif dan memahami kebutuhan bisnis saya."
    },
    {
        id: 2,
        name: "Siti Nurhaliza",
        project: "Company Profile",
        rating: 5,
        avatar: "https://ui-avatars.com/api/?name=Siti+Nurhaliza&background=8b5cf6&color=fff&size=128",
        testimonial: "Pelayanan sangat baik dan cepat. Website company profile kami terlihat sangat modern dan profesional. Klien-klien kami juga memberikan feedback positif!"
    },
    {
        id: 3,
        name: "Ahmad Fauzi",
        project: "Landing Page SaaS",
        rating: 5,
        avatar: "https://ui-avatars.com/api/?name=Ahmad+Fauzi&background=10b981&color=fff&size=128",
        testimonial: "Conversion rate landing page saya naik drastis setelah redesign. Desainnya modern, loading cepat, dan mobile-friendly. Highly recommended!"
    },
    {
        id: 4,
        name: "Dewi Lestari",
        project: "Restaurant Menu & Ordering",
        rating: 5,
        avatar: "https://ui-avatars.com/api/?name=Dewi+Lestari&background=f59e0b&color=fff&size=128",
        testimonial: "Website pemesanan untuk restoran saya sangat membantu! Pelanggan jadi lebih mudah order dan sistem terintegrasi dengan WhatsApp. Mantap!"
    },
    {
        id: 5,
        name: "Rudi Hermawan",
        project: "Portfolio Photographer",
        rating: 5,
        avatar: "https://ui-avatars.com/api/?name=Rudi+Hermawan&background=ef4444&color=fff&size=128",
        testimonial: "Portfolio website saya jadi lebih menarik dan profesional. Galeri fotonya smooth banget dan klien saya impressed dengan presentasi karya saya."
    },
    {
        id: 6,
        name: "Linda Wijaya",
        project: "Educational Platform",
        rating: 5,
        avatar: "https://ui-avatars.com/api/?name=Linda+Wijaya&background=ec4899&color=fff&size=128",
        testimonial: "Platform e-learning yang dibuat sangat lengkap fiturnya. Siswa-siswa saya senang belajar dengan sistem yang user-friendly. Worth every penny!"
    }
];

const ClientTestimonials = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    // Auto-play carousel
    useEffect(() => {
        if (!isAutoPlaying) return;

        const interval = setInterval(() => {
            handleNext();
        }, 5000); // Change slide every 5 seconds

        return () => clearInterval(interval);
    }, [currentIndex, isAutoPlaying]);

    const handleNext = () => {
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % testimonialsData.length);
    };

    const handlePrev = () => {
        setDirection(-1);
        setCurrentIndex((prev) => (prev - 1 + testimonialsData.length) % testimonialsData.length);
    };

    const handleDotClick = (index) => {
        setDirection(index > currentIndex ? 1 : -1);
        setCurrentIndex(index);
        setIsAutoPlaying(false);
        setTimeout(() => setIsAutoPlaying(true), 10000); // Resume auto-play after 10s
    };

    const slideVariants = {
        enter: (direction) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0
        }),
        center: {
            x: 0,
            opacity: 1
        },
        exit: (direction) => ({
            x: direction < 0 ? 1000 : -1000,
            opacity: 0
        })
    };

    const currentTestimonial = testimonialsData[currentIndex];

    return (
        <section id="testimonials" className="py-20 bg-white dark:bg-slate-800">
            <div className="container mx-auto px-6">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
                        Testimoni Klien
                    </h2>
                    <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                        Apa kata mereka yang sudah mempercayai kami untuk membuat website impian mereka
                    </p>
                </motion.div>

                {/* Carousel Container */}
                <div className="relative max-w-4xl mx-auto">
                    {/* Navigation Buttons */}
                    <button
                        onClick={handlePrev}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 z-10 p-3 bg-white dark:bg-slate-700 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110"
                        aria-label="Previous testimonial"
                    >
                        <ChevronLeft size={24} className="text-slate-700 dark:text-slate-300" />
                    </button>

                    <button
                        onClick={handleNext}
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 z-10 p-3 bg-white dark:bg-slate-700 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110"
                        aria-label="Next testimonial"
                    >
                        <ChevronRight size={24} className="text-slate-700 dark:text-slate-300" />
                    </button>

                    {/* Testimonial Card */}
                    <div className="relative overflow-hidden min-h-[400px] flex items-center">
                        <AnimatePresence initial={false} custom={direction} mode="wait">
                            <motion.div
                                key={currentIndex}
                                custom={direction}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{
                                    x: { type: "spring", stiffness: 300, damping: 30 },
                                    opacity: { duration: 0.2 }
                                }}
                                className="w-full"
                            >
                                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-700 dark:to-slate-600 rounded-2xl p-8 md:p-12 shadow-xl">
                                    {/* Quote Icon */}
                                    <div className="flex justify-center mb-6">
                                        <div className="p-4 bg-blue-600 rounded-full">
                                            <Quote size={32} className="text-white" />
                                        </div>
                                    </div>

                                    {/* Testimonial Text */}
                                    <p className="text-xl md:text-2xl text-slate-700 dark:text-slate-200 text-center mb-8 leading-relaxed italic">
                                        "{currentTestimonial.testimonial}"
                                    </p>

                                    {/* Client Info */}
                                    <div className="flex flex-col items-center">
                                        <img
                                            src={currentTestimonial.avatar}
                                            alt={currentTestimonial.name}
                                            className="w-20 h-20 rounded-full mb-4 border-4 border-white dark:border-slate-800 shadow-lg"
                                            loading="lazy"
                                        />
                                        <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                                            {currentTestimonial.name}
                                        </h4>
                                        <p className="text-blue-600 dark:text-blue-400 font-medium mb-3">
                                            {currentTestimonial.project}
                                        </p>

                                        {/* Rating Stars */}
                                        <div className="flex gap-1">
                                            {[...Array(currentTestimonial.rating)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    size={20}
                                                    className="text-yellow-400 fill-yellow-400"
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Dots Indicator */}
                    <div className="flex justify-center gap-2 mt-8">
                        {testimonialsData.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => handleDotClick(index)}
                                className={`transition-all ${index === currentIndex
                                    ? 'w-8 bg-blue-600'
                                    : 'w-2 bg-slate-300 dark:bg-slate-600 hover:bg-slate-400 dark:hover:bg-slate-500'
                                    } h-2 rounded-full`}
                                aria-label={`Go to testimonial ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ClientTestimonials;
