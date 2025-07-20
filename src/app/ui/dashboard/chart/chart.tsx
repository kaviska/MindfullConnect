"use client";

import { useEffect, useState } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";

interface ChartData {
    month: string;
    total: number;
    sessions?: number;
    completed?: number;
    confirmed?: number;
}

const Chart = () => {
    const [data, setData] = useState<ChartData[]>([]);
    const [loading, setLoading] = useState(true);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Helper function to safely format numbers
    const formatCurrency = (amount: number) => {
        return mounted ? amount.toLocaleString() : amount.toString();
    };

    useEffect(() => {
        fetch("/admind/api/dashboard/chart")
            .then((res) => res.json())
            .then((data) => {
                setData(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Chart fetch failed:", err);
                setLoading(false);
            });
    }, []);

    // Custom tooltip to show earnings and session details
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-white p-3 border rounded-lg shadow-lg">
                    <p className="font-semibold text-gray-800">{label}</p>
                    <p className="text-blue-600">
                        Earnings: <span className="font-bold">LKR {formatCurrency(data.total)}</span>
                    </p>
                    {data.sessions !== undefined && (
                        <div className="text-sm text-gray-600 mt-1">
                            <p>Total Sessions: {data.sessions}</p>
                            <p>Completed: {data.completed}</p>
                            <p>Confirmed: {data.confirmed}</p>
                        </div>
                    )}
                </div>
            );
        }
        return null;
    };

    // Format Y-axis to show currency
    const formatYAxis = (value: number) => {
        if (value >= 100000) {
            return `LKR ${(value / 100000).toFixed(1)}L`;
        } else if (value >= 1000) {
            return `LKR ${(value / 1000).toFixed(0)}k`;
        }
        return `LKR ${value}`;
    };

    if (loading) {
        return (
            <div className="w-full h-[300px] flex items-center justify-center">
                <div className="text-gray-500">Loading earnings data...</div>
            </div>
        );
    }

    // Calculate dynamic Y-axis domain
    const maxValue = Math.max(...data.map(d => d.total));
    const yAxisMax = Math.ceil(maxValue * 1.2 / 1000) * 1000; // Round up to nearest thousand

    return (
        <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid stroke="#e0e0e0" strokeDasharray="5 5" />
                    <XAxis 
                        dataKey="month" 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: '#666' }}
                    />
                    <YAxis
                        domain={[0, yAxisMax]}
                        tickFormatter={formatYAxis}
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: '#666' }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                        type="monotone"
                        dataKey="total"
                        stroke="#1C3172"
                        strokeWidth={3}
                        dot={{ fill: '#1C3172', strokeWidth: 2, r: 5 }}
                        activeDot={{ r: 7, stroke: '#1C3172', strokeWidth: 2 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default Chart;
