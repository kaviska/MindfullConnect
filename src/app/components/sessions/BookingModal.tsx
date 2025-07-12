


// BookingModal Component - Fixed for hydration issues
 import { Counselor, BookedSession } from '../types';
import { useState } from 'react';

import TimeSlotSelector from './TimeSlotSelector';
import SessionDurationNote from './SessionDurationNote';
import BookedSessionList from './BookedSessionList';
import BookingConfirmation from './BookingConfirmation';
interface BookingModalProps {
  isOpen: boolean;
  closeModal: () => void;
  selectedCounselor: Counselor | null;
  timeSlots: string[];
  selectTimeSlot: (timeSlot: string) => void;
  selectedTimeSlot: string | null;
  bookSession: () => void;
  bookedSessions: BookedSession[]; // Move this to props instead of hardcoding
}

export default function BookingModal({ 
  isOpen, 
  closeModal, 
  selectedCounselor, 
  timeSlots, 
  selectTimeSlot, 
  selectedTimeSlot, 
  bookSession,
  bookedSessions // Now comes from props
}: BookingModalProps) {
  const [isPolicyAccepted, setIsPolicyAccepted] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleBookSession = (): void => {
    if (!selectedTimeSlot || !isPolicyAccepted) return;
    bookSession();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[1000] transition-opacity duration-300"
      onClick={closeModal}
    >
      <div
        className="bg-white rounded-[20px] p-6 sm:p-10 max-w-[600px] w-[90%] max-h-[80vh] overflow-y-auto transform scale-100 transition-transform duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-[#0f172a]">Schedule with {selectedCounselor?.name}</h2>
          <button
            className="bg-transparent border-none text-2xl cursor-pointer text-[#64748b] p-2 rounded-full hover:bg-[#f1f5f9] hover:text-[#0369a1] transition-all"
            onClick={closeModal}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        {/* Section 1: Time Slot Selection */}
        <TimeSlotSelector
          timeSlots={timeSlots}
          selectedTimeSlot={selectedTimeSlot}
          selectTimeSlot={selectTimeSlot}
        />

        <hr className="my-6 border-[#e2e8f0]" />

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
          isDisabled={!selectedTimeSlot || !isPolicyAccepted}
        />
      </div>
    </div>
  );
}