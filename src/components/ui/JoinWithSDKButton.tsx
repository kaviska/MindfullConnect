'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

const ZoomLoader = dynamic(() => import('@/components/zoom/ZoomLoader'), { ssr: false });

type JoinWithSDKButtonProps = {
  meetingId: string | number;
  sdkKey: string;
  password?: string;
};

export function JoinWithSDKButton({ meetingId, sdkKey, password }: JoinWithSDKButtonProps) {
  const [signature, setSignature] = useState<string | null>(null);

  const handleJoin = async () => {
    try {
      const res = await fetch('/api/zoom/sdk-signature', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ meetingNumber: meetingId, role: 0 }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Failed to get Zoom signature');
        return;
      }

      setSignature(data.signature);
    } catch (error) {
      alert('Network error while fetching signature');
      console.error(error);
    }
  };

  return (
    <>
      <button onClick={handleJoin} className="btn">
        Join via SDK
      </button>
      {signature && (
        <ZoomLoader
          signature={signature}
          meetingNumber={String(meetingId)}
          password={password ?? ''}
          userName="Praveesha" // Replace with actual user name if available
          sdkKey={sdkKey}
        />
      )}
    </>
  );
}
