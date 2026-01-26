import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProjectGallery from '../components/portfolio/ProjectGallery';
import ClientTestimonials from '../components/portfolio/ClientTestimonials';
import PortfolioCTA from '../components/portfolio/PortfolioCTA';

import SEO from '../components/SEO';

const PortfolioPage = () => {
    return (
        <>
            <SEO
                title="Portofolio Project"
                description="Lihat koleksi project website yang telah kami kerjakan. Dari landing page UMKM hingga sistem informasi perusahaan skala besar."
                keywords="portofolio web developer, contoh website, hasil karya web, project showcase"
            />
            <Navbar />
            <main className="pt-20">
                <ProjectGallery />
                <ClientTestimonials />
                <PortfolioCTA />
            </main>
            <Footer />
        </>
    );
};

export default PortfolioPage;
