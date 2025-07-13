'use client';
import { useEffect } from 'react';

import ZoomLoader from '@/components/zoom/ZoomLoader';
import { useSearchParams } from 'next/navigation';

export default function ZoomMeetingPage({ params }: { params: { meetingId: string } }) {
  const searchParams = useSearchParams();
  const signature = searchParams.get('signature') || '';
  const sdkKey = process.env.ZOOM_SDK_KEY || '';
  const password = searchParams.get('password') || '';
  const userName = searchParams.get('user') || 'Guest';

  useEffect(() => {
    console.log('ZoomMeetingPage params:', {
      meetingId: params.meetingId,
      signature,
      sdkKey,
      password,
      userName,
    });
  }, [params.meetingId, signature, sdkKey, password, userName]);

  if (!params.meetingId || !signature || !sdkKey) {
    return <div className="p-4 text-red-500">Error: Missing Zoom parameters</div>;
  }

  return (
    <ZoomLoader
      meetingNumber={params.meetingId}
      sdkKey={sdkKey}
      signature={signature}
      password={password}
      userName={userName}
    />
  );
}