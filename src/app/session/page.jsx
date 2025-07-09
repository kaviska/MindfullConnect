"use client";
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Navbar from '../components/sessions/Navbar';
import SearchFilters from '../components/sessions/SearchFilters';
import CounselorsGrid from '../components/sessions/CounselorsGrid';
import BookingModal from '../components/sessions/BookingModal';
import MyBookingsModal from '../components/sessions/MyBookingModal';
import Snackbar from '../components/sessions/Snackbar';

export default function Session() {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isMyBookingsModalOpen, setIsMyBookingsModalOpen] = useState(false);
  const [selectedCounselor, setSelectedCounselor] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [showSnackbar, setShowSnackbar] = useState(false);

  const counselors = [
    {
      name: 'Dr. Sarah Johnson',
      specialty: 'Anxiety & Stress',
      rating: 4.9,
      reviews: 127,
      description: 'Specializing in cognitive behavioral therapy with over 8 years of experience helping clients overcome anxiety and stress-related challenges.',
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=160&h=160&fit=crop&crop=face&auto=format',
    },
    {
      name: 'Dr. Michael Chen',
      specialty: 'Relationships & Family',
      rating: 4.8,
      reviews: 94,
      description: 'Expert in couples therapy and family counseling, helping individuals and families build stronger, healthier relationships.',
      avatar: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=160&h=160&fit=crop&crop=face&auto=format',
    },
    {
      name: 'Dr. Emily Rodriguez',
      specialty: 'Depression & Trauma',
      rating: 4.9,
      reviews: 156,
      description: 'Specialized in EMDR therapy and trauma-informed care, dedicated to helping clients heal from past experiences and depression.',
      avatar: 'https://images.unsplash.com/photo-1594824954908-a64e3f9e3f0c?w=160&h=160&fit=crop&crop=face&auto=format',
    },
    {
      name: 'Dr. James Wilson',
      specialty: 'Life Transitions',
      rating: 4.7,
      reviews: 83,
      description: 'Helping clients navigate major life changes, career transitions, and personal growth with compassionate guidance and practical strategies.',
      avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=160&h=160&fit=crop&crop=face&auto=format',
    },
  ];

  const timeSlots = ['9:00 AM', '10:30 AM', '12:00 PM', '2:30 PM', '4:00 PM', '5:30 PM'];

  const openBookingModal = (counselor) => {
    setSelectedCounselor(counselor);
    setIsBookingModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeBookingModal = () => {
    setIsBookingModalOpen(false);
    setSelectedTimeSlot(null);
    setSelectedCounselor(null);
    document.body.style.overflow = 'auto';
  };

  const openMyBookingsModal = () => {
    setIsMyBookingsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeMyBookingsModal = () => {
    setIsMyBookingsModalOpen(false);
    document.body.style.overflow = 'auto';
  };

  const selectTimeSlot = (slot) => {
    setSelectedTimeSlot(slot);
  };

  const bookSession = () => {
    if (!selectedTimeSlot || !selectedCounselor) return;
    closeBookingModal();
    setShowSnackbar(true);
    setTimeout(() => setShowSnackbar(false), 4000);
  };

  const filteredCounselors = counselors.filter((counselor) =>
    counselor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    counselor.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
    counselor.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fcff] to-[#e3f2fd] text-[#334155] font-inter">
      <Head>
        <title>Book Session - Mindfull Connect</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <Navbar openMyBookingsModal={openMyBookingsModal} />
      <main className="max-w-[1200px] mx-auto px-5 py-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-[#0f172a] text-center mb-2">Book Your Session</h1>
        <p className="text-lg text-[#64748b] text-center mb-10">
          Find the perfect counselor for your needs and schedule your appointment
        </p>

        <SearchFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          category={category}
          setCategory={setCategory}
          date={date}
          setDate={setDate}
        />

        <CounselorsGrid counselors={filteredCounselors} openModal={openBookingModal} />
      </main>

      <BookingModal
        isOpen={isBookingModalOpen}
        closeModal={closeBookingModal}
        selectedCounselor={selectedCounselor}
        timeSlots={timeSlots}
        selectTimeSlot={selectTimeSlot}
        selectedTimeSlot={selectedTimeSlot}
        bookSession={bookSession}
      />

      <MyBookingsModal isOpen={isMyBookingsModalOpen} closeModal={closeMyBookingsModal} />

      <Snackbar
        show={showSnackbar}
        counselorName={selectedCounselor?.name}
        timeSlot={selectedTimeSlot}
      />
    </div>
  );
}