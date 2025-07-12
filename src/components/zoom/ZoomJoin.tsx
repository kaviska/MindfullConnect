'use client';

import { useEffect } from 'react';
import { ZoomMtg } from '@zoomus/websdk';

interface ZoomJoinProps {
  meetingNumber: string;
  password: string;
  userName: string;
  signature: string;
  sdkKey: string;
}

export default function ZoomJoin({ meetingNumber, password, userName, signature, sdkKey }: ZoomJoinProps) {
  useEffect(() => {
    ZoomMtg.init({
      leaveUrl: 'https://your-app.com/zoom/leave',
      isSupportAV: true,
      success: () => {
        ZoomMtg.join({
          signature,
          sdkKey,
          meetingNumber,
          passWord: password,
          userName,
          success: () => {
            console.log('Zoom SDK Join Success');
          },
          error: (error: any) => {
            console.error('Zoom Join Error:', error);
          },
        });
      },
      error: (err: any) => {
        console.error('Zoom Init Error:', err);
      },
    });
  }, [meetingNumber, password, userName, signature, sdkKey]);

  return <div id="zmmtg-root" className="w-full h-screen z-[999]"></div>;
}
