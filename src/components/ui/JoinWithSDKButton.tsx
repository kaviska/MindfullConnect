'use client';

import { useRouter } from 'next/navigation';

type JoinWithSDKButtonProps = {
  meetingId: string | number;
  sdkKey: string;
  password?: string;
};

export function JoinWithSDKButton({ meetingId, sdkKey, password }: JoinWithSDKButtonProps) {
  const router = useRouter();

  const handleJoin = async () => {
    try {
      const res = await fetch('/api/zoom/sdkSignature', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ meetingNumber: meetingId, role: 0 }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Failed to get Zoom signature');
        return;
      }

      const userName = 'Praveesha'; // Or dynamically set this

      // ✅ Redirect to Zoom meeting page
      router.push(
        `/zoom/${meetingId}?signature=${encodeURIComponent(data.signature)}&sdkKey=${sdkKey}&password=${password ?? ''}&user=${userName}`
      );
    } catch (error) {
      alert('Network error while fetching signature');
      console.error(error);
    }
  };

  return (
    <button onClick={handleJoin} className="btn">
      Join via SDK
    </button>
  );
}