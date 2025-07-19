"use client";

import React, { useState, useEffect } from "react";
import { format, addDays, startOfWeek } from "date-fns";
import axios from "axios";
import { useRouter } from "next/navigation";

interface Availability {
  date: string;
  availableSlots: string[];
}

const AvailabilityViewer: React.FC = () => {
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const today = new Date(); // Start from today
    // Get the Monday of the week containing today for the API
    const weekStart = startOfWeek(today, { weekStartsOn: 1 });
    console.log(
      "Week start date (Monday of current week):",
      format(weekStart, "yyyy-MM-dd")
    );
    console.log("Today:", format(today, "yyyy-MM-dd"));
    fetchAvailability(weekStart);
  }, []);

  const fetchAvailability = async (startDate: Date) => {
    setIsLoading(true);
    setError(null);

    try {
      // Get both current week and next week to cover all 7 days from today
      const currentWeekStart = format(startDate, "yyyy-MM-dd");
      const nextWeekStart = format(addDays(startDate, 7), "yyyy-MM-dd");

      console.log(
        `Fetching availability for weeks: ${currentWeekStart} and ${nextWeekStart}`
      );

      // Fetch both weeks in parallel
      const [currentWeekResponse, nextWeekResponse] = await Promise.all([
        axios.get(`/api/availability?weekStart=${currentWeekStart}`, {
          withCredentials: true,
        }),
        axios.get(`/api/availability?weekStart=${nextWeekStart}`, {
          withCredentials: true,
        }),
      ]);

      console.log("Fetch responses:", {
        currentWeek: currentWeekResponse.data,
        nextWeek: nextWeekResponse.data,
      });

      // Combine both weeks' data
      const allAvailabilities = [
        ...(currentWeekResponse.data.availabilities || []),
        ...(nextWeekResponse.data.availabilities || []),
      ];

      console.log("Combined availabilities:", allAvailabilities);
      setAvailabilities(allAvailabilities);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.error || "Failed to fetch availability";
      setError(errorMessage);
      console.error("Fetch error:", {
        message: errorMessage,
        status: err.response?.status,
        details: err.response?.data || err.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = () => {
    router.push("/counsellor/sessions/editAvailability");
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-1">
            Your Weekly Availability
          </h1>
          <p className="text-gray-600">
            Manage your counseling session schedule
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

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="relative">
              <div className="w-10 h-10 border-4 border-blue-200 rounded-full animate-spin"></div>
              <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
            </div>
            <span className="ml-4 text-gray-600 font-medium">
              Loading your schedule...
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4 mb-6">
            {Array.from({ length: 7 }, (_, i) => {
              const date = format(
                addDays(new Date(), i), // Start from today and add i days
                "yyyy-MM-dd"
              );
              const dayAvailability = availabilities.find(
                (a) => a.date === date
              ) || { availableSlots: [] };

              const isToday = i === 0; // First day is always today
              const isTomorrow = i === 1; // Second day is tomorrow
              const hasSlots = dayAvailability.availableSlots.length > 0;

              console.log(`Day ${i} (${date}):`, {
                date,
                availableSlots: dayAvailability.availableSlots,
                hasSlots,
              });

              const getDayLabel = () => {
                if (i === 0) return "Today";
                if (i === 1) return "Tomorrow";
                return format(new Date(date), "EEE");
              };

              return (
                <div
                  key={date}
                  className={`group relative backdrop-blur-sm bg-white/70 border border-white/20 rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 ${
                    isToday
                      ? "ring-2 ring-blue-500 bg-blue-50/50"
                      : isTomorrow
                        ? "ring-2 ring-green-500 bg-green-50/50"
                        : ""
                  }`}
                >
                  {/* Day Header */}
                  <div className="mb-3">
                    <h3
                      className={`font-bold text-base ${
                        isToday
                          ? "text-blue-600"
                          : isTomorrow
                            ? "text-green-600"
                            : "text-gray-800"
                      }`}
                    >
                      {getDayLabel()}
                    </h3>
                    <p
                      className={`text-xs ${
                        isToday
                          ? "text-blue-500"
                          : isTomorrow
                            ? "text-green-500"
                            : "text-gray-500"
                      }`}
                    >
                      {format(new Date(date), "MMM d")}
                    </p>
                    {isToday && (
                      <span className="inline-block px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-600 rounded-full mt-1">
                        Current
                      </span>
                    )}
                    {isTomorrow && (
                      <span className="inline-block px-2 py-0.5 text-xs font-medium bg-green-100 text-green-600 rounded-full mt-1">
                        Next
                      </span>
                    )}
                  </div>

                  {/* Slots Container */}
                  <div className="relative">
                    <div className="max-h-24 overflow-y-auto custom-scrollbar">
                      {hasSlots ? (
                        <div className="space-y-1.5">
                          {dayAvailability.availableSlots.map((slot, index) => (
                            <div
                              key={slot}
                              className="group/slot flex items-center justify-between p-2 bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-lg hover:from-green-100 hover:to-green-200 transition-all duration-200"
                            >
                              <span className="text-xs font-medium text-green-800">
                                {slot}
                              </span>
                              <div className="w-1.5 h-1.5 bg-green-400 rounded-full opacity-60 group-hover/slot:opacity-100 transition-opacity"></div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-4 text-center">
                          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                            <svg
                              className="w-4 h-4 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                              />
                            </svg>
                          </div>
                          <p className="text-gray-500 text-xs font-medium">
                            No slots available
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Overflow Indicator */}
                    {dayAvailability.availableSlots.length > 3 && (
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white/80 to-transparent h-6 flex items-end justify-center pb-0.5">
                        <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full shadow-sm">
                          +{dayAvailability.availableSlots.length - 3} more
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Slot Count Badge */}
                  <div className="absolute top-3 right-3">
                    <span
                      className={`inline-flex items-center justify-center w-5 h-5 text-xs font-bold rounded-full ${
                        hasSlots
                          ? "bg-green-500 text-white"
                          : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {dayAvailability.availableSlots.length}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Action Button */}
        <div className="flex justify-center">
          <button
            onClick={handleEditClick}
            disabled={isLoading}
            className="group relative px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            <span className="relative z-10 flex items-center">
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Edit Availability
            </span>
            <div className="absolute inset-0 bg-blue-800 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
};

export default AvailabilityViewer;
