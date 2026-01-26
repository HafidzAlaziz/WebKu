
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const SEO = ({
    title,
    description,
    keywords,
    image,
    type = 'website'
}) => {
    const { t } = useTranslation();
    const location = useLocation();
    const baseUrl = 'https://www.web-kuu.my.id';
    const currentUrl = `${baseUrl}${location.pathname}`;
    const defaultImage = `${baseUrl}/logo.png`;

    const finalTitle = title ? `${title} | WebKuu` : t('meta.default.title');
    const finalDescription = description || t('meta.default.description');
    const finalImage = image || defaultImage;

    const { i18n } = useTranslation();

    return (
        <Helmet htmlAttributes={{ lang: i18n.language }}>
            {/* Basic Meta Tags */}
            <title>{finalTitle}</title>
            <meta name="description" content={finalDescription} />
            {keywords && <meta name="keywords" content={keywords} />}
            <link rel="canonical" href={currentUrl} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={currentUrl} />
            <meta property="og:title" content={finalTitle} />
            <meta property="og:description" content={finalDescription} />
            <meta property="og:image" content={finalImage} />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={currentUrl} />
            <meta property="twitter:title" content={finalTitle} />
            <meta property="twitter:description" content={finalDescription} />
            <meta property="twitter:image" content={finalImage} />
        </Helmet>
    );
};

export default SEO;
