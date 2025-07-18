"use client";

import React, { useState, useEffect } from 'react';
import { format, addDays, startOfWeek } from 'date-fns';
import axios from 'axios';

interface TimeSlot {
  time: string;
  selected: boolean;
}

interface DayAvailability {
  date: string;
  slots: TimeSlot[];
}

const timeSlots = Array.from({ length: 48 }, (_, i) => {
  const hours = Math.floor(i / 2).toString().padStart(2, '0');
  const minutes = i % 2 === 0 ? '00' : '30';
  return `${hours}:${minutes}`;
}); // Generates 00:00, 00:30, ..., 23:30

const AvailabilitySelector: React.FC = () => {
  const [weekAvailability, setWeekAvailability] = useState<DayAvailability[]>([]);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize week with empty slots
  useEffect(() => {
    const startDate = startOfWeek(new Date(), { weekStartsOn: 1 }); // Monday start
    const weekDays: DayAvailability[] = Array.from({ length: 7 }, (_, i) => ({
      date: format(addDays(startDate, i), 'yyyy-MM-dd'),
      slots: timeSlots.map(time => ({ time, selected: false })),
    }));
    setWeekAvailability(weekDays);
    fetchAvailability(weekDays);
  }, []);

  // Fetch existing availability
  const fetchAvailability = async (days: DayAvailability[]) => {
    setIsLoading(true);
    try {
      for (const day of days) {
        const response = await axios.get(`/api/availability?date=${day.date}`, {
          withCredentials: true, // Include cookies for authentication
        });
        if (response.data.availability) {
          setWeekAvailability(prev => prev.map(d =>
            d.date === day.date
              ? {
                  ...d,
                  slots: timeSlots.map(time => ({
                    time,
                    selected: response.data.availability.availableSlots.includes(time),
                  })),
                }
              : d
          ));
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch availability');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle slot toggle
  const toggleSlot = (date: string, time: string) => {
    setWeekAvailability(prev => prev.map(day =>
      day.date === date
        ? {
            ...day,
            slots: day.slots.map(slot =>
              slot.time === time ? { ...slot, selected: !slot.selected } : slot
            ),
          }
        : day
    ));
  };

  // Save availability for a specific day
  const saveDayAvailability = async (day: DayAvailability) => {
    setIsLoading(true);
    setError(null);
    try {
      const selectedSlots = day.slots.filter(slot => slot.selected).map(slot => slot.time);
      const response = await axios.post(
        '/api/availability',
        {
          date: day.date,
          availableSlots: selectedSlots,
        },
        { withCredentials: true } // Include cookies for authentication
      );
      if (response.data.message) {
        alert(`Availability for ${format(new Date(day.date), 'EEEE, MMM d')} saved successfully`);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to save availability');
    } finally {
      setIsLoading(false);
    }
  };

  // Open/close day selection
  const handleDayClick = (date: string) => {
    setSelectedDay(selectedDay === date ? null : date);
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Set Your Weekly Availability</h2>

      {/* Week Days Display */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4 mb-4">
        {weekAvailability.map(day => (
          <button
            key={day.date}
            onClick={() => handleDayClick(day.date)}
            className={`p-4 rounded-lg text-center ${
              selectedDay === day.date
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            disabled={isLoading}
          >
            <div className="font-semibold">{format(new Date(day.date), 'EEEE')}</div>
            <div>{format(new Date(day.date), 'MMM d')}</div>
          </button>
        ))}
      </div>

      {/* Time Slots for Selected Day */}
      {selectedDay && (
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">
            Select Time Slots for {format(new Date(selectedDay), 'EEEE, MMM d')}
          </h3>
          <div className="grid grid-cols-4 gap-2 mb-4">
            {weekAvailability
              .find(day => day.date === selectedDay)
              ?.slots.map(slot => (
                <button
                  key={slot.time}
                  onClick={() => toggleSlot(selectedDay, slot.time)}
                  className={`p-2 rounded text-sm ${
                    slot.selected
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                  disabled={isLoading}
                >
                  {slot.time}
                </button>
              ))}
          </div>
          <button
            onClick={() => saveDayAvailability(weekAvailability.find(day => day.date === selectedDay)!)}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-green-300"
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Add Availability'}
          </button>
        </div>
      )}
    </div>
  );
};

export default AvailabilitySelector;