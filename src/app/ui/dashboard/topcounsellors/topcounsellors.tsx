"use client";

import { useEffect, useState } from 'react';
import Topcounsellor from '../topcounsellor/topcounsellor';

interface CounselorData {
    _id: string;
    firstname: string;
    lastname: string;
    email: string;
    sessionCount?: number;
}

const TopCounsellors = () => {
    const [counselors, setCounselors] = useState<CounselorData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCounselors = async () => {
            try {
                const response = await fetch('/admind/api/counsellors/active');
                if (response.ok) {
                    const data = await response.json();
                    // Get first 6 counselors or fill with empty slots
                    const counselorList = data.users || [];
                    const displayList = [...counselorList.slice(0, 6)];
                    
                    // Fill remaining slots with null for loading state
                    while (displayList.length < 6) {
                        displayList.push(null);
                    }
                    
                    setCounselors(displayList);
                } else {
                    console.error('Failed to fetch counselors');
                    // Create 6 empty slots for error state
                    setCounselors(new Array(6).fill(null));
                }
            } catch (error) {
                console.error('Error fetching counselors:', error);
                setCounselors(new Array(6).fill(null));
            } finally {
                setLoading(false);
            }
        };

        fetchCounselors();
    }, []);

    return (
        <div className="grid grid-cols-3 gap-6 bg-white p-6 rounded-xl gap-y-3 items-center">
            {counselors.map((counselor, index) => (
                <Topcounsellor 
                    key={counselor?._id || `empty-${index}`} 
                    counselor={counselor} 
                />
            ))}
        </div>
    );
};

export default TopCounsellors;
