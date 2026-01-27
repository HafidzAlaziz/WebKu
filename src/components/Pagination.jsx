import React from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    return (
        <div className="flex justify-center items-center space-x-2 mt-12">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-3 rounded-lg border transition-all ${currentPage === 1
                        ? 'border-slate-200 text-slate-300 dark:border-slate-700 dark:text-slate-600 cursor-not-allowed'
                        : 'border-slate-300 text-slate-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700'
                    }`}
            >
                <FaChevronLeft />
            </button>

            {[...Array(totalPages)].map((_, i) => (
                <button
                    key={i}
                    onClick={() => onPageChange(i + 1)}
                    className={`w-10 h-10 rounded-lg font-bold transition-all ${currentPage === i + 1
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                        }`}
                >
                    {i + 1}
                </button>
            ))}

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-3 rounded-lg border transition-all ${currentPage === totalPages
                        ? 'border-slate-200 text-slate-300 dark:border-slate-700 dark:text-slate-600 cursor-not-allowed'
                        : 'border-slate-300 text-slate-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700'
                    }`}
            >
                <FaChevronRight />
            </button>
        </div>
    );
};

export default Pagination;
