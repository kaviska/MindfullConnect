'use client';

import { useEffect, useState } from 'react';
import SessionRow from './SessionRow';

export default function SessionTable() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchSessions() {
      try {
        const res = await fetch('/api/zoom/sessions');
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'Failed to load sessions');
        }

        setSessions(data.meetings); // from your API response
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchSessions();
  }, []);

  if (loading) return <div className="p-6">Loading sessions...</div>;
  if (error) return <div className="p-6 text-red-500">❌ {error}</div>;
  if (sessions.length === 0) {
    return <div className="p-6 text-gray-600">You don't have any scheduled sessions!</div>;
  }

  return (
    <div className="bg-white rounded-lg mx-6 mt-6 shadow-md overflow-auto">
      <table className="min-w-full table-auto">
        <thead className="bg-gray-100 text-gray-700 text-sm">
          <tr>
            <th className="py-2">Meeting ID</th>
            <th className="py-2">Patient</th>
            <th className="py-2">Start Time</th>
            <th className="py-2">Duration</th>
            <th className="py-2">Join Link</th>
            <th className="py-2">Status</th>
            <th className="py-2">Action</th>
          </tr>
        </thead>
        <tbody className="text-sm">
          {sessions.map((session: any, index: number) => (
            <SessionRow key={index} {...session} />
          ))}
        </tbody>
      </table>
    </div>
  );
}