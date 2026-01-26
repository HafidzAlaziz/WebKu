
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

const SEO = ({
    title,
    description,
    keywords,
    image,
    type = 'website'
}) => {
    const location = useLocation();
    const baseUrl = 'https://www.web-kuu.my.id';
    const currentUrl = `${baseUrl}${location.pathname}`;
    const defaultImage = `${baseUrl}/logo.png`;

    const finalTitle = title ? `${title} | WebKuu` : 'WebKuu | Solusi Digital & Pembuatan Website Premium';
    const finalDescription = description || 'WebKuu menyediakan jasa pembuatan website profesional, landing page, dan solusi digital kreatif untuk bisnis Anda. Transformasikan ide Anda menjadi kenyataan.';
    const finalImage = image || defaultImage;

    return (
        <Helmet>
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
