import { FaSearch } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const BlogSearch = ({ onSearch, searchTerm }) => {
    const { t } = useTranslation();
    return (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md border border-slate-100 dark:border-slate-700 mb-8">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">{t('blog.searchPlaceholder')}</h3>
            <div className="relative">
                <input
                    type="text"
                    placeholder={t('blog.searchPlaceholder')}
                    value={searchTerm}
                    onChange={(e) => onSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            </div>
        </div>
    );
};

export default BlogSearch;
