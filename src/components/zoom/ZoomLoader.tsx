'use client';

import { useEffect } from 'react';

// ✅ Import ZoomMtg only inside useEffect (not top-level)
type ZoomLoaderProps = {
  sdkKey: string;
  signature: string;
  meetingNumber: string;
  password: string;
  userName: string;
};

export default function ZoomLoader({ sdkKey, signature, meetingNumber, password, userName }: ZoomLoaderProps) {
  useEffect(() => {
    const initZoom = async () => {
      const { ZoomMtg } = await import('@zoomus/websdk');

      ZoomMtg.preLoadWasm();
      ZoomMtg.prepareWebSDK();

      ZoomMtg.init({
        leaveUrl: 'https://yourdomain.com/leave',
        success: () => {
          ZoomMtg.join({
            sdkKey,
            signature,
            meetingNumber,
            passWord: password,
            userName,
            success: () => console.log('Joined Zoom successfully'),
            error: (err: any) => console.error('Zoom Join Error', err),
          });
        },
        error: (err: any) => console.error('Zoom Init Error', err),
      });
    };

    initZoom();
  }, [sdkKey, signature, meetingNumber, password, userName]);

  return <div id="zmmtg-root" />;
}
