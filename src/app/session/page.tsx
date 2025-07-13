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
import { useAuth } from "@/context/AuthContext";



export default function Session() {
  const { token } = useAuth();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [isBookingModalOpen, setIsBookingModalOpen] = useState<boolean>(false);
  const [isMyBookingsModalOpen, setIsMyBookingsModalOpen] = useState<boolean>(false);
  const [selectedCounselor, setSelectedCounselor] = useState<Counselor | null>(null);
  const [showSnackbar, setShowSnackbar] = useState<boolean>(false);
  const [bookedSessions, setBookedSessions] = useState<BookedSession[]>([]);
  const [lastBookedSession, setLastBookedSession] = useState<{ slot: string; counselorName: string } | null>(null);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setDate(today);
  }, []);

  const [counselors, setCounselors] = useState<Counselor[]>([]);

  useEffect(() => {
  const fetchBookedSessions = async () => {
    if (!token || !isBookingModalOpen) return;

    try {
      const res = await fetch("/api/sessions/my", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok) {
        const mapped = data.sessions.map((s: any) => ({
          date: s.date,
          time: s.time,
          counselor: s.counselor, // already flattened
        }));
        setBookedSessions(mapped);
      } else {
        console.error("❌ Error loading booked sessions:", data.error);
      }
    } catch (err) {
      console.error("❌ Network error loading sessions:", err);
    }
  };

  fetchBookedSessions();
}, [isBookingModalOpen, token]);

  
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

  const openBookingModal = (counselor: Counselor) => {
    console.log('📋 Opening modal with counselor:', counselor); // Add this
    setSelectedCounselor(counselor);
    setIsBookingModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeBookingModal = () => {
    setIsBookingModalOpen(false);
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

  // Updated bookSession function with correct signature
  const bookSession = async (slot: string, date: string) => {
    if (!selectedCounselor) return;

    try {
      // Here you would call your booking API
      const response = await fetch('/api/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          counselorId: selectedCounselor._id,
          timeSlot: slot,
          date: date,
          // Add other necessary fields like patientId
        }),
      });

      if (response.ok) {
        // Store session info for snackbar
        setLastBookedSession({
          slot: slot,
          counselorName: selectedCounselor.name || ""
        });

        // Close modal and show success
        closeBookingModal();
        setShowSnackbar(true);
        setTimeout(() => setShowSnackbar(false), 4000);

        // Optionally refresh booked sessions or counselors list
        // You might want to refetch data here
      } else {
        const errorData = await response.json();
        console.error('Booking failed:', errorData.error);
        // Handle error (show error message to user)
      }
    } catch (error) {
      console.error('Error booking session:', error);
      // Handle error (show error message to user)
    }
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
        bookSession={bookSession}
        bookedSessions={bookedSessions}
      />

      <MyBookingsModal
        isOpen={isMyBookingsModalOpen}
        closeModal={closeMyBookingsModal}
      />

      <Snackbar
        show={showSnackbar}
        counselorName={lastBookedSession?.counselorName || ""}
        timeSlot={lastBookedSession?.slot || ""}
      />
    </div>
  );
}