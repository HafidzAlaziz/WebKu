import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Services from '../components/Services';
import Pricing from '../components/Pricing';
import Testimonials from '../components/Testimonials';
import CTA from '../components/CTA';
import Footer from '../components/Footer';

const HomePage = () => {
    return (
        <>
            <Navbar />
            <main>
                <Hero />
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
