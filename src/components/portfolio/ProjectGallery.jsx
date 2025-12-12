import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ProjectCard from './ProjectCard';
import ProjectModal from './ProjectModal';

// Sample project data - you can replace this with your actual projects
const projectsData = [
    {
        id: 0,
        name: "Aura Visuals",
        type: "Company Profile",
        thumbnail: "https://company-profile-xi-indol.vercel.app/images/portfolio-1.jpg",
        shortDescription: "Website company profile profesional untuk layanan fotografi",
        fullDescription: "Website company profile modern untuk Aura Visuals yang menampilkan layanan fotografi, portfolio, dan daftar harga. Desain elegan dengan nuansa monokrom dan emas, dilengkapi animasi yang halus.",
        duration: "1 Minggu",
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
        id: 1,
        name: "E-Commerce Fashion Store",
        type: "Toko Online",
        thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
        shortDescription: "Platform e-commerce modern untuk toko fashion dengan sistem pembayaran terintegrasi",
        fullDescription: "Website e-commerce lengkap dengan fitur keranjang belanja, checkout, payment gateway, dan admin dashboard untuk mengelola produk dan pesanan. Desain modern dan responsif dengan performa tinggi.",
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
        id: 2,
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
        id: 3,
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
        id: 4,
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
        id: 5,
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
        id: 6,
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
    }
];

const ProjectGallery = () => {
    const [selectedProject, setSelectedProject] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filter, setFilter] = useState('All');

    const categories = ['All', 'Toko Online', 'Company Profile', 'Landing Page', 'Portfolio', 'Learning Management System'];

    const filteredProjects = filter === 'All'
        ? projectsData
        : projectsData.filter(project => project.type === filter);

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

                {/* Filter Buttons */}
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
                            onClick={() => setFilter(category)}
                            className={`px-6 py-2.5 rounded-full font-medium transition-all ${filter === category
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                                }`}
                        >
                            {category}
                        </motion.button>
                    ))}
                </motion.div>

                {/* Projects Grid */}
                <motion.div
                    layout
                    className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {filteredProjects.map((project, index) => (
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

                {/* Empty State */}
                {filteredProjects.length === 0 && (
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
