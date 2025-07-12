export default function BookingCard({ booking, isUpcoming, handleCancel, handleReschedule }) {
  const statusColors = {
    Confirmed: 'bg-[#10b981] text-white',
    Completed: 'bg-[#64748b] text-white',
    Cancelled: 'bg-[#e2e8f0] text-[#0f172a]',
  };

  return (
    <div className="bg-white p-4 rounded-[12px] shadow-[0_4px_25px_rgba(0,0,0,0.05)] border border-[#e2e8f0]">
      <div className="flex items-center gap-4 mb-4">
        <img
          src={booking.avatar}
          alt={booking.counselor}
          className="w-12 h-12 rounded-full object-cover border-2 border-[#e0f2fe]"
        />
        <div>
          <h3 className="text-base font-semibold text-[#0f172a]">{booking.counselor}</h3>
          <div className="flex items-center gap-2 text-sm">
            <svg className="w-4 h-4 text-[#0369a1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="font-semibold text-[#0369a1]">{booking.date}</span>
            <svg className="w-4 h-4 text-[#0369a1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="font-semibold text-[#0369a1]">
              {booking.time} – {booking.duration}
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span
          className={`inline-block py-1 px-3 rounded-full text-xs font-semibold ${statusColors[booking.status]}`}
        >
          Status: {booking.status}
        </span>
        {isUpcoming && (
          <div className="flex gap-2">
            <button
              className="py-2 px-4 bg-[#e2e8f0] text-[#0f172a] rounded-[8px] text-sm font-semibold hover:bg-[#d1d5db] transition-all"
              onClick={() => handleCancel(booking.id)}
              aria-label={`Cancel session with ${booking.counselor}`}
            >
              Cancel Session
            </button>
            <button
              className="py-2 px-4 bg-gradient-to-r from-[#0369a1] to-[#0284c7] text-white rounded-[8px] text-sm font-semibold hover:bg-gradient-to-r hover:from-[#0284c7] hover:to-[#0369a1] transition-all"
              onClick={() => handleReschedule(booking.id)}
              aria-label={`Reschedule session with ${booking.counselor}`}
            >
              Reschedule
            </button>
          </div>
        )}
      </div>
    </div>
  );
}