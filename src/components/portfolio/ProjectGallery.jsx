import React from 'react';
import { motion } from 'framer-motion';
import ProjectCard from './ProjectCard';

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
    return (
        <section id="project-gallery" className="py-20 bg-slate-50 dark:bg-slate-900">
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
                        Project Gallery
                    </h2>
                    <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                        Koleksi website custom yang telah kami kerjakan dengan berbagai teknologi modern
                    </p>
                </motion.div>

                {/* Projects Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projectsData.map((project, index) => (
                        <motion.div
                            key={project.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                        >
                            <ProjectCard project={project} />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ProjectGallery;
