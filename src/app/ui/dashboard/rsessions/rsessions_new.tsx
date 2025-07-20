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
            <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                        <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                            <div className="flex-1 space-y-2">
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                            </div>
                            <div className="w-16 h-6 bg-gray-200 rounded"></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (sessions.length === 0) {
        return (
            <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-gray-400 text-2xl">📅</span>
                </div>
                <p className="text-gray-500">No recent sessions found</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {sessions.map((session) => (
                <div key={session._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-medium">
                                {session.patientId?.fullName?.charAt(0) || 'P'}
                            </span>
                        </div>
                        <div>
                            <p className="font-medium text-gray-900 text-sm">
                                {session.patientId?.fullName || 'Unknown Patient'}
                            </p>
                            <p className="text-xs text-gray-500">
                                with {session.counselorId?.name || 'Unknown Counselor'}
                            </p>
                            <p className="text-xs text-gray-400">
                                {formatDate(session.date)}
                            </p>
                        </div>
                    </div>
                    <div className="text-right">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
                            {session.status}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default RecentSessions;
