"use client";
import { BookedSession } from '../../types';

interface BookingCardProps {
  booking: BookedSession;
  isUpcoming: boolean;
  handleCancel: (id: string) => void;
  handleReschedule: (id: string) => void;
  isDeleting?: boolean;
}

export default function BookingCard({ 
  booking, 
  isUpcoming, 
  handleCancel, 
  handleReschedule, 
  isDeleting = false 
}: BookingCardProps) {
  const statusColors: Record<string, string> = {
    confirmed: 'bg-[#10b981] text-white',
    completed: 'bg-[#64748b] text-white',
    cancelled: 'bg-[#e2e8f0] text-[#0f172a]',
    pending: 'bg-[#f59e0b] text-white',
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="bg-white p-4 rounded-[12px] shadow-[0_4px_25px_rgba(0,0,0,0.05)] border border-[#e2e8f0]">
      <div className="flex items-center gap-4 mb-4">
        <img
          src={booking.avatar || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=80&h=80&fit=crop&crop=face&auto=format'}
          alt={booking.counselor.name}
          className="w-12 h-12 rounded-full object-cover border-2 border-[#e0f2fe]"
        />
        <div>
          <h3 className="text-base font-semibold text-[#0f172a]">{booking.counselor.name}</h3>
          <p className="text-xs text-[#64748b] mb-1">{booking.counselor.specialty}</p>
          <div className="flex items-center gap-2 text-sm">
            <svg className="w-4 h-4 text-[#0369a1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="font-semibold text-[#0369a1]">{formatDate(booking.date)}</span>
            <svg className="w-4 h-4 text-[#0369a1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="font-semibold text-[#0369a1]">
              {booking.time} – {booking.duration} minutes
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span
          className={`inline-block py-1 px-3 rounded-full text-xs font-semibold ${statusColors[booking.status] || 'bg-gray-100 text-gray-700'}`}
        >
          Status: {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
        </span>
        {isUpcoming && booking.status !== 'cancelled' && (
          <div className="flex gap-2">
            <button
              className={`py-2 px-4 bg-[#e2e8f0] text-[#0f172a] rounded-[8px] text-sm font-semibold hover:bg-[#d1d5db] transition-all ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={() => handleCancel(booking.id)}
              disabled={isDeleting}
              aria-label={`Cancel session with ${booking.counselor.name}`}
            >
              {isDeleting ? 'Cancelling...' : 'Cancel Session'}
            </button>
            
          </div>
        )}
      </div>
    </div>
  );
}