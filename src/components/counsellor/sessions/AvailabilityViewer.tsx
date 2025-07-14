"use client";

import React, { useState, useEffect } from 'react';
import { format, addDays, startOfWeek } from 'date-fns';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface Availability {
  date: string;
  availableSlots: string[];
}

const AvailabilityViewer: React.FC = () => {
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const today = new Date(); // 2025-07-14
    const startDate = startOfWeek(today, { weekStartsOn: 1 }); // Monday
    console.log('Week start date:', format(startDate, 'yyyy-MM-dd'));
    fetchAvailability(startDate);
  }, []);

  const fetchAvailability = async (startDate: Date) => {
    setIsLoading(true);
    setError(null);
    const weekStartStr = format(startDate, 'yyyy-MM-dd');
    console.log(`Fetching availability for weekStart: ${weekStartStr}`);
    try {
      const response = await axios.get(
        `/api/availability?weekStart=${weekStartStr}`,
        { withCredentials: true }
      );
      console.log('Fetch response:', response.data);
      setAvailabilities(response.data.availabilities || []);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to fetch availability';
      setError(errorMessage);
      console.error('Fetch error:', {
        message: errorMessage,
        status: err.response?.status,
        url: `/api/availability?weekStart=${weekStartStr}`,
        details: err.response?.data || err.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = () => {
    router.push('/counsellor/sessions/editAvailability');
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Your Weekly Availability</h2>

      {error && <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">{error}</div>}

      {isLoading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4 mb-4">
          {Array.from({ length: 7 }, (_, i) => {
            const date = format(addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), i), 'yyyy-MM-dd');
            const dayAvailability = availabilities.find(a => a.date === date) || { availableSlots: [] };
            return (
              <div key={date} className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">{format(new Date(date), 'EEEE, MMM d')}</h3>
                <ul className="text-sm">
                  {dayAvailability.availableSlots.length > 0 ? (
                    dayAvailability.availableSlots.map(slot => (
                      <li key={slot} className="py-1">{slot}</li>
                    ))
                  ) : (
                    <li className="text-gray-500">No slots selected</li>
                  )}
                </ul>
              </div>
            );
          })}
        </div>
      )}

      <button
        onClick={handleEditClick}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
        disabled={isLoading}
      >
        Edit Availability
      </button>
    </div>
  );
};

export default AvailabilityViewer;