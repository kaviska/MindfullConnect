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

interface SessionData {
    _id: string;
    patientId: {
        firstname: string;
        lastname: string;
        email: string;
    };
    counselorId: {
        firstname: string;
        lastname: string;
        email: string;
    };
    date: string;
    time: string;
    duration: number;
    status: string;
    createdAt: string;
}

const RecentSessions = () => {
    const [sessions, setSessions] = useState<SessionData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const response = await fetch('/api/sessions');
                if (response.ok) {
                    const data = await response.json();
                    // Get only the 4 most recent sessions
                    setSessions(data.slice(0, 4));
                } else {
                    console.error('Failed to fetch sessions');
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
            month: 'long', 
            year: 'numeric' 
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'text-green-600';
            case 'confirmed':
                return 'text-blue-600';
            case 'pending':
                return 'text-yellow-600';
            case 'cancelled':
                return 'text-red-600';
            default:
                return 'text-gray-600';
        }
    };

    if (loading) {
        return (
            <div className="bg-white p-5 rounded-xl">
                <div className="text-center text-gray-500">Loading recent sessions...</div>
            </div>
        );
    }

    if (sessions.length === 0) {
        return (
            <div className="bg-white p-5 rounded-xl">
                <div className="text-center text-gray-500">No sessions found</div>
            </div>
        );
    }

    return (
        <div className="bg-white p-5 rounded-xl space-y-3">
            {sessions.map((session) => (
                <div key={session._id} className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <img src="/rsessions.png" alt="session" className="w-9 h-9 rounded-md" />
                        <div className="text-sm text-gray-800">
                            <div className="font-semibold">
                                {session.patientId?.firstname} {session.patientId?.lastname} 
                                {' → '} 
                                {session.counselorId?.firstname} {session.counselorId?.lastname}
                            </div>
                            <div className="text-xs text-gray-500">
                                {formatDate(session.date)} at {session.time}
                            </div>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-sm text-gray-600">{session.duration} min</div>
                        <div className={`text-xs capitalize ${getStatusColor(session.status)}`}>
                            {session.status}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default RecentSessions;

