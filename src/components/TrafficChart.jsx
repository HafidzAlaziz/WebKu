import React, { useMemo } from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import { useTranslation } from 'react-i18next';

const TrafficChart = ({ data }) => {
    const { t, i18n } = useTranslation();

    // 1. Memoize data to prevent unnecessary re-processing
    // Ensure we always have an array
    const chartData = useMemo(() => {
        if (!Array.isArray(data)) return [];
        return data;
    }, [data]);

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);

        // Map app language codes to standard locale strings
        const localeMap = {
            'en': 'en-US',
            'id': 'id-ID',
            'es': 'es-ES',
            'fr': 'fr-FR',
            'ja': 'ja-JP'
        };

        const locale = localeMap[i18n.language] || 'en-US';

        return new Intl.DateTimeFormat(locale, {
            day: 'numeric',
            month: 'short'
        }).format(date);
    };

    return (
        // Container with explicit height constraints
        <div className="w-full h-[300px] min-h-[300px] bg-transparent">
            {/* 
                debounce={200}: Delays resize calculations to prevent thrashing
                width="99%": Prevents 100% width loop bug
             */}
            <ResponsiveContainer width="99%" height="100%" debounce={200}>
                <AreaChart
                    data={chartData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                    <defs>
                        <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1} />
                            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                        </linearGradient>
                    </defs>

                    <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#E2E8F0"
                        opacity={0.3}
                    />

                    <XAxis
                        dataKey="date"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#94A3B8', fontSize: 12 }}
                        dy={10}
                        interval="preserveEnd" // or use a number if too crowded
                        tickFormatter={(value) => formatDate(value)}
                    />

                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#94A3B8', fontSize: 12 }}
                        allowDecimals={false}
                        // Simple domain logic: Start at 0, let max be auto (or at least 5)
                        domain={[0, dataMax => (dataMax < 5 ? 5 : 'auto')]}
                        width={80} // Keep wide width for numbers
                        tickMargin={10}
                    />

                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#1E293B',
                            borderRadius: '8px',
                            border: 'none',
                            color: '#fff',
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                        }}
                        itemStyle={{ color: '#fff' }}
                        cursor={{ stroke: '#3B82F6', strokeWidth: 1, strokeDasharray: '4 4' }}
                        isAnimationActive={false} // No tooltip animation
                        labelFormatter={(value) => formatDate(value)}
                        formatter={(value, name) => [value, t('dashboard.stats.total_views').replace('Total ', '')]}
                    />

                    <Area
                        type="monotone"
                        dataKey="views"
                        name={t('dashboard.stats.total_views')}
                        stroke="#3B82F6"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorViews)"
                        isAnimationActive={false} // No chart animation (critical)
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default TrafficChart;
