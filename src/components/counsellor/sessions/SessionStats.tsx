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
        const response = await fetch('/api/counselor/session-stats', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch session statistics');
        }

        const data = await response.json();
        setStats(data.stats);
      } catch (err: any) {
        console.error('Error fetching session stats:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex gap-28 justify-center my-6">
        {[1, 2, 3].map((idx) => (
          <div key={idx} className="rounded-lg px-6 py-6 w-56 bg-gray-200 animate-pulse">
            <div className="h-5 bg-gray-300 rounded mb-2"></div>
            <div className="h-8 bg-gray-300 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center my-6">
        <div className="rounded-lg px-6 py-6 bg-red-100 text-red-700">
          <p className="text-sm">Error loading stats: {error}</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex justify-center my-6">
        <div className="rounded-lg px-6 py-6 bg-gray-100 text-gray-700">
          <p className="text-sm">No statistics available</p>
        </div>
      </div>
    );
  }

  const statItems = [
    { 
      label: "Total Sessions", 
      value: stats.totalSessions, 
      bg: "bg-orange-300", 
      text: "text-black" 
    },
    { 
      label: "Upcoming Sessions", 
      value: stats.upcomingSessions, 
      bg: "bg-slate-800", 
      text: "text-white" 
    },
    { 
      label: "Today's Sessions", 
      value: stats.todaysSessions, 
      bg: "bg-slate-800", 
      text: "text-white" 
    },
  ];

  return (
    <div className="flex gap-28 justify-center my-6">
      {statItems.map((stat, idx) => (
        <div key={idx} className={`rounded-lg px-6 py-6 w-56 ${stat.bg} ${stat.text}`}>
          <h3 className="text-lg font-semibold">{stat.label}</h3>
          <p className="text-3xl font-bold">{stat.value}</p>
        </div>
      ))}
    </div>
  );
}
