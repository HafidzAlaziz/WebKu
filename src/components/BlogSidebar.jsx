import React from 'react';
import BlogSearch from './BlogSearch';
import BlogCategory from './BlogCategory';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const BlogSidebar = ({ categories, selectedCategory, onSelectCategory, onSearch, searchTerm }) => {
    const { t } = useTranslation();
    return (
        <aside className="w-full">
            <BlogSearch onSearch={onSearch} searchTerm={searchTerm} />

            <BlogCategory
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={onSelectCategory}
            />

            <div className="bg-gradient-to-br from-primary to-primary-dark p-6 rounded-xl shadow-lg text-white text-center">
                <h3 className="text-xl font-bold mb-3">{t('hero.title_part2')}?</h3>
                <p className="text-brand-emerald-100 text-sm mb-6">{t('hero.subtitle')}</p>
                <a
                    href="https://wa.me/6285122959690?text=Halo%20WebKuu!%20Saya%20tertarik%20dengan%20layanan%20pembuatan%20website"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block w-full py-3 bg-accent hover:bg-accent-light text-white font-bold rounded-lg transition-colors shadow-md"
                >
                    {t('hero.cta_start')}
                </a>
            </div>
        </aside>
    );
};

export default BlogSidebar;
