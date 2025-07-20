"use client";

import { useEffect, useState } from 'react';

interface Session {
    _id: string;
    patientId: {
        _id: string;
        fullName: string;
    };
    counselorId: {
        _id: string;
        name: string;
    };
    date: string;
    status: string;
    sessionType: string;
}

const RecentSessions = () => {
    const [sessions, setSessions] = useState<Session[]>([]);
    const [loading, setLoading] = useState(true);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const response = await fetch('/admind/api/sessions');
                if (response.ok) {
                    const data = await response.json();
                    // Get the 5 most recent sessions
                    const recentSessions = data.sessions ? data.sessions.slice(0, 5) : [];
                    setSessions(recentSessions);
                }
            } catch (error) {
                console.error('Error fetching sessions:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSessions();
    }, []);

    const formatDate = (dateStr: string) => {
        if (!mounted) return dateStr;
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { 
            day: 'numeric', 
            month: 'short', 
            year: 'numeric' 
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'text-green-600 bg-green-100';
            case 'confirmed':
                return 'text-blue-600 bg-blue-100';
            case 'pending':
                return 'text-yellow-600 bg-yellow-100';
            case 'cancelled':
                return 'text-red-600 bg-red-100';
            default:
                return 'text-gray-600 bg-gray-100';
        }
    };

    if (loading) {
        return (
            <div className="space-y-3 max-h-[280px]">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                            <div className="w-8 h-8 bg-gray-200 rounded-full flex-shrink-0"></div>
                            <div className="flex-1 space-y-2 min-w-0">
                                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                <div className="h-2 bg-gray-200 rounded w-1/3"></div>
                            </div>
                            <div className="w-12 h-5 bg-gray-200 rounded flex-shrink-0"></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (sessions.length === 0) {
        return (
            <div className="text-center py-6 max-h-[280px] flex flex-col justify-center">
                <div className="w-12 h-12 bg-gray-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <span className="text-gray-400 text-lg">📅</span>
                </div>
                <p className="text-gray-500 text-sm">No recent sessions found</p>
            </div>
        );
    }

    return (
        <div className="space-y-3 max-h-[280px] overflow-y-auto">
            {sessions.slice(0, 4).map((session) => (
                <div key={session._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-xs font-medium">
                                {session.patientId?.fullName?.charAt(0) || 'P'}
                            </span>
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="font-medium text-gray-900 text-sm truncate">
                                {session.patientId?.fullName || 'Unknown Patient'}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                                with {session.counselorId?.name || 'Unknown Counselor'}
                            </p>
                            <p className="text-xs text-gray-400">
                                {formatDate(session.date)}
                            </p>
                        </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
                            {session.status}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default RecentSessions;
