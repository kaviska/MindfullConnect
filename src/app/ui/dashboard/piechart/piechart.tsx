"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useEffect, useState } from 'react';

interface ChartData {
    name: string;
    value: number;
}

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
    const [data, setData] = useState<ChartData[]>([
        { name: 'Patients', value: 0 },
        { name: 'Counsellors', value: 0 },
    ]);
    const [loading, setLoading] = useState(true);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/admind/api/dashboard/distribution');
                
                if (response.ok) {
                    const distributionData = await response.json();
                    setData(distributionData.distribution || [
                        { name: 'Patients', value: 0 },
                        { name: 'Counsellors', value: 0 },
                    ]);
                } else {
                    console.error('Failed to fetch distribution data');
                    // Fallback to original method
                    const [patientsResponse, counsellorsResponse] = await Promise.all([
                        fetch('/admind/api/patient'),
                        fetch('/admind/api/counsellors/active')
                    ]);

                    let patientsCount = 0;
                    let counsellorsCount = 0;

                    if (patientsResponse.ok) {
                        const patientsData = await patientsResponse.json();
                        patientsCount = patientsData.users ? patientsData.users.length : 0;
                    }

                    if (counsellorsResponse.ok) {
                        const counsellorsData = await counsellorsResponse.json();
                        counsellorsCount = counsellorsData.users ? counsellorsData.users.length : 0;
                    }

                    setData([
                        { name: 'Patients', value: patientsCount },
                        { name: 'Counsellors', value: counsellorsCount },
                    ]);
                }
            } catch (error) {
                console.error('Error fetching pie chart data:', error);
                // Set default empty data on error
                setData([
                    { name: 'Patients', value: 0 },
                    { name: 'Counsellors', value: 0 },
                ]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const currentMonth = mounted ? new Date().toLocaleString("default", { month: "long" }) : '';
    const totalUsers = data.reduce((sum, item) => sum + item.value, 0);

    // Prevent hydration mismatch by not rendering on server
    if (!mounted) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <div className="animate-pulse">
                    <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4"></div>
                    <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-24 mx-auto"></div>
                        <div className="h-4 bg-gray-200 rounded w-32 mx-auto"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-full flex flex-col">
            {loading ? (
                <div className="flex-1 flex items-center justify-center">
                    <div className="animate-pulse">
                        <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4"></div>
                        <div className="space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-24 mx-auto"></div>
                            <div className="h-4 bg-gray-200 rounded w-32 mx-auto"></div>
                        </div>
                    </div>
                </div>
            ) : totalUsers === 0 ? (
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                            <span className="text-gray-400 text-2xl">📊</span>
                        </div>
                        <p className="text-gray-500 text-sm">No data available</p>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col h-full">
                    {/* Chart Section */}
                    <div className="flex-1 flex items-center justify-center py-4">
                        <div className="w-[160px] h-[160px] md:w-[180px] md:h-[180px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={data}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={renderCustomizedLabel}
                                        outerRadius="80%"
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
                    </div>

                    {/* Legend Section */}
                    <div className="mt-4 space-y-3">
                        {data.map((entry, index) => (
                            <div key={entry.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center space-x-3">
                                    <span 
                                        className="w-4 h-4 rounded-full flex-shrink-0" 
                                        style={{ backgroundColor: COLORS[index] }}
                                    ></span>
                                    <span className="text-sm font-medium text-gray-700">{entry.name}</span>
                                </div>
                                <div className="text-right">
                                    <span className="text-lg font-bold text-[#1C3172]">{entry.value}</span>
                                    <span className="text-xs text-gray-500 ml-1">
                                        ({totalUsers > 0 ? Math.round((entry.value / totalUsers) * 100) : 0}%)
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Total Summary */}
                    <div className="mt-4 p-3 bg-[#1C3172] bg-opacity-5 rounded-lg">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-700">Total Users</span>
                            <span className="text-xl font-bold text-[#1C3172]">{totalUsers}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Piechart;
