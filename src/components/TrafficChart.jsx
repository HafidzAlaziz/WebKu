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

const TrafficChart = ({ data }) => {
    // 1. Memoize data to prevent unnecessary re-processing
    // Ensure we always have an array
    const chartData = useMemo(() => {
        if (!Array.isArray(data)) return [];
        return data; // Assume data is already formatted correctly by the hook
    }, [data]);

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
                        interval="preserveEnd"
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
                    />

                    <Area
                        type="monotone"
                        dataKey="views"
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
