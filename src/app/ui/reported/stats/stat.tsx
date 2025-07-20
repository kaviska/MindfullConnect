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
        fetch("/admind/api/reports/stat")
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
        <div className="bg-white rounded-3xl shadow-md p-4 sm:p-6 md:p-8 lg:p-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                {data.map((stat, idx) => (
                    <div key={idx} className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 bg-gray-50 rounded-2xl lg:bg-transparent lg:p-0">
                        <div className="bg-green-100 p-2 sm:p-3 rounded-full flex-shrink-0">
                            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M13 7a3 3 0 11-6 0 3 3 0 016 0zM4 14a4 4 0 014-4h4a4 4 0 014 4v1H4v-1z" />
                            </svg>
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-gray-500 text-sm sm:text-base lg:text-lg font-medium truncate">
                                {stat.label}
                            </p>
                            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 leading-tight">
                                {stat.value}
                            </h2>
                            <div className="flex items-center text-xs sm:text-sm mt-1 min-h-[1.25rem] sm:min-h-[1.5rem]">
                                {stat.change ? (
                                    <>
                                        {stat.changeType === "increase" ? (
                                            <ArrowUp className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 mr-1 flex-shrink-0" />
                                        ) : (
                                            <ArrowDown className="w-3 h-3 sm:w-4 sm:h-4 text-rose-600 mr-1 flex-shrink-0" />
                                        )}
                                        <span className={`truncate ${stat.changeType === "increase" ? "text-green-600" : "text-rose-600"}`}>
                                            {stat.change} this month
                                        </span>
                                    </>
                                ) : (
                                    <span className="text-gray-400 text-xs sm:text-sm">
                                        Current active
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
