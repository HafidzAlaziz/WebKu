import React, { useMemo } from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine
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
                key={chartData.length + (chartData[0]?.date || '')}: Re-triggers entry animation on data update
             */}
            <ResponsiveContainer width="99%" height="100%" debounce={200} key={chartData.length + (chartData[0]?.date || '')}>
                <AreaChart
                    data={chartData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                    <defs>
                        <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1} />
                        </linearGradient>
                        <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#10B981" stopOpacity={0.1} />
                        </linearGradient>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.1} />
                        </linearGradient>
                        <linearGradient id="colorCancelled" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#EF4444" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#EF4444" stopOpacity={0.1} />
                        </linearGradient>
                    </defs>

                    <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#E2E8F0"
                        opacity={0.1}
                    />

                    <XAxis
                        dataKey="date"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#94A3B8', fontSize: 12 }}
                        dy={10}
                        interval="preserveStartEnd"
                        tickFormatter={(value) => formatDate(value)}
                    />

                    <YAxis
                        yAxisId="left"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#94A3B8', fontSize: 12 }}
                        allowDecimals={false}
                        domain={([dataMin, dataMax]) => {
                            const max = Math.max(Math.abs(dataMin || 0), Math.abs(dataMax || 0), 1);
                            return [-max, max];
                        }}
                        width={30}
                        tickMargin={4}
                    />

                    <YAxis
                        yAxisId="right"
                        orientation="right"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#F59E0B', fontSize: 10 }}
                        tickFormatter={(value) => {
                            const val = Math.abs(value);
                            const sign = value < 0 ? '-' : '';

                            if (val >= 1000000) return sign + (val / 1000000).toFixed(1) + 'M';
                            if (val >= 1000) return sign + (val / 1000).toFixed(0) + 'K';
                            return sign + val;
                        }}
                        domain={([dataMin, dataMax]) => {
                            const max = Math.max(Math.abs(dataMin || 0), Math.abs(dataMax || 0), 1000);
                            return [-max, max];
                        }}
                        width={40}
                        tickMargin={4}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#1E293B',
                            borderRadius: '12px',
                            border: '1px solid rgba(255,255,255,0.1)',
                            color: '#fff',
                            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                            padding: '12px'
                        }}
                        itemStyle={{ padding: '2px 0' }}
                        cursor={{ stroke: '#3B82F6', strokeWidth: 1, strokeDasharray: '4 4' }}
                        isAnimationActive={false}
                        labelFormatter={(value) => formatDate(value)}
                        formatter={(value, name) => {
                            if (name === t('dashboard.charts.revenue') || name === t('dashboard.charts.cancelled_revenue')) {
                                return [
                                    new Intl.NumberFormat(stats.locale, {
                                        style: 'currency',
                                        currency: stats.currency,
                                        maximumFractionDigits: 0
                                    }).format(value),
                                    name
                                ];
                            }
                            return [value, name];
                        }}
                    />

                    <ReferenceLine yAxisId="right" y={0} stroke="#94A3B8" strokeOpacity={0.3} strokeDasharray="3 3" />

                    <Area
                        yAxisId="left"
                        type="monotone"
                        dataKey="views"
                        name={t('dashboard.charts.views')}
                        stroke="#3B82F6"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorViews)"
                        isAnimationActive={true}
                        animationDuration={1500}
                        animationEasing="ease-in-out"
                    />

                    <Area
                        yAxisId="left"
                        type="monotone"
                        dataKey="orders"
                        name={t('dashboard.charts.orders')}
                        stroke="#10B981"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorOrders)"
                        isAnimationActive={true}
                        animationDuration={1500}
                        animationEasing="ease-in-out"
                    />

                    <Area
                        yAxisId="right"
                        type="monotone"
                        dataKey="revenue"
                        name={t('dashboard.charts.revenue')}
                        stroke="#F59E0B"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorRevenue)"
                        baseValue={0}
                        isAnimationActive={true}
                        animationDuration={1500}
                        animationEasing="ease-in-out"
                    />

                    <Area
                        yAxisId="right"
                        type="monotone"
                        dataKey="cancelledRevenue"
                        name={t('dashboard.charts.cancelled_revenue')}
                        stroke="#EF4444"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorCancelled)"
                        baseValue={0}
                        isAnimationActive={true}
                        animationDuration={1500}
                        animationEasing="ease-in-out"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div >
    );
};

export default TrafficChart;
