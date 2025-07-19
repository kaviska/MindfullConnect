"use client";

import React, { useState, useEffect } from "react";
import { format, addDays, startOfWeek } from "date-fns";
import axios from "axios";

interface TimeSlot {
  time: string;
  selected: boolean;
  booked: boolean; // Add booked status
}

interface DayAvailability {
  date: string;
  slots: TimeSlot[];
}

const timeSlots = Array.from({ length: 48 }, (_, i) => {
  const hours = Math.floor(i / 2)
    .toString()
    .padStart(2, "0");
  const minutes = i % 2 === 0 ? "00" : "30";
  return `${hours}:${minutes}`;
}); // Generates 00:00, 00:30, ..., 23:30

const AvailabilitySelector: React.FC = () => {
  const [weekAvailability, setWeekAvailability] = useState<DayAvailability[]>(
    []
  );
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Add CSS for animation delay
  React.useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      .animation-delay-150 {
        animation-delay: 150ms;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Initialize week with empty slots
  useEffect(() => {
    const today = new Date(); // Start from today
    const weekDays: DayAvailability[] = Array.from({ length: 7 }, (_, i) => ({
      date: format(addDays(today, i), "yyyy-MM-dd"), // Today + i days
      slots: timeSlots.map((time) => ({
        time,
        selected: false,
        booked: false,
      })),
    }));
    setWeekAvailability(weekDays);
    fetchAvailability(weekDays);
  }, []);

  // Helper function to get available slots count for a day
  const getAvailableSlotsForDay = (day: Date): number => {
    const dayKey = format(day, "yyyy-MM-dd");
    const dayData = weekAvailability.find((d) => d.date === dayKey);
    if (!dayData) return 0;
    return dayData.slots.filter((slot) => slot.selected && !slot.booked).length;
  };

  // Helper function to get booked slots count for a day
  const getBookedSlotsForDay = (day: Date): number => {
    const dayKey = format(day, "yyyy-MM-dd");
    const dayData = weekAvailability.find((d) => d.date === dayKey);
    if (!dayData) return 0;
    return dayData.slots.filter((slot) => slot.booked).length;
  };

  // Fetch existing availability and booked sessions
  const fetchAvailability = async (days: DayAvailability[]) => {
    setIsLoading(true);
    setError(null);

    try {
      // Get the week start date (use Monday of the week containing the first day)
      const firstDay = new Date(days[0].date);
      const currentWeekStart = format(
        startOfWeek(firstDay, { weekStartsOn: 1 }),
        "yyyy-MM-dd"
      );
      const nextWeekStart = format(
        addDays(startOfWeek(firstDay, { weekStartsOn: 1 }), 7),
        "yyyy-MM-dd"
      );

      console.log("Fetching availability for weeks:", {
        currentWeek: currentWeekStart,
        nextWeek: nextWeekStart,
        daysToFetch: days.map((d) => d.date),
      });

      // Fetch both weeks in parallel to cover all 7 days from today
      const [availabilityResponse1, availabilityResponse2, sessionsResponse] =
        await Promise.all([
          axios.get(`/api/availability?weekStart=${currentWeekStart}`, {
            withCredentials: true,
          }),
          axios.get(`/api/availability?weekStart=${nextWeekStart}`, {
            withCredentials: true,
          }),
          axios.get(`/api/sessions/my`, { withCredentials: true }),
        ]);

      console.log("API Responses:", {
        currentWeekAvailability: availabilityResponse1.data,
        nextWeekAvailability: availabilityResponse2.data,
        sessions: sessionsResponse.data,
      });

      // Combine both weeks' availability data
      const availabilities = [
        ...(availabilityResponse1.data?.availabilities || []),
        ...(availabilityResponse2.data?.availabilities || []),
      ];
      const sessions = sessionsResponse.data?.sessions || [];

      console.log("Processed data:", {
        availabilitiesCount: availabilities.length,
        sessionsCount: sessions.length,
        availabilities: availabilities,
      });

      // Update all days at once
      setWeekAvailability((prev) =>
        prev.map((day) => {
          // Find availability for this specific date
          const dayAvailability = availabilities.find(
            (avail: any) => avail.date === day.date
          );
          const availableSlots = dayAvailability?.availableSlots || [];

          // Find booked sessions for this specific date
          const dayBookedSlots = sessions
            .filter((session: any) => session.date === day.date)
            .map((session: any) => session.time);

          return {
            ...day,
            slots: timeSlots.map((time) => ({
              time,
              selected: availableSlots.includes(time),
              booked: dayBookedSlots.includes(time),
            })),
          };
        })
      );
    } catch (err: any) {
      console.error("Error fetching availability/sessions:", err);
      setError(
        err.response?.data?.error ||
          "Failed to fetch availability data. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Handle slot toggle (prevent toggling booked slots)
  const toggleSlot = (date: string, time: string) => {
    setWeekAvailability((prev) =>
      prev.map((day) =>
        day.date === date
          ? {
              ...day,
              slots: day.slots.map((slot) =>
                slot.time === time && !slot.booked // Only toggle if not booked
                  ? { ...slot, selected: !slot.selected }
                  : slot
              ),
            }
          : day
      )
    );
  };

  // Save availability for a specific day
  const saveDayAvailability = async (day: DayAvailability) => {
    setIsLoading(true);
    setError(null);
    try {
      const selectedSlots = day.slots
        .filter((slot) => slot.selected)
        .map((slot) => slot.time);

      console.log("Saving availability:", {
        date: day.date,
        selectedSlots,
        totalSlots: selectedSlots.length,
      });

      const response = await axios.post(
        "/api/availability",
        {
          date: day.date,
          availableSlots: selectedSlots,
        },
        { withCredentials: true } // Include cookies for authentication
      );

      console.log("Save response:", response.data);

      if (response.data.message) {
        // Refresh the data to reflect changes
        await fetchAvailability(weekAvailability);

        // Create a modern success notification
        const successDiv = document.createElement("div");
        successDiv.innerHTML = `
          <div class="fixed top-4 right-4 z-50 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-4 rounded-2xl shadow-lg flex items-center animate-pulse">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span>Availability for ${format(new Date(day.date), "EEEE, MMM d")} saved successfully! (${selectedSlots.length} slots)</span>
          </div>
        `;
        document.body.appendChild(successDiv);
        setTimeout(() => {
          document.body.removeChild(successDiv);
        }, 3000);
      }
    } catch (err: any) {
      console.error("Error saving availability:", err);
      const errorMessage =
        err.response?.data?.error || "Failed to save availability";
      setError(errorMessage);

      // Show error notification
      const errorDiv = document.createElement("div");
      errorDiv.innerHTML = `
        <div class="fixed top-4 right-4 z-50 bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-4 rounded-2xl shadow-lg flex items-center">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span>Error: ${errorMessage}</span>
        </div>
      `;
      document.body.appendChild(errorDiv);
      setTimeout(() => {
        document.body.removeChild(errorDiv);
      }, 5000);
    } finally {
      setIsLoading(false);
    }
  };

  // Open/close day selection
  const handleDayClick = (date: string) => {
    setSelectedDay(selectedDay === date ? null : date);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6 relative">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white/90 backdrop-blur-lg rounded-3xl p-8 border border-blue-100 shadow-2xl flex flex-col items-center space-y-4">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-b-purple-600 rounded-full animate-spin animation-delay-150"></div>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Loading Availability
              </h3>
              <p className="text-gray-600">
                Fetching your schedule and sessions...
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Set Your Availability
          </h1>
          <p className="text-gray-600 text-lg">
            Choose your available time slots for the next 7 days starting from
            today
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-2xl">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-red-500 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-red-700 font-medium">{error}</span>
            </div>
          </div>
        )}

        {/* Week Days Display */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Select a Day (Next 7 Days)
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-7 gap-4">
            {weekAvailability.map((day, index) => {
              const isToday = index === 0; // First day is always today
              const isTomorrow = index === 1; // Second day is tomorrow
              const isSelected = selectedDay === day.date;
              const selectedCount = day.slots.filter(
                (slot) => slot.selected && !slot.booked // Only count selected, non-booked slots
              ).length;
              const bookedCount = day.slots.filter(
                (slot) => slot.booked
              ).length;

              const getDayLabel = () => {
                if (index === 0) return "Today";
                if (index === 1) return "Tomorrow";
                return format(new Date(day.date), "EEE");
              };

              const getDateLabel = () => {
                return format(new Date(day.date), "MMM d");
              };

              return (
                <button
                  key={day.date}
                  onClick={() => handleDayClick(day.date)}
                  disabled={isLoading}
                  className={`group relative backdrop-blur-sm border rounded-2xl p-4 transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                    isSelected
                      ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white border-blue-300 shadow-lg"
                      : isToday
                        ? "bg-white/70 border-blue-200 text-blue-600 shadow-md"
                        : isTomorrow
                          ? "bg-white/70 border-green-200 text-green-600 shadow-md"
                          : "bg-white/50 border-white/20 text-gray-700 hover:bg-white/80"
                  } ${isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                >
                  <div className="text-center">
                    <div
                      className={`font-bold text-lg mb-1 ${
                        isSelected
                          ? "text-white"
                          : isToday
                            ? "text-blue-600"
                            : isTomorrow
                              ? "text-green-600"
                              : "text-gray-800"
                      }`}
                    >
                      {getDayLabel()}
                    </div>
                    <div
                      className={`text-sm ${
                        isSelected
                          ? "text-blue-100"
                          : isToday
                            ? "text-blue-500"
                            : isTomorrow
                              ? "text-green-500"
                              : "text-gray-500"
                      }`}
                    >
                      {getDateLabel()}
                    </div>
                    {/* Show slot summary */}
                    {(selectedCount > 0 || bookedCount > 0) && !isSelected && (
                      <div className="text-xs mt-2 space-y-1">
                        {selectedCount > 0 && (
                          <div className="text-green-600 font-medium">
                            {selectedCount} available
                          </div>
                        )}
                        {bookedCount > 0 && (
                          <div className="text-red-500 font-medium">
                            {bookedCount} booked
                          </div>
                        )}
                      </div>
                    )}
                    {isToday && !isSelected && (
                      <span className="inline-block px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-600 rounded-full mt-2">
                        Current
                      </span>
                    )}
                    {isTomorrow && !isSelected && (
                      <span className="inline-block px-2 py-0.5 text-xs font-medium bg-green-100 text-green-600 rounded-full mt-2">
                        Next
                      </span>
                    )}
                  </div>

                  {/* Slot Count Badge */}
                  {selectedCount > 0 && (
                    <div className="absolute -top-2 -right-2">
                      <span
                        className={`inline-flex items-center justify-center w-6 h-6 text-xs font-bold rounded-full ${
                          isSelected
                            ? "bg-white text-blue-600"
                            : "bg-green-500 text-white"
                        }`}
                      >
                        {selectedCount}
                      </span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Time Slots Display */}
        {selectedDay && (
          <div className="bg-white/90 backdrop-blur-lg rounded-3xl p-8 border border-blue-100 shadow-2xl">
            {/* Header with Summary */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {format(new Date(selectedDay), "EEEE, MMMM d")} - Time Slots
              </h3>
              <div className="flex gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-gray-600">
                    {getAvailableSlotsForDay(new Date(selectedDay))} Available
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-gray-600">
                    {getBookedSlotsForDay(new Date(selectedDay))} Booked
                  </span>
                </div>
              </div>
            </div>{" "}
            {/* Time Period Sections */}
            <div className="space-y-6">
              {/* Morning */}
              <div>
                <h4 className="flex items-center text-lg font-semibold text-gray-700 mb-3">
                  <svg
                    className="w-5 h-5 text-yellow-500 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Morning (6:00 - 11:30)
                </h4>
                <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                  {weekAvailability
                    .find((day) => day.date === selectedDay)
                    ?.slots.filter((slot) => {
                      const hour = parseInt(slot.time.split(":")[0]);
                      return hour >= 6 && hour < 12;
                    })
                    .map((slot) => (
                      <button
                        key={slot.time}
                        onClick={() =>
                          !slot.booked && toggleSlot(selectedDay, slot.time)
                        }
                        disabled={isLoading || slot.booked}
                        className={`p-3 rounded-xl text-sm font-medium transition-all duration-200 relative ${
                          slot.booked
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed opacity-60"
                            : slot.selected
                              ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-md hover:shadow-lg scale-105"
                              : "bg-white/80 text-gray-700 hover:bg-yellow-50 hover:text-yellow-700 border border-gray-200 hover:border-yellow-300"
                        } ${isLoading ? "opacity-50 cursor-not-allowed" : !slot.booked ? "cursor-pointer hover:scale-105" : ""}`}
                      >
                        {slot.time}
                        {slot.booked && (
                          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 py-0.5 rounded-full text-[10px] font-bold">
                            Booked
                          </span>
                        )}
                      </button>
                    ))}
                </div>
              </div>

              {/* Afternoon */}
              <div>
                <h4 className="flex items-center text-lg font-semibold text-gray-700 mb-3">
                  <svg
                    className="w-5 h-5 text-blue-500 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Afternoon (12:00 - 17:30)
                </h4>
                <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                  {weekAvailability
                    .find((day) => day.date === selectedDay)
                    ?.slots.filter((slot) => {
                      const hour = parseInt(slot.time.split(":")[0]);
                      return hour >= 12 && hour < 18;
                    })
                    .map((slot) => (
                      <button
                        key={slot.time}
                        onClick={() =>
                          !slot.booked && toggleSlot(selectedDay, slot.time)
                        }
                        disabled={isLoading || slot.booked}
                        className={`p-3 rounded-xl text-sm font-medium transition-all duration-200 relative ${
                          slot.booked
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed opacity-60"
                            : slot.selected
                              ? "bg-gradient-to-r from-blue-400 to-blue-600 text-white shadow-md hover:shadow-lg scale-105"
                              : "bg-white/80 text-gray-700 hover:bg-blue-50 hover:text-blue-700 border border-gray-200 hover:border-blue-300"
                        } ${isLoading ? "opacity-50 cursor-not-allowed" : !slot.booked ? "cursor-pointer hover:scale-105" : ""}`}
                      >
                        {slot.time}
                        {slot.booked && (
                          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 py-0.5 rounded-full text-[10px] font-bold">
                            Booked
                          </span>
                        )}
                      </button>
                    ))}
                </div>
              </div>

              {/* Evening */}
              <div>
                <h4 className="flex items-center text-lg font-semibold text-gray-700 mb-3">
                  <svg
                    className="w-5 h-5 text-purple-500 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                  Evening (18:00 - 23:30)
                </h4>
                <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                  {weekAvailability
                    .find((day) => day.date === selectedDay)
                    ?.slots.filter((slot) => {
                      const hour = parseInt(slot.time.split(":")[0]);
                      return hour >= 18;
                    })
                    .map((slot) => (
                      <button
                        key={slot.time}
                        onClick={() =>
                          !slot.booked && toggleSlot(selectedDay, slot.time)
                        }
                        disabled={isLoading || slot.booked}
                        className={`p-3 rounded-xl text-sm font-medium transition-all duration-200 relative ${
                          slot.booked
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed opacity-60"
                            : slot.selected
                              ? "bg-gradient-to-r from-purple-400 to-purple-600 text-white shadow-md hover:shadow-lg scale-105"
                              : "bg-white/80 text-gray-700 hover:bg-purple-50 hover:text-purple-700 border border-gray-200 hover:border-purple-300"
                        } ${isLoading ? "opacity-50 cursor-not-allowed" : !slot.booked ? "cursor-pointer hover:scale-105" : ""}`}
                      >
                        {slot.time}
                        {slot.booked && (
                          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 py-0.5 rounded-full text-[10px] font-bold">
                            Booked
                          </span>
                        )}
                      </button>
                    ))}
                </div>
              </div>
            </div>
            {/* Save Button */}
            <div className="flex justify-center mt-8">
              <button
                onClick={() =>
                  saveDayAvailability(
                    weekAvailability.find((day) => day.date === selectedDay)!
                  )
                }
                disabled={isLoading}
                className="group relative px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <span className="relative z-10 flex items-center">
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Save Availability
                    </>
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AvailabilitySelector;
