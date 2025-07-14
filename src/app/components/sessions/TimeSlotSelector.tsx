interface TimeSlotSelectorProps {
  timeSlots: string[];
  selectedTimeSlot: string | null;
  selectTimeSlot: (timeSlot: string) => void;
  loading?: boolean;
  error?: string | null;
  disabled?: boolean;
}

export default function TimeSlotSelector({
  timeSlots,
  selectedTimeSlot,
  selectTimeSlot,
  loading = false,
  error = null,
  disabled = false,
}: TimeSlotSelectorProps) {
  const handleTimeSlotClick = (slot: string): void => {
    if (!disabled) {
      selectTimeSlot(slot);
    }
  };
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-4">
        <svg
          className="w-5 h-5 text-[#0369a1]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 className="text-lg font-semibold text-[#0f172a]">
          Available Time Slots
        </h3>
      </div>

      <div className="bg-[#f8fafc] p-4 rounded-[12px] mb-4">
        <p className="text-sm text-[#64748b] italic">
          You can book one time slot at a time. After attending your scheduled
          session, you'll be able to book additional sessions if needed.
        </p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0369a1]"></div>
          <span className="ml-2 text-[#64748b]">
            Loading available slots...
          </span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-[12px] p-4 mb-4">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* No Slots Available */}
      {!loading && !error && timeSlots.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-[12px] p-4 mb-4">
          <p className="text-yellow-700 text-sm">
            No available time slots for the selected date.
          </p>
        </div>
      )}

      {/* Time Slots Grid */}
      {!loading && !error && timeSlots.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {timeSlots.map((slot) => (
            <button
              key={slot}
              className={`p-3 border-2 rounded-[12px] text-center font-semibold transition-all ${
                disabled
                  ? "border-[#e2e8f0] bg-[#f1f5f9] text-[#94a3b8] cursor-not-allowed opacity-60"
                  : selectedTimeSlot === slot
                    ? "border-[#0369a1] bg-[#0369a1] text-white"
                    : "border-[#e2e8f0] hover:border-[#0369a1] hover:bg-[#f0f9ff] cursor-pointer"
              }`}
              onClick={() => !disabled && handleTimeSlotClick(slot)}
              disabled={disabled}
              aria-label={`Select time slot ${slot}`}
            >
              {slot}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
