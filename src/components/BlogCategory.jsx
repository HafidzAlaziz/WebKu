import React, { useState } from 'react';
import { FaFolderOpen, FaSearch, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const BlogCategory = ({ categories, selectedCategory, onSelectCategory }) => {
    const { t } = useTranslation();
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Filter categories
    const filteredCategories = categories.filter(category =>
        category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Pagination logic
    const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentCategories = filteredCategories.slice(startIndex, startIndex + itemsPerPage);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Reset to first page on search
    };

    const handlePrevPage = () => {
        setCurrentPage(prev => Math.max(prev - 1, 1));
    };

    const handleNextPage = () => {
        setCurrentPage(prev => Math.min(prev + 1, totalPages));
    };

    return (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md border border-slate-100 dark:border-slate-700 mb-8">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center">
                <FaFolderOpen className="mr-2 text-primary" /> {t('blog.categories')}
            </h3>

            {/* Search Input */}
            <div className="relative mb-4">
                <input
                    type="text"
                    placeholder={t('dashboard.blog.search_placeholder') || "Cari kategori..."}
                    value={searchTerm}
                    onChange={handleSearch}
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary dark:text-white transition-all"
                />
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            </div>

            {/* Category List */}
            <ul className="space-y-2 mb-4">
                {currentCategories.length > 0 ? (
                    currentCategories.map((category, index) => (
                        <li key={index}>
                            <button
                                onClick={() => onSelectCategory(category)}
                                className={`w-full text-left px-4 py-2 rounded-lg transition-all text-sm font-medium flex justify-between items-center ${selectedCategory === category
                                    ? 'bg-brand-emerald-50 dark:bg-primary/30 text-primary dark:text-brand-emerald-400 border-l-4 border-primary'
                                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-primary'
                                    }`}
                            >
                                <span className="truncate">{category === 'All' ? t('blog.all') : category}</span>
                            </button>
                        </li>
                    ))
                ) : (
                    <li className="text-sm text-slate-400 text-center py-2 italic">
                        {t('common.no_results') || "Tidak ditemukan"}
                    </li>
                )}
            </ul>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
                    <button
                        onClick={handlePrevPage}
                        disabled={currentPage === 1}
                        className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                    >
                        <FaChevronLeft size={12} />
                    </button>

                    <span className="text-xs text-slate-400 font-medium">
                        {startIndex + 1} - {Math.min(startIndex + itemsPerPage, filteredCategories.length)} {t('dashboard.pagination.of')} {filteredCategories.length}
                    </span>

                    <button
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                        className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                    >
                        <FaChevronRight size={12} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default BlogCategory;
