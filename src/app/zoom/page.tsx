'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ZoomPage() {
  const [loading, setLoading] = useState(false);
  const [userLoading, setUserLoading] = useState(true);
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
  // New state variables for user inputs
  const [topic, setTopic] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [updateTopic, setUpdateTopic] = useState('');
  const [updateDate, setUpdateDate] = useState('');
  const [updateTime, setUpdateTime] = useState('');

  const router = useRouter();

  useEffect(() => {
    async function fetchUser() {
      setUserLoading(true);
      try {
        const res = await fetch('/api/auth/user', { credentials: 'include' });
        console.log('Auth user response status:', res.status);
        if (!res.ok) {
          throw new Error(res.status === 401 ? 'Unauthorized' : `Failed to fetch user: ${res.status}`);
        }
        const data = await res.json();
        console.log('Auth user data:', data);
        if (!data.user?._id) {
          throw new Error('User ID not found in response');
        }
        setCounsellorId(data.user._id);
        console.log('Set counsellorId to:', data.user._id);
      } catch (err: any) {
        console.error('Fetch user error:', err);
        setError(err.message === 'Unauthorized' ? 'Please log in to create a meeting.' : `Failed to fetch user: ${err.message}`);
        setTimeout(() => router.push('/login'), 2000);
      } finally {
        setUserLoading(false);
      }
    }
    fetchUser();
  }, []);

  useEffect(() => {
    console.log('Counsellor id state updated:', counsellorId);
  }, [counsellorId]);

  async function createMeeting() {
    setLoading(true);
    setError('');
    setJoinUrl('');
    setMeetingId('');

    console.log('createMeeting called with:', { counsellorId, patientId, topic, date, time });

    if (!counsellorId || !patientId || !topic || !date || !time) {
      setError('Please enter all required fields: Counsellor ID, Patient ID, Topic, Date, and Time.');
      console.log('Validation failed:', { counsellorId, patientId, topic, date, time });
      setLoading(false);
      return;
    }

    try {
      const startTime = new Date(`${date}T${time}`).toISOString();
      const body = JSON.stringify({
        topic,
        start_time: startTime,
        duration: 30,
        counsellorId,
        patientId,
      });
      console.log('Sending create meeting request:', body);

      const res = await fetch('/api/zoom/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body,
      });

      const data = await res.json();
      console.log('Create meeting response:', data);
      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setJoinUrl(data.joinUrl);
      setMeetingId(data.meetingId);
    } catch (err: any) {
      console.error('Create meeting error:', err);
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

    if (!updateTopic || !updateDate || !updateTime) {
      setUpdateMessage('❌ Please enter all required fields: Topic, Date, and Time.');
      return;
    }

    setUpdateLoading(true);
    setUpdateMessage('');

    try {
      const startTime = new Date(`${updateDate}T${updateTime}`).toISOString();
      const res = await fetch('/api/zoom/update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          meetingId: meetingIdToUpdate,
          topic: updateTopic,
          start_time: startTime,
          duration: 45,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || 'Something went wrong');
      setUpdateMessage('✅ Meeting updated successfully!');
    } catch (err: any) {
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
        credentials: 'include',
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || 'Delete failed');
      setDeleteMessage('✅ Meeting deleted successfully!');
    } catch (err: any) {
      setDeleteMessage(`❌ ${err.message}`);
    } finally {
      setDeleteLoading(false);
    }
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create a Zoom Meeting</h1>

      {userLoading ? (
        <p>Loading user data...</p>
      ) : (
        <>
          <input
            type="text"
            placeholder="Counsellor ID"
            value={counsellorId}
            disabled
            className="w-full px-3 py-2 border rounded mb-2 bg-gray-100"
          />
          <input
            type="text"
            placeholder="Patient ID"
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
            className="w-full px-3 py-2 border rounded mb-2"
          />
          <input
            type="text"
            placeholder="Meeting Topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full px-3 py-2 border rounded mb-2"
          />
          <input
            type="date"
            placeholder="Meeting Date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3 py-2 border rounded mb-2"
          />
          <input
            type="time"
            placeholder="Meeting Time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full px-3 py-2 border rounded mb-4"
          />

          <button
            onClick={createMeeting}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            disabled={loading || userLoading}
          >
            {loading ? 'Creating...' : 'Create Zoom Meeting'}
          </button>

          {joinUrl && (
            <div className="mt-4">
              <p className="text-green-600 font-semibold">Meeting created!</p>
              <p className="text-sm">Meeting ID: <code>{meetingId}</code></p>
              <a
                href={joinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-blue-700"
              >
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
            className="w-full px-3 py-2 border rounded mb-2"
          />
          <input
            type="text"
            placeholder="Update Meeting Topic"
            value={updateTopic}
            onChange={(e) => setUpdateTopic(e.target.value)}
            className="w-full px-3 py-2 border rounded mb-2"
          />
          <input
            type="date"
            placeholder="Update Meeting Date"
            value={updateDate}
            onChange={(e) => setUpdateDate(e.target.value)}
            className="w-full px-3 py-2 border rounded mb-2"
          />
          <input
            type="time"
            placeholder="Update Meeting Time"
            value={updateTime}
            onChange={(e) => setUpdateTime(e.target.value)}
            className="w-full px-3 py-2 border rounded mb-4"
          />

          <button
            onClick={updateMeeting}
            className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
            disabled={updateLoading || userLoading}
          >
            {updateLoading ? 'Updating...' : 'Update Meeting'}
          </button>

          {updateMessage && <p className="mt-4 text-sm">{updateMessage}</p>}

          <button
            onClick={deleteMeeting}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 mt-2"
            disabled={deleteLoading || userLoading}
          >
            {deleteLoading ? 'Deleting...' : 'Delete Meeting'}
          </button>

          {deleteMessage && <p className="mt-4 text-sm">{deleteMessage}</p>}
        </>
      )}
    </div>
  );
}