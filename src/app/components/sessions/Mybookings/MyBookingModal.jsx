"use client";
import { useState } from 'react';
import Tabs from './Tabs';
import BookingFilters from './BookingFilters';
import BookingList from './BookingList';
import BookingSummary from './BookingSummary';

export default function MyBookingsModal({ isOpen, closeModal }) {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [counselorFilter, setCounselorFilter] = useState('');
  const [dateRange, setDateRange] = useState('');

  if (!isOpen) return null;

  const bookings = [
    {
      id: 1,
      counselor: 'Dr. Alex Smith',
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=80&h=80&fit=crop&crop=face&auto=format',
      date: 'July 15, 2025',
      time: '10:00 AM',
      duration: '55 minutes',
      status: 'Confirmed',
      isUpcoming: true,
    },
    {
      id: 2,
      counselor: 'Dr. Priya Sharma',
      avatar: 'https://images.unsplash.com/photo-1594824954908-a64e3f9e3f0c?w=80&h=80&fit=crop&crop=face&auto=format',
      date: 'July 10, 2025',
      time: '02:30 PM',
      duration: '55 minutes',
      status: 'Completed',
      isUpcoming: false,
    },
    {
      id: 3,
      counselor: 'Dr. Michael Chen',
      avatar: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=80&h=80&fit=crop&crop=face&auto=format',
      date: 'July 20, 2025',
      time: '04:00 PM',
      duration: '55 minutes',
      status: 'Confirmed',
      isUpcoming: true,
    },
    {
      id: 4,
      counselor: 'Dr. Emily Rodriguez',
      avatar: 'https://images.unsplash.com/photo-1594824954908-a64e3f9e3f0c?w=80&h=80&fit=crop&crop=face&auto=format',
      date: 'July 5, 2025',
      time: '09:00 AM',
      duration: '55 minutes',
      status: 'Cancelled',
      isUpcoming: false,
    },
  ];

  const filteredBookings = bookings.filter((booking) => {
    const matchesCounselor = counselorFilter
      ? booking.counselor.toLowerCase().includes(counselorFilter.toLowerCase())
      : true;
    const matchesDate = dateRange
      ? booking.date.includes(dateRange)
      : true;
    return matchesCounselor && matchesDate && (activeTab === 'upcoming' ? booking.isUpcoming : !booking.isUpcoming);
  });

  const handleCancel = (id) => {
    console.log(`Cancel session ${id}`);
    // Add logic to cancel session
  };

  const handleReschedule = (id) => {
    console.log(`Reschedule session ${id}`);
    // Add logic to reschedule session
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[1000] transition-opacity duration-300"
      onClick={closeModal}
    >
      <div
        className="bg-white rounded-[20px] p-6 sm:p-10 max-w-[600px] w-[90%] max-h-[80vh] overflow-y-auto transform scale-100 transition-transform duration-300"
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

        {/* Tabs */}
        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Filters */}
        <BookingFilters
          counselorFilter={counselorFilter}
          setCounselorFilter={setCounselorFilter}
          dateRange={dateRange}
          setDateRange={setDateRange}
        />

        {/* Booking List */}
        <BookingList
          bookings={filteredBookings}
          activeTab={activeTab}
          handleCancel={handleCancel}
          handleReschedule={handleReschedule}
        />

        {/* Summary */}
        <BookingSummary bookings={bookings} />
      </div>
    </div>
  );
}