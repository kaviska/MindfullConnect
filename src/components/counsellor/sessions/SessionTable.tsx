"use client";

import { useEffect, useState } from "react";
import SessionRow from "./SessionRow";

export default function SessionTable() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSessions();
  }, []);

  async function fetchSessions() {
    try {
      console.log("Fetching sessions from /api/zoom/sessions...");
      const res = await fetch("/api/zoom/sessions", {
        method: "GET",
        credentials: "include", // Include cookies for JWT token
      });

      console.log("Response status:", res.status);
      const data = await res.json();
      console.log("Response data:", data);

      if (!res.ok) {
        throw new Error(
          data.message || data.error || "Failed to load sessions"
        );
      }

      setSessions(data.meetings || []); // from your API response
      console.log("Sessions set:", data.meetings);
    } catch (err: any) {
      console.error("Error fetching sessions:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const handleSessionDelete = (sessionId: string) => {
    // Refresh the sessions after deletion
    fetchSessions();
  };

  if (loading)
    return (
      <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6 rounded-2xl">
        <div className="flex items-center justify-center py-12">
          <div className="relative">
            <div className="w-10 h-10 border-4 border-blue-200 rounded-full animate-spin"></div>
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
          </div>
          <span className="ml-4 text-gray-600 font-medium">
            Loading sessions...
          </span>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="bg-gradient-to-br from-red-50 via-white to-red-50 p-6 rounded-2xl border border-red-100">
        <div className="text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-6 h-6 text-red-500"
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
          </div>
          <div className="text-red-600 font-semibold text-lg mb-2">
            Failed to load sessions
          </div>
          <div className="text-red-500 text-sm mb-3">Error: {error}</div>
          <div className="text-gray-600 text-sm">
            Please check the browser console for more details.
          </div>
        </div>
      </div>
    );

  if (sessions.length === 0) {
    return (
      <div className="bg-gradient-to-br from-gray-50 via-white to-gray-50 p-8 rounded-2xl border border-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 2h6m6 6V7a2 2 0 00-2-2H6a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            No scheduled sessions
          </h3>
          <p className="text-gray-600">
            Your session schedule is currently empty. New bookings will appear
            here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6 rounded-2xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Your Sessions
        </h2>
        <p className="text-gray-600">
          Manage your upcoming counseling sessions
        </p>
      </div>

      <div className="backdrop-blur-sm bg-white/70 border border-white/20 rounded-2xl shadow-lg overflow-hidden">
        <div
          className="overflow-auto max-h-96 scrollbar-thin scrollbar-thumb-blue-400 scrollbar-track-gray-100 hover:scrollbar-thumb-blue-500"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#60a5fa #f3f4f6",
          }}
        >
          <style jsx>{`
            div::-webkit-scrollbar {
              width: 8px;
              height: 8px;
            }
            div::-webkit-scrollbar-track {
              background: #f3f4f6;
              border-radius: 4px;
            }
            div::-webkit-scrollbar-thumb {
              background: #60a5fa;
              border-radius: 4px;
            }
            div::-webkit-scrollbar-thumb:hover {
              background: #3b82f6;
            }
            div::-webkit-scrollbar-corner {
              background: #f3f4f6;
            }
          `}</style>
          <table className="min-w-full">
            <thead className="sticky top-0 z-10">
              <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 tracking-wide whitespace-nowrap">
                  Patient
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 tracking-wide whitespace-nowrap">
                  Date & Time
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 tracking-wide whitespace-nowrap">
                  Duration
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 tracking-wide whitespace-nowrap">
                  Zoom Link
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 tracking-wide whitespace-nowrap">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 tracking-wide whitespace-nowrap">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sessions.map((session: any) => (
                <SessionRow
                  key={session._id}
                  {...session}
                  onDeleteAction={handleSessionDelete}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
