import { useState } from 'react';
import { useAvailableSlots } from '@/app/hooks/useAvailableSlots';
import TimeSlotSelector from './TimeSlotSelector';

// ...other imports

interface BookingModalProps {
  isOpen: boolean;
  closeModal: () => void;
  selectedCounselor: { _id: string; [key: string]: any } | null;
  bookSession: (slot: string, date: string) => void;
  bookedSessions: any[]; // Replace 'any' with a more specific type if available
}

export default function BookingModal({ 
  isOpen, 
  closeModal, 
  selectedCounselor, 
  bookSession,
  bookedSessions
}: BookingModalProps) {
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [isPolicyAccepted, setIsPolicyAccepted] = useState<boolean>(false);

 // Add console logs here
  console.log('🎯 BookingModal props:', { 
    selectedCounselor: selectedCounselor?.id, 
    selectedDate 
  });

  // Use the hook to fetch available slots
  const { timeSlots, loading, error, refetch } = useAvailableSlots({
    counselorId: selectedCounselor?._id || null,
    date: selectedDate
  });


  
  console.log('🎣 Main hook results:', { timeSlots, loading, error });
  
  const handleDateChange = (newDate: string) => {
    setSelectedDate(newDate);
    setSelectedTimeSlot(null); // Reset selected slot when date changes
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[1000]">
      <div className="bg-white rounded-[20px] p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Date Selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-[#0f172a] mb-2">
            Select Date:
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => handleDateChange(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="w-full p-3 border border-[#e2e8f0] rounded-[12px] focus:outline-none focus:ring-2 focus:ring-[#0369a1]"
          />
        </div>

        {/* Time Slot Selector */}
        <TimeSlotSelector
          timeSlots={timeSlots}
          selectedTimeSlot={selectedTimeSlot}
          selectTimeSlot={setSelectedTimeSlot}
          loading={loading}
          error={error}
        />

        {/* Other components... */}
      </div>
    </div>
  );
}