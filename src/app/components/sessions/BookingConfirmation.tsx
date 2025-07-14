// Update BookingConfirmation.tsx to show booking details
interface BookingConfirmationProps {
  isPolicyAccepted: boolean;
  setIsPolicyAccepted: (value: boolean) => void;
  handleBookSession: () => void;
  isDisabled: boolean;
  isBooking?: boolean;
  selectedDate?: string;
  selectedTimeSlot?: string;
  counselorName?: string;
}

export default function BookingConfirmation({
  isPolicyAccepted,
  setIsPolicyAccepted,
  handleBookSession,
  isDisabled,
  isBooking = false,
  selectedDate,
  selectedTimeSlot,
  counselorName
}: BookingConfirmationProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-[#0f172a] mb-4">
        Booking Confirmation
      </h3>
      
      {/* Show booking summary when both date and time are selected */}
      {selectedDate && selectedTimeSlot && (
        <div className="bg-[#f8fafc] p-4 rounded-[12px] border border-[#e2e8f0] mb-4">
          <h4 className="font-medium text-[#0f172a] mb-2">Session Details:</h4>
          <div className="space-y-1 text-sm text-[#64748b]">
            <p><span className="font-medium">Counselor:</span> {counselorName}</p>
            <p><span className="font-medium">Date:</span> {selectedDate}</p>
            <p><span className="font-medium">Time:</span> {selectedTimeSlot}</p>
            <p><span className="font-medium">Duration:</span> 55 minutes</p>
            <p><span className="font-medium">Status:</span> Pending confirmation</p>
          </div>
        </div>
      )}

      {/* Policy Acceptance */}
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          id="policy"
          checked={isPolicyAccepted}
          onChange={(e) => setIsPolicyAccepted(e.target.checked)}
          disabled={isBooking}
          className="mt-1 w-4 h-4 text-[#0369a1] border-gray-300 rounded focus:ring-[#0369a1] disabled:opacity-50"
        />
        <label htmlFor="policy" className="text-sm text-[#64748b]">
          I agree to the{' '}
          <a href="#" className="text-[#0369a1] hover:underline">
            terms and conditions
          </a>{' '}
          and{' '}
          <a href="#" className="text-[#0369a1] hover:underline">
            cancellation policy
          </a>
        </label>
      </div>

      {/* Book Session Button */}
      <button
        onClick={handleBookSession}
        disabled={isDisabled}
        className={`
          w-full py-3 px-6 rounded-[12px] font-medium transition-all duration-200
          ${isDisabled 
            ? 'bg-[#e2e8f0] text-[#94a3b8] cursor-not-allowed' 
            : 'bg-[#0369a1] text-white hover:bg-[#0284c7] shadow-lg hover:shadow-xl'
          }
        `}
      >
        {isBooking ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Booking Session...
          </div>
        ) : (
          'Book Session'
        )}
      </button>
    </div>
  );
}