// BookedSessionList Component - Fixed for hydration issues
 import { BookedSession } from '../types';
interface BookedSessionListProps {
  bookedSessions: BookedSession[];
}

export default function BookedSessionList({ bookedSessions = [] }: BookedSessionListProps) {
  // Add safety check
  const sessions = bookedSessions || [];
  
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-4">
        <svg className="w-5 h-5 text-[#0369a1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <h3 className="text-lg font-semibold text-[#0f172a]">Your Upcoming Booked Sessions</h3>
      </div>
      {sessions.length > 0 ? (
        <ul className="space-y-3">
          {sessions.map((session, index) => (
            <li key={`${session.date}-${session.time}-${session.counselor}`} className="flex items-center gap-3">
              <svg className="w-5 h-5 text-[#10b981] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>
                <span className="font-semibold text-[#0369a1]">{session.date}</span> –{' '}
                <span className="font-semibold text-[#0369a1]">{session.time}</span> with {session.counselor.name}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-[#64748b]">No upcoming sessions booked.</p>
      )}
    </div>
  );
}