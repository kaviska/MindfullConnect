// ✅ Update MyBookingModal.tsx
"use client";
import { useState, useEffect } from 'react';
import Tabs from './Tabs';
import BookingFilters from './BookingFilters';
import BookingList from './BookingList';
import BookingSummary from './BookingSummary';
import { BookedSession } from '../../types';

interface MyBookingsModalProps {
  isOpen: boolean;
  closeModal: () => void;
}

export default function MyBookingsModal({ isOpen, closeModal }: MyBookingsModalProps) {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [counselorFilter, setCounselorFilter] = useState('');
  const [dateRange, setDateRange] = useState('');
  const [bookings, setBookings] = useState<BookedSession[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  // ✅ Track multiple cancelling sessions by ID
  const [cancellingIds, setCancellingIds] = useState<Set<string>>(new Set());

  // ✅ Fetch sessions from backend
  const fetchSessions = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/sessions/my", {
        credentials: 'include',
      });

      const data = await res.json();
      if (res.ok) {
        const sessionsWithUpcoming = data.sessions.map((session: BookedSession) => ({
          ...session,
          isUpcoming: new Date(`${session.date}T${session.time}`) > new Date(),
          avatar: `https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=80&h=80&fit=crop&crop=face&auto=format&seed=${session.counselor.id}`
        }));
        setBookings(sessionsWithUpcoming);
      } else {
        console.error("❌ Error loading sessions:", data.error);
      }
    } catch (err) {
      console.error("❌ Network error loading sessions:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchSessions();
    }
  }, [isOpen]);

  const filteredBookings = bookings.filter((booking) => {
    const matchesCounselor = counselorFilter
      ? booking.counselor.name.toLowerCase().includes(counselorFilter.toLowerCase())
      : true;
    
    const matchesDate = dateRange
      ? (() => {
          const [selectedYear, selectedMonth] = dateRange.split('-');
          const [bookingYear, bookingMonth] = booking.date.split('-');
          return selectedYear === bookingYear && selectedMonth === bookingMonth;
        })()
      : true;
    
    const isUpcoming = new Date(`${booking.date}T${booking.time}`) > new Date();
    const matchesTab = activeTab === 'upcoming' ? isUpcoming : !isUpcoming;
    
    return matchesCounselor && matchesDate && matchesTab;
  });

  // ✅ Updated handleCancel to track individual sessions
  const handleCancel = async (sessionId: string) => {
    if (!confirm('Are you sure you want to cancel this session? This action cannot be undone.')) {
      return;
    }

    // ✅ Add this session ID to cancelling set
    setCancellingIds(prev => new Set(prev).add(sessionId));

    try {
      const res = await fetch(`/api/sessions/${sessionId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      const data = await res.json();
      if (res.ok) {
        setBookings(prev => prev.map(booking => 
          booking.id === sessionId 
            ? { ...booking, status: 'cancelled' as const }
            : booking
        ));
        alert('Session cancelled successfully!');
      } else {
        alert(data.error || 'Failed to cancel session');
      }
    } catch (err) {
      console.error('❌ Error cancelling session:', err);
      alert('Network error. Please try again.');
    } finally {
      // ✅ Remove this session ID from cancelling set
      setCancellingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(sessionId);
        return newSet;
      });
    }
  };

  const handleReschedule = (sessionId: string) => {
    console.log(`Reschedule session ${sessionId}`);
    alert('Rescheduling feature coming soon!');
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[1000] transition-opacity duration-300"
      onClick={closeModal}
    >
      <div
        className="bg-white rounded-[20px] p-6 sm:p-10 max-w-[700px] w-[90%] max-h-[80vh] overflow-y-auto transform scale-100 transition-transform duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-[#0f172a]">My Bookings</h2>
          <button
            className="bg-transparent border-none text-2xl cursor-pointer text-[#64748b] p-2 rounded-full hover:bg-[#f1f5f9] hover:text-[#0369a1] transition-all"
            onClick={closeModal}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

        <BookingFilters
          counselorFilter={counselorFilter}
          setCounselorFilter={setCounselorFilter}
          dateRange={dateRange}
          setDateRange={setDateRange}
        />

        {/* ✅ Pass cancellingIds instead of single isDeleting */}
        <BookingList
          bookings={filteredBookings}
          activeTab={activeTab}
          handleCancel={handleCancel}
          handleReschedule={handleReschedule}
          cancellingIds={cancellingIds} // ✅ Pass Set of IDs
          isLoading={isLoading}
        />

        <BookingSummary bookings={bookings} />
      </div>
    </div>
  );
}