// TimeSlotSelector Component
// IMPORT: No types needed for this component
interface TimeSlotSelectorProps {
  timeSlots: string[];
  selectedTimeSlot: string | null;
  selectTimeSlot: (timeSlot: string) => void;
}

export default function TimeSlotSelector({ timeSlots, selectedTimeSlot, selectTimeSlot }: TimeSlotSelectorProps) {
  const handleTimeSlotClick = (slot: string): void => {
    selectTimeSlot(slot);
  };

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-4">
        <svg className="w-5 h-5 text-[#0369a1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="text-lg font-semibold text-[#0f172a]">Available Time Slots</h3>
      </div>
      <div className="bg-[#f8fafc] p-4 rounded-[12px] mb-4">
        <p className="text-sm text-[#64748b] italic">
          You can book one time slot at a time. After attending your scheduled session, you'll be able to book additional sessions if needed.
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {timeSlots.map((slot) => (
          <button
            key={slot}
            className={`p-3 border-2 border-[#e2e8f0] rounded-[12px] text-center font-semibold transition-all ${
              selectedTimeSlot === slot
                ? 'border-[#0369a1] bg-[#0369a1] text-white'
                : 'hover:border-[#0369a1] hover:bg-[#f0f9ff]'
            }`}
            onClick={() => handleTimeSlotClick(slot)}
            aria-label={`Select time slot ${slot}`}
          >
            {slot}
          </button>
        ))}
      </div>
    </div>
  );
}