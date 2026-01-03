import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ProjectCard from './ProjectCard';
import ProjectModal from './ProjectModal';

// Sample project data - you can replace this with your actual projects
const projectsData = [
    {
        id: -1,
        name: "Professional Service",
        type: "Landing Page",
        thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2026&auto=format&fit=crop",
        shortDescription: "Solusi profesional untuk pertumbuhan bisnis dengan strategi terukur dan hasil nyata.",
        fullDescription: "Website landing page untuk layanan profesional yang fokus pada hasil kerja nyata, transformasi tantangan bisnis, dan dedikasi pada kepuasan mitra.",
        duration: "1 Hari",
        client: "Create",
        demoLink: "https://professional-service-topaz.vercel.app/",
        technologies: ["React", "Tailwind CSS", "Framer Motion", "Vercel"],
        features: [
            "Premium Business Layout",
            "Strategy & Results Showcase",
            "Client Testimonials",
            "Responsive Design",
            "Smooth Animations"
        ]
    },
    // ... rest of the same projectsData
    {
        id: 0,
        name: "UMKM Store",
        // ... (rest of the projects remained but I'll keep the list manageable)
        type: "Toko Online",
        thumbnail: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2070&auto=format&fit=crop",
        shortDescription: "Platform e-commerce modern untuk mendukung produk UMKM lokal.",
        fullDescription: "Website e-commerce yang dirancang untuk membantu UMKM lokal memasarkan produk mereka secara online. Dilengkapi dengan katalog produk yang menarik, sistem kategori, dan integrasi WhatsApp untuk transaksi yang mudah.",
        duration: "1 Hari",
        client: "Create",
        demoLink: "https://umkm-ivory.vercel.app/",
        technologies: ["Next.js", "Tailwind CSS", "Framer Motion", "Vercel"],
        features: [
            "Katalog Produk UMKM",
            "Filter Kategori",
            "Pencarian Produk",
            "WhatsApp Integration",
            "Responsive Design"
        ]
    },
    {
        id: 1,
        name: "Vayana",
        type: "Company Profile",
        thumbnail: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2070&auto=format&fit=crop",
        shortDescription: "Website premium untuk hotel dan resort mewah dengan desain minimalis elegan.",
        fullDescription: "Landing page premium untuk Vayana Hotel & Resort yang menampilkan kamar mewah, fasilitas eksklusif, dan pengalaman menginap kelas dunia. Desain menggunakan pendekatan luxury minimalist dengan fokus pada visual berkualitas tinggi.",
        duration: "1 Hari",
        client: "Create",
        demoLink: "https://vayana-hazel.vercel.app/",
        technologies: ["Next.js", "Tailwind CSS", "Framer Motion", "Vercel"],
        features: [
            "Luxury Visual Design",
            "Room Showcase",
            "Amenities Highlight",
            "Responsive Header",
            "Smooth Transitions"
        ]
    },
    {
        id: 2,
        name: "Aura Visuals",
        type: "Company Profile",
        thumbnail: "https://company-profile-xi-indol.vercel.app/images/portfolio-1.jpg",
        shortDescription: "Website company profile profesional untuk layanan fotografi",
        fullDescription: "Website company profile modern untuk Aura Visuals yang menampilkan layanan fotografi, portfolio, dan daftar harga. Desain elegan dengan nuansa monokrom dan emas, dilengkapi animasi yang halus.",
        duration: "1 Hari",
        client: "Create",
        demoLink: "https://company-profile-xi-indol.vercel.app/",
        technologies: ["Next.js", "Tailwind CSS", "Framer Motion", "Vercel"],
        features: [
            "Modern & Elegant Design",
            "Responsive Gallery",
            "Pricing Tables",
            "Contact Form",
            "Smooth Animations",
            "SEO Optimized"
        ]
    },
    {
        id: 3,
        name: "E-Commerce Fashion Store",
        type: "Toko Online",
        thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
        shortDescription: "Platform e-commerce modern untuk toko fashion dengan sistem pembayaran terintegrasi",
        fullDescription: "Website e-commerce lengkap dengan fitur keranjang belanja, checkout, payment gateway, and admin dashboard untuk mengelola produk dan pesanan. Desain modern dan responsif dengan performa tinggi.",
        duration: "3 Minggu",
        client: "Client",
        demoLink: "",
        technologies: ["React", "Tailwind CSS", "Node.js", "MongoDB", "Stripe"],
        features: [
            "Keranjang belanja dinamis",
            "Payment gateway terintegrasi",
            "Admin dashboard lengkap",
            "Sistem tracking pesanan",
            "Filter dan pencarian produk",
            "Responsive design",
            "SEO optimized",
            "Fast loading performance"
        ]
    },
    {
        id: 4,
        name: "Company Profile Tech Startup",
        type: "Company Profile",
        thumbnail: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop",
        shortDescription: "Website company profile profesional dengan animasi modern dan konten interaktif",
        fullDescription: "Website company profile yang menampilkan informasi perusahaan, layanan, portfolio, dan tim dengan desain yang clean dan profesional. Dilengkapi dengan form kontak dan integrasi media sosial.",
        duration: "2 Minggu",
        client: "Client",
        demoLink: "",
        technologies: ["Next.js", "Tailwind CSS", "Framer Motion", "EmailJS"],
        features: [
            "Animasi smooth dan modern",
            "Portfolio showcase",
            "Team member profiles",
            "Contact form dengan validasi",
            "Blog section",
            "Multi-language support",
            "Dark mode",
            "Mobile responsive"
        ]
    },
    {
        id: 5,
        name: "Landing Page SaaS Product",
        type: "Landing Page",
        thumbnail: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=600&fit=crop",
        shortDescription: "Landing page konversi tinggi untuk produk SaaS dengan CTA yang kuat",
        fullDescription: "Landing page yang dirancang khusus untuk meningkatkan konversi dengan copywriting yang persuasif, desain yang menarik, dan call-to-action yang jelas. Dilengkapi dengan analytics tracking.",
        duration: "1 Minggu",
        client: "Client",
        demoLink: "",
        technologies: ["React", "Tailwind CSS", "Vite", "Google Analytics"],
        features: [
            "High conversion design",
            "A/B testing ready",
            "Analytics integration",
            "Lead capture forms",
            "Pricing tables",
            "Testimonials section",
            "FAQ accordion",
            "Fast page load"
        ]
    },
    {
        id: 6,
        name: "Restaurant Menu & Ordering",
        type: "Toko Online",
        thumbnail: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop",
        shortDescription: "Sistem pemesanan online untuk restoran dengan menu digital interaktif",
        fullDescription: "Platform pemesanan makanan online dengan menu digital yang interaktif, sistem keranjang, dan integrasi dengan WhatsApp untuk konfirmasi pesanan. Desain yang appetizing dan user-friendly.",
        duration: "2 Minggu",
        client: "Client",
        demoLink: "",
        technologies: ["React", "Tailwind CSS", "Firebase", "WhatsApp API"],
        features: [
            "Menu digital interaktif",
            "Keranjang belanja",
            "WhatsApp integration",
            "Real-time order updates",
            "Table reservation",
            "Customer reviews",
            "Promo management",
            "Mobile-first design"
        ]
    },
    {
        id: 7,
        name: "Portfolio Photographer",
        type: "Portfolio",
        thumbnail: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&h=600&fit=crop",
        shortDescription: "Portfolio website untuk fotografer dengan galeri foto yang stunning",
        fullDescription: "Website portfolio yang menampilkan karya fotografi dengan galeri yang indah, lightbox untuk viewing, dan kategori yang terorganisir. Desain minimalis yang menonjolkan karya fotografi.",
        duration: "1.5 Minggu",
        client: "Client",
        demoLink: "",
        technologies: ["Next.js", "Tailwind CSS", "Cloudinary", "Lightbox"],
        features: [
            "Image gallery dengan lightbox",
            "Category filtering",
            "Lazy loading images",
            "Contact form",
            "Social media integration",
            "Blog section",
            "SEO optimized",
            "Fast image loading"
        ]
    },
    {
        id: 8,
        name: "Educational Platform",
        type: "Learning Management System",
        thumbnail: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&h=600&fit=crop",
        shortDescription: "Platform pembelajaran online dengan video courses dan quiz interaktif",
        fullDescription: "Platform e-learning lengkap dengan sistem course management, video player, quiz interaktif, progress tracking, dan sertifikat digital. Mendukung berbagai format konten pembelajaran.",
        duration: "4 Minggu",
        client: "Client",
        demoLink: "",
        technologies: ["React", "Node.js", "MongoDB", "Video.js", "PDF.js"],
        features: [
            "Video course player",
            "Interactive quizzes",
            "Progress tracking",
            "Digital certificates",
            "Discussion forums",
            "Student dashboard",
            "Instructor panel",
            "Payment integration"
        ]
    },
    {
        id: 9,
        name: "Smart AI Chatbot",
        type: "Web Application",
        thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop",
        shortDescription: "Asisten virtual cerdas berbasis AI untuk layanan pelanggan otomatis",
        fullDescription: "Aplikasi chatbot cerdas yang menggunakan teknologi AI untuk merespons pertanyaan pengguna secara natural dan real-time. Cocok untuk customer service 24 jam dengan integrasi mudah ke berbagai platform.",
        duration: "1 Hari",
        client: "Create",
        demoLink: "https://chatbot-dusky-eta-13.vercel.app/",
        technologies: ["React", "Tailwind CSS", "OpenAI API", "Vercel"],
        features: [
            "Natural Language Processing",
            "Real-time Response",
            "Mobile Responsive Chat UI",
            "Custom Personality",
            "History Chat",
            "Dark Mode Support",
            "Fast & Lightweight"
        ]
    },
    {
        id: 10,
        name: "Handara Golf & Resort Bali",
        type: "Company Profile",
        thumbnail: "https://images.unsplash.com/photo-1582653291997-079a1c04e5a1?w=800&h=600&fit=crop",
        shortDescription: "Website resmi resort mewah di Bali dengan pemandangan golf yang indah",
        fullDescription: "Website company profile premium untuk Handara Golf & Resort Bali. Menampilkan keindahan resort, layanan golf, fasilitas penginapan, dan informasi booking dengan desain elegan dan visual yang memukau.",
        duration: "1 Hari",
        client: "Create",
        demoLink: "https://handara-bali.vercel.app/",
        technologies: ["Next.js", "Framer Motion", "Tailwind CSS", "React Leaflet"],
        features: [
            "Luxury Visual Design",
            "Interactive Map Integration",
            "Room & Golf Showcase",
            "Booking Information",
            "Smooth Page Transitions",
            "SEO Optimized for Travel",
            "Responsive Mobile View"
        ]
    }
];

