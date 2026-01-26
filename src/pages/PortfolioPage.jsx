import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProjectGallery from '../components/portfolio/ProjectGallery';
import ClientTestimonials from '../components/portfolio/ClientTestimonials';
import PortfolioCTA from '../components/portfolio/PortfolioCTA';

import SEO from '../components/SEO';

import { useTranslation } from 'react-i18next';

const PortfolioPage = () => {
    const { t } = useTranslation();
    return (
        <>
            <SEO
                title={t('meta.portfolio.title')}
                description={t('meta.portfolio.description')}
                keywords={t('meta.portfolio.keywords')}
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
