import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProjectGallery from '../components/portfolio/ProjectGallery';
import ClientTestimonials from '../components/portfolio/ClientTestimonials';
import PortfolioCTA from '../components/portfolio/PortfolioCTA';

const PortfolioPage = () => {
    return (
        <>
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
