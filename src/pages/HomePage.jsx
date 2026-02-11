import React, { Suspense, lazy } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import StatsShowcase from '../components/StatsShowcase';
import PortfolioPreview from '../components/PortfolioPreview';
import Services from '../components/Services';
const Pricing = lazy(() => import('../components/Pricing'));
const Testimonials = lazy(() => import('../components/Testimonials'));
const CTA = lazy(() => import('../components/CTA'));
const Footer = lazy(() => import('../components/Footer'));

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
                <Suspense fallback={<div className="h-40" />}>
                    <Pricing />
                </Suspense>
                <Suspense fallback={<div className="h-40" />}>
                    <Testimonials />
                </Suspense>
                <Suspense fallback={<div className="h-40" />}>
                    <CTA />
                </Suspense>
            </main>
            <Suspense fallback={<div className="h-20" />}>
                <Footer />
            </Suspense>
        </>
    );
};

export default HomePage;
