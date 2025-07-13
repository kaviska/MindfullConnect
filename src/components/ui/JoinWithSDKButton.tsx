'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

type JoinWithSDKButtonProps = {
  meetingId: string;
  sdkKey?: string;
  password?: string;
  userName?: string;
};

export function JoinWithSDKButton({ 
  meetingId = '85733644491', 
  sdkKey = 'dhyhywQQlm1AqxTlNBpiw', 
  password='', 
  userName='Guest' 
}: JoinWithSDKButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleJoin = async () => {

    console.log('Joining with SDK:', { meetingId, sdkKey, password, userName });

    if (!meetingId || !sdkKey) {
      alert('Meeting ID and SDK Key are required');
      return;
    }
    setIsLoading(true);

    try {
      const res = await fetch('/api/zoom/sdkSignature', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ meetingNumber: meetingId, role: 0 }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || `Failed to get Zoom signature: ${res.status}`);
        return;
      }

      //Redirect to Zoom meeting page
      router.push(
        `/zoom/${encodeURIComponent(meetingId)}?signature=${encodeURIComponent(data.signature)}&sdkKey=${encodeURIComponent(sdkKey)}&password=${encodeURIComponent(password)}&user=${encodeURIComponent(userName)}`
      );

    } catch (error) {
      alert('Network error while fetching signature');
      console.error(error);
    } 
    finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleJoin}
      className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
      disabled={isLoading}
    >
      
      {isLoading ? 'Joining...' : 'Join via SDK'}

    </button>
  );
}