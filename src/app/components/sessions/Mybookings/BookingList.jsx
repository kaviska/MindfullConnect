import BookingCard from './BookingCard';

export default function BookingList({ bookings, activeTab, handleCancel, handleReschedule }) {
  return (
    <div className="mb-6">
      {bookings.length > 0 ? (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              isUpcoming={activeTab === 'upcoming'}
              handleCancel={handleCancel}
              handleReschedule={handleReschedule}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <svg
            className="w-16 h-16 mx-auto mb-4 text-[#64748b]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          <p className="text-[#64748b] text-sm mb-4">
            You haven’t booked any sessions yet. Start your wellness journey now.
          </p>
          <a
            href="/session"
            className="inline-block py-3 px-6 bg-gradient-to-r from-[#0369a1] to-[#0284c7] text-white rounded-[12px] font-semibold hover:bg-gradient-to-r hover:from-[#0284c7] hover:to-[#0369a1] transition-all"
            aria-label="Book a session"
          >
            Book a Session
          </a>
        </div>
      )}
    </div>
  );
}