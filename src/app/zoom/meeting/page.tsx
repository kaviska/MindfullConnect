'use client';

import { useEffect, useState } from 'react';
import { ZoomMtg } from '@zoomus/websdk';

ZoomMtg.setZoomJSLib('https://source.zoom.us/2.18.0/lib', '/av');
ZoomMtg.preLoadWasm();
ZoomMtg.prepareWebSDK();

export default function ZoomMeetingPage() {
  const [error, setError] = useState('');

  useEffect(() => {
    const meetingNumber = localStorage.getItem('zoom_meeting_id') || '';
    const signature = localStorage.getItem('zoom_signature') || '';
    const sdkKey = process.env.ZOOM_SDK_KEY;

    if (!meetingNumber || !signature || !sdkKey) {
      setError('Missing Zoom credentials. Please rejoin from session table.');
      return;
    }

    ZoomMtg.init({
      leaveUrl: window.location.origin + '/dashboard',
      success: () => {
        ZoomMtg.join({
          signature,
          sdkKey,
          meetingNumber,
          userName: 'Zoom User',
          passWord: '',
          success: () => console.log('✅ Zoom meeting joined'),
          error: (err: any) => {
            console.error('Zoom Join Error:', err);
            setError('Failed to join meeting.');
          },
        });
      },
      error: (err: any) => {
        console.error('Zoom Init Error:', err);
        setError('Failed to initialize Zoom.');
      },
    });
  }, []);

  return (
    <div className="w-screen h-screen">
      <div id="zmmtg-root"></div>
      {error && (
        <div className="absolute top-10 left-10 bg-red-200 text-red-800 p-4 rounded-md">
          {error}
        </div>
      )}
    </div>
  );
}