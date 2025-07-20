'use client';

import GroupsIcon from '@mui/icons-material/Groups';
import PersonIcon from '@mui/icons-material/Person';
import EventIcon from '@mui/icons-material/Event';
import { useEffect, useState } from 'react';

interface CardProps {
    title?: string;
    endpoint?: string;
    defaultValue?: number;
    icon?: 'groups' | 'person' | 'event';
    color?: string;
}

const Card = ({ 
    title = "Total Patients", 
    endpoint = "/admind/api/patient", 
    defaultValue = 0,
    icon = 'groups',
    color = '#1C3172'
}: CardProps) => {
    const [count, setCount] = useState<number>(defaultValue);
    const [loading, setLoading] = useState(true);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const getIcon = () => {
        switch (icon) {
            case 'person':
                return <PersonIcon fontSize="medium" />;
            case 'event':
                return <EventIcon fontSize="medium" />;
            case 'groups':
            default:
                return <GroupsIcon fontSize="medium" />;
        }
    };

    useEffect(() => {
        const fetchCount = async () => {
            try {
                const response = await fetch(endpoint);
                if (response.ok) {
                    const data = await response.json();
                    
                    // Handle different API response structures
                    if (endpoint.includes('counsellors') || endpoint.includes('patient')) {
                        // Counselors and Patient APIs return { users: [...] }
                        setCount(data.users ? data.users.length : 0);
                    } else if (endpoint.includes('reports/stat')) {
                        // Reports stats API returns { total: number, ... }
                        setCount(data.total || 0);
                    } else if (endpoint.includes('sessions')) {
                        // Sessions API returns { sessions: [...], count: number }
                        setCount(data.count || (data.sessions ? data.sessions.length : 0));
                    } else if (Array.isArray(data)) {
                        // Fallback for arrays
                        setCount(data.length);
                    } else if (data.count !== undefined) {
                        setCount(data.count);
                    } else {
                        setCount(defaultValue);
                    }
                } else {
                    setCount(defaultValue);
                }
            } catch (error) {
                console.error(`Error fetching ${title}:`, error);
                setCount(defaultValue);
            } finally {
                setLoading(false);
            }
        };

        fetchCount();
    }, [endpoint, title, defaultValue]);

    return (
        <div 
            className="w-full bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300 cursor-pointer group"
        >
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
                    <div className="flex items-baseline">
                        <h2 className="text-3xl font-bold text-gray-900">
                            {loading ? (
                                <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
                            ) : (
                                mounted ? count.toLocaleString() : count.toString()
                            )}
                        </h2>
                    </div>
                </div>
                <div 
                    className="flex items-center justify-center w-12 h-12 rounded-lg group-hover:scale-110 transition-transform duration-300"
                    style={{ backgroundColor: color + '20' }}
                >
                    <div style={{ color: color }}>
                        {getIcon()}
                    </div>
                </div>
            </div>
            
            {/* Progress indicator */}
            <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-1">
                    <div 
                        className="h-1 rounded-full transition-all duration-500"
                        style={{ 
                            backgroundColor: color, 
                            width: loading ? '0%' : '85%' 
                        }}
                    ></div>
                </div>
            </div>
        </div>
    );
};

export default Card;