const ProjectGallery = () => {
    const [selectedProject, setSelectedProject] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [sourceFilter, setSourceFilter] = useState('All'); // 'All' | 'Client' | 'Create'
    const [filter, setFilter] = useState('All');
    const [visibleCount, setVisibleCount] = useState(3);

    const categories = ['All', 'Web Application', 'Company Profile', 'Toko Online', 'Landing Page', 'Portfolio'];

    // 1. Filter by Category
    const categoryFiltered = filter === 'All'
        ? projectsData
        : projectsData.filter(project => project.type === filter);

    // 2. Filter by Source (Client vs Create)
    const finalFilteredProjects = sourceFilter === 'All'
        ? categoryFiltered
        : categoryFiltered.filter(project => {
            if (sourceFilter === 'Create') return project.client === 'Create';
            return project.client !== 'Create'; // Assuming anything not 'Create' is a Client project
        });

    // 3. Pagination Logic
    const displayedProjects = finalFilteredProjects.slice(0, visibleCount);
    const hasMoreProjects = finalFilteredProjects.length > visibleCount;

    const handleFilterChange = (category) => {
        setFilter(category);
        setVisibleCount(3); // Reset pagination on filter change
    };

    const handleSourceFilterChange = (source) => {
        setSourceFilter(source);
        setVisibleCount(3); // Reset pagination on filter change
    };

    const handleShowMore = () => {
        if (hasMoreProjects) {
            setVisibleCount(finalFilteredProjects.length); // Show All
        } else {
            setVisibleCount(3); // Show Less (Reset)
        }
    };

    const handleProjectClick = (project) => {
        setSelectedProject(project);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setTimeout(() => setSelectedProject(null), 300);
    };

    return (
        <section id="project-gallery" className="py-20 bg-slate-50 dark:bg-slate-900">
            <div className="container mx-auto px-6">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
                        Project Gallery
                    </h2>
                    <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                        Koleksi website custom yang telah kami kerjakan dengan berbagai teknologi modern
                    </p>
                </motion.div>

                {/* Source Filter (Top Level) */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex justify-center mb-10"
                >
                    <div className="bg-white dark:bg-slate-800 p-1.5 rounded-full inline-flex shadow-xl border border-slate-100 dark:border-slate-700">
                        {['All', 'Client', 'Create'].map((source) => (
                            <button
                                key={source}
                                onClick={() => handleSourceFilterChange(source)}
                                className={`px-8 py-2.5 rounded-full text-sm font-bold transition-all ${sourceFilter === source
                                    ? 'bg-primary text-white shadow-lg'
                                    : 'text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-white'
                                    }`}
                            >
                                {source === 'All' ? 'Semua' : source}
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* Category Filter Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="flex flex-wrap justify-center gap-3 mb-12"
                >
                    {categories.map((category) => (
                        <motion.button
                            key={category}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleFilterChange(category)}
                            className={`px-6 py-2.5 rounded-full font-semibold transition-all shadow-sm ${filter === category
                                ? 'bg-primary text-white shadow-primary/20'
                                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-brand-emerald-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                                }`}
                        >
                            {category === 'All' ? 'Semua Kategori' : category}
                        </motion.button>
                    ))}
                </motion.div>

                {/* Projects Grid */}
                <motion.div
                    layout
                    className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
                >
                    {displayedProjects.map((project, index) => (
                        <motion.div
                            key={project.id}
                            layout
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ delay: index * 0.05, duration: 0.3 }}
                        >
                            <ProjectCard
                                project={project}
                                onClick={handleProjectClick}
                            />
                        </motion.div>
                    ))}
                </motion.div>

                {/* Show More / Show Less Button */}
                {finalFilteredProjects.length > 3 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="flex justify-center"
                    >
                        <button
                            onClick={handleShowMore}
                            className="px-8 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-semibold rounded-full hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
                        >
                            {hasMoreProjects ? "Lihat Selengkapnya" : "Lebih Sedikit"}
                        </button>
                    </motion.div>
                )}

                {/* Empty State */}
                {finalFilteredProjects.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20"
                    >
                        <p className="text-slate-500 dark:text-slate-400 text-lg">
                            Tidak ada project dalam kategori ini
                        </p>
                    </motion.div>
                )}
            </div>

            {/* Project Modal */}
            <ProjectModal
                project={selectedProject}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
            />
        </section>
    );
};

export default ProjectGallery;
