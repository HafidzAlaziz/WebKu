import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaTag, FaArrowRight } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const BlogCard = ({ post }) => {
    const { t, i18n } = useTranslation();
    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group border border-slate-100 dark:border-slate-700 flex flex-col h-full">
            <div className="relative overflow-hidden h-48 sm:h-56">
                <img
                    src={post.image || null}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                />
                <div className="absolute top-4 left-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide shadow-md">
                    {post.category}
                </div>
            </div>

            <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center text-slate-500 dark:text-slate-400 text-sm mb-3 space-x-4">
                    <div className="flex items-center">
                        <FaCalendarAlt className="mr-2" />
                        <span>{new Date(post.date).toLocaleDateString(i18n.language, { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    </div>
                </div>

                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-3 leading-tight group-hover:text-primary dark:group-hover:text-brand-emerald-400 transition-colors">
                    <Link to={`/blog/${post.slug}`}>
                        {post.title}
                    </Link>
                </h3>

                <p className="text-slate-600 dark:text-slate-300 text-sm mb-4 line-clamp-3">
                    {post.excerpt}
                </p>

                <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-700">
                    <Link
                        to={`/blog/${post.slug}`}
                        className="inline-flex items-center text-primary dark:text-brand-emerald-400 font-semibold hover:text-primary-light dark:hover:text-brand-emerald-300 transition-colors"
                    >
                        {t('blog.readMore')} <FaArrowRight className="ml-2 w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default BlogCard;
