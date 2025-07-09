export default function BookingConfirmation({ isPolicyAccepted, setIsPolicyAccepted, handleBookSession, isDisabled }) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-4">
        <input
          type="checkbox"
          id="policy"
          checked={isPolicyAccepted}
          onChange={(e) => setIsPolicyAccepted(e.target.checked)}
          className="w-5 h-5 text-[#0369a1] border-[#e2e8f0] rounded focus:ring-[#0369a1]"
          aria-label="Accept session booking policy"
        />
        <label htmlFor="policy" className="text-sm text-[#64748b]">
          I have read and understood the session booking policy.
        </label>
      </div>
      <button
        className={`w-full py-4 px-6 bg-gradient-to-r from-[#10b981] to-[#059669] text-white border-none rounded-[12px] font-semibold cursor-pointer transition-all ${
          isDisabled ? 'opacity-50 pointer-events-none' : 'hover:-translate-y-[2px] hover:shadow-[0_4px_15px_rgba(16,185,129,0.3)]'
        }`}
        onClick={handleBookSession}
        disabled={isDisabled}
        aria-label="Book session"
      >
        Book Session
      </button>
    </div>
  );
}