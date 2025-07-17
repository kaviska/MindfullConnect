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
}

const Chart = () => {
    const [data, setData] = useState<ChartData[]>([]);

    useEffect(() => {
        fetch("/api/dashboard/chart")
            .then((res) => res.json())
            .then((data) => setData(data))
            .catch((err) => console.error("Chart fetch failed:", err));
    }, []);

    return (
        <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                    <CartesianGrid stroke="#e0e0e0" strokeDasharray="5 5" />
                    <XAxis dataKey="month" />
                    <YAxis
                        domain={[0, 100000]} // Fix Y-axis scale
                        tickCount={6}
                    />
                    <Tooltip />
                    <Line
                        type="monotone"
                        dataKey="total"
                        stroke="#1C3172"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default Chart;
