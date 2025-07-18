import { BookedSession } from '../../types';

interface BookingSummaryProps {
  bookings: BookedSession[];
}

export default function BookingSummary({ bookings }: BookingSummaryProps) {
  const completedSessions = bookings.filter((booking) => booking.status === 'completed').length;
  const totalSessions = bookings.length;

  return (
    <div className="bg-[#f8fafc] p-4 rounded-[12px]">
      <h3 className="text-lg font-semibold text-[#0f172a] mb-2">Your Booking Summary</h3>
      <p className="text-sm text-[#64748b] mb-2">
        You've completed <span className="font-semibold text-[#0369a1]">{completedSessions}</span> out of{' '}
        <span className="font-semibold text-[#0369a1]">{totalSessions}</span> booked sessions.
      </p>
      <p className="text-sm text-[#64748b] italic">
        You're doing great! Keep showing up for your wellness journey.
      </p>
    </div>
  );
}