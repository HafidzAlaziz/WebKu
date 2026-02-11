// Mobile Card Component for Orders Tab
// This component provides a card-based layout for mobile devices
// while the desktop version uses a table

const OrderCard = ({ order, onEdit, onDelete, formatCurrency, getStatusColor, t, i18n }) => (
    <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-4 border border-slate-200 dark:border-slate-700">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-sm uppercase">
                    {order.customerName.substring(0, 2)}
                </div>
                <div>
                    <p className="font-bold text-slate-900 dark:text-white text-sm">{order.customerName}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{order.date}</p>
                </div>
            </div>
            <span className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase ${getStatusColor(order.status)}`}>
                {t(`dashboard.recent_orders.status.${order.status}`) || order.status}
            </span>
        </div>

        {/* Details */}
        <div className="mb-3 pb-3 border-b border-slate-200 dark:border-slate-700">
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-1">{order.details}</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">
                {formatCurrency(order.total, i18n.language, t)}
            </p>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
            <button
                onClick={() => onEdit(order)}
                className="flex-1 py-2 px-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl text-sm font-bold hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors flex items-center justify-center gap-2"
            >
                <Edit size={16} />
                Edit
            </button>
            <button
                onClick={() => onDelete(order.id)}
                className="flex-1 py-2 px-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-sm font-bold hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors flex items-center justify-center gap-2"
            >
                <Trash2 size={16} />
                Hapus
            </button>
        </div>
    </div>
);

export default OrderCard;
