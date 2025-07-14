import { useState } from 'react';
import { useAvailableSlots } from '@/app/hooks/useAvailableSlots';
import TimeSlotSelector from './TimeSlotSelector';
import SessionDurationNote from './SessionDurationNote';
import BookedSessionList from './BookedSessionList';
import BookingConfirmation from './BookingConfirmation';

interface BookingModalProps {
  isOpen: boolean;
  closeModal: () => void;
  selectedCounselor: { _id: string; [key: string]: any } | null;
  onBookingSuccess?: (sessionData: any) => void; // ✅ Change this line
  bookedSessions: any[];
}

export default function BookingModal({ 
  isOpen, 
  closeModal, 
  selectedCounselor, 
  onBookingSuccess, // ✅ Update this
  bookedSessions
}: BookingModalProps) {
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [isPolicyAccepted, setIsPolicyAccepted] = useState<boolean>(false);
  const [isBooking, setIsBooking] = useState<boolean>(false);

  console.log('🎯 BookingModal props:', { 
    selectedCounselor: selectedCounselor?._id, 
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

  // ✅ Implement the actual booking function
  const handleBookSession = async () => {
    if (!selectedTimeSlot || !selectedDate || !selectedCounselor?._id) {
      console.error('Missing required data for booking');
      return;
    }

    setIsBooking(true);

    try {
      console.log('📅 Booking session:', {
        counselorId: selectedCounselor._id,
        date: selectedDate,
        time: selectedTimeSlot
      });

      const response = await fetch('/api/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies for authentication
        body: JSON.stringify({
          counselorId: selectedCounselor._id,
          date: selectedDate,
          time: selectedTimeSlot,
        }),
      });

      const data = await response.json();
      console.log('📋 Booking response:', data);

      if (response.ok) {
        // ✅ Session booked successfully
        alert(`Session booked successfully! 
        Session ID: ${data.session._id}
        Date: ${data.session.date}
        Time: ${data.session.time}
        Status: ${data.session.status}`);
        
        // Call the parent's bookSession function to update UI
        onBookingSuccess?.(data.session);
        
        // Refresh available slots to remove the booked slot
        refetch();
        
        // Reset form
        setSelectedTimeSlot(null);
        setIsPolicyAccepted(false);
        
        // Close modal after successful booking
        setTimeout(() => {
          closeModal();
        }, 2000);
        
      } else {
        // ❌ Handle booking errors
        console.error('Booking failed:', data.error);
        alert(`Booking failed: ${data.error}`);
      }

    } catch (error) {
      console.error('Error booking session:', error);
      alert('Failed to book session. Please try again.');
    } finally {
      setIsBooking(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[1000]">
      <div className="bg-white rounded-[20px] p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
        
        {/* Close Button */}
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 text-[#64748b] hover:text-[#0f172a] transition-colors z-10"
          aria-label="Close modal"
          disabled={isBooking} // Disable during booking
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-[#0f172a] mb-2">
            Book Session with {selectedCounselor?.name || 'Counselor'}
          </h2>
          <p className="text-[#64748b]">
            Select your preferred date and time slot
          </p>
        </div>

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
            disabled={isBooking} // Disable during booking
            className="w-full p-3 border border-[#e2e8f0] rounded-[12px] focus:outline-none focus:ring-2 focus:ring-[#0369a1] disabled:opacity-50"
          />
        </div>

        {/* Time Slot Selector */}
        <TimeSlotSelector
          timeSlots={timeSlots}
          selectedTimeSlot={selectedTimeSlot}
          selectTimeSlot={setSelectedTimeSlot}
          loading={loading}
          error={error}
          disabled={isBooking} // Pass disabled state
        />

        {/* Section 2: Session Duration Note */}
        <SessionDurationNote />

        <hr className="my-6 border-[#e2e8f0]" />

        {/* Section 3: Your Booked Sessions Overview */}
        <BookedSessionList bookedSessions={bookedSessions} />

        <hr className="my-6 border-[#e2e8f0]" />

        {/* Section 4: Booking Confirmation */}
        <BookingConfirmation
          isPolicyAccepted={isPolicyAccepted}
          setIsPolicyAccepted={setIsPolicyAccepted}
          handleBookSession={handleBookSession}
          isDisabled={!selectedTimeSlot || !isPolicyAccepted || isBooking}
          isBooking={isBooking} // Pass loading state
          selectedDate={selectedDate}
          selectedTimeSlot={selectedTimeSlot || undefined}
          counselorName={selectedCounselor?.name}
        />
      </div>
    </div>
  );
}