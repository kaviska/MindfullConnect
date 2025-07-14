import { useState, useEffect } from 'react';

interface UseAvailableSlotsProps {
  counselorId: string | null;
  date: string | null;
}

interface UseAvailableSlotsReturn {
  timeSlots: string[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useAvailableSlots = ({ counselorId, date }: UseAvailableSlotsProps): UseAvailableSlotsReturn => {
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAvailableSlots = async () => {
    if (!counselorId || !date) {
      setTimeSlots([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/sessions/available?counselorId=${counselorId}&date=${date}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch available slots');
      }

      const data = await response.json();
      setTimeSlots(data.availableSlots || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setTimeSlots([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailableSlots();
  }, [counselorId, date]);

  return {
    timeSlots,
    loading,
    error,
    refetch: fetchAvailableSlots
  };
};