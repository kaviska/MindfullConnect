import { ArrowDown, ArrowUp } from "lucide-react";

const stats = [
    {
        label: "Total Reports",
        value: "5,423",
        change: "16%",
        changeType: "increase",
        icon: (
            <div className="bg-green-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 7a3 3 0 11-6 0 3 3 0 016 0zM4 14a4 4 0 014-4h4a4 4 0 014 4v1H4v-1z" />
                </svg>
            </div>
        ),
    },
    {
        label: "Resolved",
        value: "1,893",
        change: "1%",
        changeType: "decrease",
        icon: (
            <div className="bg-green-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 7a3 3 0 11-6 0 3 3 0 016 0zM5 13h10v2H5v-2z" />
                </svg>
            </div>
        ),
    },
    {
        label: "Pending",
        value: "189",
        change: null,
        changeType: null,
        icon: (
            <div className="bg-green-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 4h12v10H4z M2 16h16v2H2z" />
                </svg>
            </div>
        ),
    },
];

export default function StatsCard() {
    return (
        <div className="bg-white rounded-3xl shadow-md flex justify-between p-6 md:p-10 space-x-6">
            {stats.map((stat, idx) => (
                <div key={idx} className="flex items-center space-x-4">
                    {stat.icon}
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
