import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import StatsShowcase from '../components/StatsShowcase';
import PortfolioPreview from '../components/PortfolioPreview';
import Services from '../components/Services';
import Pricing from '../components/Pricing';
import Testimonials from '../components/Testimonials';
import CTA from '../components/CTA';
import Footer from '../components/Footer';

import SEO from '../components/SEO';

const HomePage = () => {
    return (
        <>
            <SEO
                title="Home"
                description="Jasa pembuatan website profesional, landing page, dan aplikasi web custom. Tim developer berpengalaman siap membantu digitalisasi bisnis Anda."
                keywords="jasa buat website, web developer indonesia, jasa landing page, bikin web murah, fullstack developer"
            />
            <Navbar />
            <main>
                <Hero />
                <PortfolioPreview />
                <Services />
                <Pricing />
                <Testimonials />
                <CTA />
            </main>
            <Footer />
        </>
    );
};

export default HomePage;
