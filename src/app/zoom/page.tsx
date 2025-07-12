'use client';

import { NextResponse } from 'next/server';
import { getUserFromToken } from '@/lib/getUserFromToken';

import { useState, useEffect } from 'react';

export default function ZoomPage() {
  const [loading, setLoading] = useState(false);
  const [joinUrl, setJoinUrl] = useState('');
  const [meetingId, setMeetingId] = useState('');
  const [error, setError] = useState('');

  const [counsellorId, setCounsellorId] = useState('');
  const [patientId, setPatientId] = useState('');

  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateMessage, setUpdateMessage] = useState('');
  const [meetingIdToUpdate, setMeetingIdToUpdate] = useState('');

  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState('');

   // Fetch user info once on mount
useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch('/api/auth/user');
        if (!res.ok) throw new Error('Unauthorized');
        const data = await res.json();
        // Set user IDs here, example: counsellorId is user's id, patientId empty or from elsewhere
        setCounsellorId(data.user.id);
      } catch {
        // Handle unauthorized or error, e.g. redirect or notify user
        setError('Please log in to create a meeting.');
      }
    }

    fetchUser();
  }, []);

  console.log('Counsellor ID:', counsellorId);

  async function createMeeting() {
    setLoading(true);
    setError('');
    setJoinUrl('');
    setMeetingId('');

    if (!counsellorId || !patientId) {
      setError('Please enter both Counsellor ID and Patient ID.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/zoom/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: "Pravee's Zoom Meeting",
          start_time: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
          duration: 30,
          counsellorId,
          patientId,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
      }


      setJoinUrl(data.joinUrl);
      setMeetingId(data.meetingId);
    } catch (err: any) {
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  async function updateMeeting() {
    if (!meetingIdToUpdate) {
      setUpdateMessage('❌ Please enter a meeting ID to update.');
      return;
    }

    setUpdateLoading(true);
    setUpdateMessage('');

    try {
      const res = await fetch('/api/zoom/update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          meetingId: meetingIdToUpdate,
          topic: "Pravee's Updated Zoom Meeting Topic",
          start_time: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
          duration: 45,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || 'Something went wrong');
      setUpdateMessage('✅ Meeting updated successfully!');
    } catch (err:any) {
      setUpdateMessage(`❌ Update failed: ${err.message}`);
    } finally {
      setUpdateLoading(false);
    }
  }


  async function deleteMeeting() {
    if (!meetingIdToUpdate) {
      setDeleteMessage('❌ Please enter a meeting ID to delete.');
      return;
    }

    setDeleteLoading(true);
    setDeleteMessage('');

    try {
      const res = await fetch(`/api/zoom/delete?meetingId=${meetingIdToUpdate}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || 'Delete failed');
      setDeleteMessage('✅ Meeting deleted successfully!');
    } catch (err:any) {
      setDeleteMessage(`❌ ${err.message}`);
    } finally {
      setDeleteLoading(false);
    }
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create a Zoom Meeting</h1>

      <input
        type="text"
        placeholder="Counsellor ID"
        value={counsellorId}
        onChange={(e) => setCounsellorId(e.target.value)}
        className="w-full px-3 py-2 border rounded mb-2"
      />
      <input
        type="text"
        placeholder="Patient ID"
        value={patientId}
        onChange={(e) => setPatientId(e.target.value)}
        className="w-full px-3 py-2 border rounded mb-4"
      />

      <button
        onClick={createMeeting}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? 'Creating...' : 'Create Zoom Meeting'}
      </button>

      {joinUrl && (
        <div className="mt-4">
          <p className="text-green-600 font-semibold">Meeting created!</p>
          <p className="text-sm">Meeting ID: <code>{meetingId}</code></p>
          <a href={joinUrl} target="_blank" rel="noopener noreferrer" className="underline text-blue-700">
            Join Zoom Meeting
          </a>
        </div>
      )}

      {error && <p className="text-red-600 mt-4">{error}</p>}

      <hr className="my-8" />

      <h2 className="text-xl font-semibold mb-2">Update or Delete an Existing Meeting</h2>

      <input
        type="text"
        placeholder="Enter Meeting ID"
        value={meetingIdToUpdate}
        onChange={(e) => setMeetingIdToUpdate(e.target.value)}
        className="w-full px-3 py-2 border rounded mb-4"
      />

      <button
        onClick={updateMeeting}
        className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
        disabled={updateLoading}
      >
        {updateLoading ? 'Updating...' : 'Update Meeting'}
      </button>

      {updateMessage && <p className="mt-4 text-sm">{updateMessage}</p>}

      <button
        onClick={deleteMeeting}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 mt-2"
        disabled={deleteLoading}
      >
        {deleteLoading ? 'Deleting...' : 'Delete Meeting'}
      </button>

      {deleteMessage && <p className="mt-4 text-sm">{deleteMessage}</p>}

    </div>
  );
}