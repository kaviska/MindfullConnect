"use client";

import { useEffect, useState } from "react";

interface SessionStats {
  totalSessions: number;
  upcomingSessions: number;
  todaysSessions: number;
  completedSessions: number;
  cancelledSessions: number;
  pendingSessions: number;
}

export default function SessionStats() {
  const [stats, setStats] = useState<SessionStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/counselor/session-stats", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error || "Failed to fetch session statistics"
          );
        }

        const data = await response.json();
        setStats(data.stats);
      } catch (err: any) {
        console.error("Error fetching session stats:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto my-8 px-4">
        {[1, 2, 3].map((idx) => (
          <div
            key={idx}
            className="relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-200 to-gray-300 p-6 shadow-lg animate-pulse"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 bg-gray-400 rounded-full"></div>
                <div className="w-10 h-10 bg-gray-400 rounded-lg"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-400 rounded w-3/4"></div>
                <div className="h-10 bg-gray-400 rounded w-1/2"></div>
                <div className="h-3 bg-gray-400 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center my-8 px-4">
        <div className="rounded-xl bg-gradient-to-br from-red-100 to-red-200 border border-red-300 p-6 shadow-lg max-w-md w-full">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <svg
                className="w-6 h-6 text-red-600"
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
            <div>
              <h3 className="text-red-800 font-medium">
                Unable to load statistics
              </h3>
              <p className="text-red-700 text-sm mt-1">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex justify-center my-8 px-4">
        <div className="rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 border border-gray-300 p-6 shadow-lg max-w-md w-full">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-gray-800 font-medium">No data available</h3>
              <p className="text-gray-700 text-sm mt-1">
                Statistics will appear here once you have sessions
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const statItems = [
    {
      label: "Total Sessions",
      value: stats.totalSessions,
      gradient: "from-orange-400 to-orange-600",
      description: "All time sessions",
    },
    {
      label: "Upcoming Sessions",
      value: stats.upcomingSessions,
      gradient: "from-blue-500 to-blue-700",
      description: "Scheduled sessions",
    },
    {
      label: "Today's Sessions",
      value: stats.todaysSessions,
      gradient: "from-purple-500 to-purple-700",
      description: "Sessions today",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto my-8 px-4">
      {statItems.map((stat, idx) => (
        <div
          key={idx}
          className={`group relative overflow-hidden rounded-xl bg-gradient-to-br ${stat.gradient} p-6 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 cursor-pointer`}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/20 rounded-full blur-xl"></div>
          <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white/20 rounded-full blur-lg"></div>

          {/* Content */}
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-white/20 rounded-lg p-2 group-hover:bg-white/30 transition-colors">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-white/90 text-sm font-medium uppercase tracking-wide">
                {stat.label}
              </h3>
              <p className="text-4xl font-bold text-white mb-1">{stat.value}</p>
              <p className="text-white/70 text-xs">{stat.description}</p>
            </div>

            {/* Animated indicator */}
            <div className="absolute bottom-0 left-0 h-1 w-full bg-white/20">
              <div className="h-full bg-white/50 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
