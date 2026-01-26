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

import { useTranslation } from 'react-i18next';

const HomePage = () => {
    const { t } = useTranslation();
    return (
        <>
            <SEO
                title={t('meta.home.title')}
                description={t('meta.home.description')}
                keywords={t('meta.home.keywords')}
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
