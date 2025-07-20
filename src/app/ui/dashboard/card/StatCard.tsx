import React from 'react';

interface StatCardProps {
    title: string;
    value: number;
    icon: React.ReactNode;
    bgColor: string;
    textColor: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, bgColor, textColor }) => {
    return (
        <div className={`p-6 rounded-xl bg-[#1C3172] shadow-lg transition-transform hover:scale-105`}>
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-white/80">{title}</h3>
                    <p className="text-3xl font-bold mt-3 text-white">{value}</p>
                </div>
                <div className="p-4 rounded-full bg-white/10 text-white">
                    {icon}
                </div>
            </div>
        </div>
    );
};

export default StatCard;
