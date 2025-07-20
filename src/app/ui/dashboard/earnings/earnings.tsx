"use client";

import { useEffect, useState } from 'react';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

interface EarningsData {
    currentMonth: {
        earnings: number;
        sessions: number;
        completed: number;
        confirmed: number;
        month: string;
    };
    previousMonth: {
        earnings: number;
        sessions: number;
        completed: number;
        confirmed: number;
    };
    total: {
        earnings: number;
        sessions: number;
        completed: number;
        confirmed: number;
    };
    growth: {
        earnings: string;
        sessions: string;
    };
    sessionPrice: number;
}

const EarningsInfo = () => {
    const [data, setData] = useState<EarningsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const fetchEarnings = async () => {
            try {
                const response = await fetch('/admind/api/dashboard/earnings');
                if (response.ok) {
                    const earningsData = await response.json();
                    setData(earningsData);
                }
            } catch (error) {
                console.error('Error fetching earnings:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchEarnings();
    }, []);

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                        <div className="bg-gray-100 p-6 rounded-lg">
                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (!data) {
        return (
            <div className="flex items-center justify-center p-12 bg-gray-50 rounded-lg">
                <div className="text-center">
                    <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <AttachMoneyIcon className="text-gray-400" fontSize="large" />
                    </div>
                    <p className="text-gray-500">No earnings data available</p>
                </div>
            </div>
        );
    }

    const isPositiveGrowth = parseFloat(data.growth.earnings) >= 0;

    // Helper function to safely format numbers
    const formatCurrency = (amount: number) => {
        return mounted ? amount.toLocaleString() : amount.toString();
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Current Month Earnings */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between mb-3">
                    <div className="p-2 bg-blue-500 rounded-lg">
                        <AttachMoneyIcon className="text-white" fontSize="small" />
                    </div>
                    <div className={`flex items-center gap-1 text-sm ${isPositiveGrowth ? 'text-green-600' : 'text-red-500'}`}>
                        {isPositiveGrowth ? 
                            <TrendingUpIcon fontSize="small" /> : 
                            <TrendingDownIcon fontSize="small" />
                        }
                        <span className="font-medium">{data.growth.earnings}%</span>
                    </div>
                </div>
                <div>
                    <p className="text-sm text-blue-700 font-medium">{data.currentMonth.month} Earnings</p>
                    <p className="text-2xl font-bold text-blue-900">
                        LKR {formatCurrency(data.currentMonth.earnings)}
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                        {data.currentMonth.sessions} sessions this month
                    </p>
                </div>
            </div>

            {/* Session Price */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border border-green-200">
                <div className="flex items-center justify-between mb-3">
                    <div className="p-2 bg-green-500 rounded-lg">
                        <span className="text-white text-sm font-bold">₨</span>
                    </div>
                </div>
                <div>
                    <p className="text-sm text-green-700 font-medium">Session Rate</p>
                    <p className="text-2xl font-bold text-green-900">
                        LKR {formatCurrency(data.sessionPrice)}
                    </p>
                    <p className="text-xs text-green-600 mt-1">
                        Per therapy session
                    </p>
                </div>
            </div>

            {/* Completed Sessions */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg border border-purple-200">
                <div className="flex items-center justify-between mb-3">
                    <div className="p-2 bg-purple-500 rounded-lg">
                        <span className="text-white text-lg">✓</span>
                    </div>
                </div>
                <div>
                    <p className="text-sm text-purple-700 font-medium">Completed</p>
                    <p className="text-2xl font-bold text-purple-900">
                        {data.currentMonth.completed}
                    </p>
                    <p className="text-xs text-purple-600 mt-1">
                        Sessions completed
                    </p>
                </div>
            </div>

            {/* Total Lifetime */}
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-lg border border-orange-200">
                <div className="flex items-center justify-between mb-3">
                    <div className="p-2 bg-orange-500 rounded-lg">
                        <span className="text-white text-lg">🏆</span>
                    </div>
                </div>
                <div>
                    <p className="text-sm text-orange-700 font-medium">Total Lifetime</p>
                    <p className="text-2xl font-bold text-orange-900">
                        LKR {formatCurrency(data.total.earnings)}
                    </p>
                    <p className="text-xs text-orange-600 mt-1">
                        {data.total.sessions} total sessions
                    </p>
                </div>
            </div>
        </div>
    );
};

export default EarningsInfo;
