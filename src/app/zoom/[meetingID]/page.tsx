// app/zoom/[meetingId]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useParams } from 'next/navigation';

export default function ZoomMeetingPage() {
  const { meetingId } = useParams();
  const searchParams = useSearchParams();
  const password = searchParams.get('password') || '';
  const userName = searchParams.get('user') || 'Guest';
  const sdkKey = process.env.ZOOM_CLIENT_ID || '';

  const [signature, setSignature] = useState<string | null>(null);

  useEffect(() => {
    const fetchSignature = async () => {
      const res = await fetch('/api/zoom/sdkSignature', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ meetingNumber: meetingId, role: 0 }),
      });

      const data = await res.json();
      if (res.ok) {
        setSignature(data.signature);
      } else {
        alert(data.error || 'Failed to fetch signature');
      }
    };

    fetchSignature();
  }, [meetingId]);

  useEffect(() => {
    if (!signature) return;

    const startZoom = async () => {
      const { ZoomMtg } = await import('@zoomus/websdk');

      ZoomMtg.setZoomJSLib('https://source.zoom.us/2.18.0/lib', '/av');
      ZoomMtg.preLoadWasm();
      ZoomMtg.prepareWebSDK();

      ZoomMtg.init({
        leaveUrl: '/',
        isSupportAV: true,
        success: () => {
          ZoomMtg.join({
            sdkKey,
            signature,
            meetingNumber: String(meetingId),
            passWord: password,
            userName,
            success: () => console.log('✅ Zoom joined'),
            error: console.error,
          });
        },
        error: console.error,
      });
    };

    startZoom();
  }, [signature]);

  return (
    <div id="zmmtg-root" className="w-screen h-screen" />
  );
}
