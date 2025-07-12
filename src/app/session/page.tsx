"use client";

import { useState, useEffect } from "react";
import Head from "next/head";
import Navbar from "../components/sessions/Navbar";
import SearchFilters from "../components/sessions/SearchFilters";
import CounselorsGrid from "../components/sessions/CounselorsGrid";
import BookingModal from "../components/sessions/BookingModal";
import MyBookingsModal from "../components/sessions/Mybookings/MyBookingModal";
import Snackbar from "../components/sessions/Snackbar";
import { BookedSession, Counselor } from "../components/types";

export default function Session() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [isBookingModalOpen, setIsBookingModalOpen] = useState<boolean>(false);
  const [isMyBookingsModalOpen, setIsMyBookingsModalOpen] = useState<boolean>(false);
  const [selectedCounselor, setSelectedCounselor] = useState<Counselor | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [showSnackbar, setShowSnackbar] = useState<boolean>(false);
  // const [bookedSessions, setBookedSessions] = useState<any[]>([]);
const [bookedSessions, setBookedSessions] = useState<BookedSession[]>([]);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setDate(today);
  }, []);

  const [counselors, setCounselors] = useState<Counselor[]>([]);
  useEffect(() => {
  if (!date) return;

  const fetchCounselors = async () => {
    try {
      const res = await fetch(`/api/counselors?date=${date}`);
      const data = await res.json();
      if (res.ok) {
        setCounselors(data.counselors || []);
      } else {
        console.error("Error fetching counselors:", data.error);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  fetchCounselors();
}, [date]);




  const timeSlots: string[] = [
    "9:00 AM",
    "10:30 AM",
    "12:00 PM",
    "2:30 PM",
    "4:00 PM",
    "5:30 PM",
  ];

  const openBookingModal = (counselor: Counselor) => {
    setSelectedCounselor(counselor);
    setIsBookingModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeBookingModal = () => {
    setIsBookingModalOpen(false);
    setSelectedTimeSlot(null);
    setSelectedCounselor(null);
    document.body.style.overflow = "auto";
  };

  const openMyBookingsModal = () => {
    setIsMyBookingsModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeMyBookingsModal = () => {
    setIsMyBookingsModalOpen(false);
    document.body.style.overflow = "auto";
  };

  const selectTimeSlot = (slot: string) => {
    setSelectedTimeSlot(slot);
  };

  const bookSession = () => {
    if (!selectedTimeSlot || !selectedCounselor) return;
    closeBookingModal();
    setShowSnackbar(true);
    setTimeout(() => setShowSnackbar(false), 4000);
  };

 const filteredCounselors = counselors.filter((counselor) =>
  counselor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  counselor.specialty?.toLowerCase().includes(searchTerm.toLowerCase())
);


  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fcff] to-[#e3f2fd] text-[#334155] font-inter">
      <Head>
        <title>Book Session - Mindfull Connect</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <Navbar openMyBookingsModal={openMyBookingsModal} />
      <main className="max-w-[1200px] mx-auto px-5 py-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-[#0f172a] text-center mb-2">
          Book Your Session
        </h1>
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
        bookedSessions={bookedSessions} // ✅ FIXED: This must be defined in your state or fetched
      />
      

      <MyBookingsModal
        isOpen={isMyBookingsModalOpen}
        closeModal={closeMyBookingsModal}
      />

      <Snackbar
        show={showSnackbar}
        counselorName={selectedCounselor?.name || ""}
        timeSlot={selectedTimeSlot || ""}
      />
    </div>
  );
}
