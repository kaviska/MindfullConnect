"use client";

import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";

export default function StatsCard() {
    const [stats, setStats] = useState<{
        total: number;
        resolved: number;
        resolvedThisMonth: number;
        pending: number;
    } | null>(null);

    useEffect(() => {
        fetch("/api/reports/stat")
            .then(res => res.json())
            .then(data => {
                console.log("Stats fetched:", data);
                setStats(data);
            })
            .catch(err => console.error("Error fetching stats:", err));
    }, []);

    if (!stats) return <p className="text-center">Loading stats...</p>;

    const resolvedPercentage = stats.total > 0
        ? ((stats.resolvedThisMonth / stats.total) * 100).toFixed(1)
        : "0";

    const data = [
        {
            label: "Total Reports",
            value: stats.total,
            change: `${((stats.resolved + stats.pending) / stats.total * 100).toFixed(1)}%`,
            changeType: "increase",
        },
        {
            label: "Resolved",
            value: stats.resolved,
            change: `${resolvedPercentage}%`,
            changeType: "increase",
        },
        {
            label: "Pending",
            value: stats.pending,
            change: null,
            changeType: null,
        },
    ];

    return (
        <div className="bg-white rounded-3xl shadow-md flex justify-between p-8 md:p-10 space-x-32">
            {data.map((stat, idx) => (
                <div key={idx} className="flex items-center space-x-4">
                    <div className="bg-green-100 p-3 rounded-full">
                        <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M13 7a3 3 0 11-6 0 3 3 0 016 0zM4 14a4 4 0 014-4h4a4 4 0 014 4v1H4v-1z" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-gray-500 text-lg">{stat.label}</p>
                        <h2 className="text-3xl font-bold text-gray-800">{stat.value}</h2>
                        {stat.change && (
                            <div className="flex items-center text-m mt-1">
                                {stat.changeType === "increase" ? (
                                    <ArrowUp className="w-4 h-4 text-green-600 mr-1" />
                                ) : (
                                    <ArrowDown className="w-4 h-4 text-rose-600 mr-1" />
                                )}
                                <span className={stat.changeType === "increase" ? "text-green-600" : "text-rose-600"}>
                                    {stat.change} this month
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
