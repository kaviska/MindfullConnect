"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const data = [
    { name: 'Patient', value: 63 },
    { name: 'Counsellor', value: 37 },
];

const COLORS = ['#1C3172', '#B4BDC8'];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
}: {
    cx: number;
    cy: number;
    midAngle: number;
    innerRadius: number;
    outerRadius: number;
    percent: number;
    index: number;
}) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};

const Piechart = () => {
    return (
        <div className="bg-white p-5 rounded-xl w-full h-[320px] flex flex-col items-center justify-between shadow-sm">
            <h1 className="text-xl font-semibold text-gray-800 mb-4">January</h1>
            <div className="w-[180px] h-[180px]">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={renderCustomizedLabel}
                            outerRadius={90}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
            </div>

            {/* Legend Section */}
            <div className="flex justify-around w-full  bg-white  rounded-xl py-3 px-6">
                {data.map((entry, index) => (
                    <div key={entry.name} className="flex flex-col items-center space-y-1">
                        <div className="flex items-center space-x-1">
                            <span className={`w-2.5 h-2.5 rounded-full`} style={{ backgroundColor: COLORS[index] }}></span>
                            <span className="text-sm text-gray-500 capitalize">{entry.name}</span>
                        </div>

                    </div>
                ))}
            </div>
        </div>
    );
};

export default Piechart;
