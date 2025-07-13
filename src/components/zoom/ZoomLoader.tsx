'use client';

import { useEffect } from 'react';

type ZoomLoaderProps = {
  sdkKey: string;
  signature: string;
  meetingNumber: string;
  password: string;
  userName: string;
};

export default function ZoomLoader({
  sdkKey,
  signature,
  meetingNumber,
  password,
  userName,
}: ZoomLoaderProps) {
  useEffect(() => {
    const initZoom = async () => {
      const { ZoomMtg } = await import('@zoomus/websdk');

      ZoomMtg.setZoomJSLib('https://source.zoom.us/2.18.0/lib', '/av');
      ZoomMtg.preLoadWasm();
      ZoomMtg.prepareWebSDK();

      ZoomMtg.init({
        leaveUrl: window.location.origin,
        isSupportAV: true,
        success: () => {
          ZoomMtg.join({
            sdkKey,
            signature,
            meetingNumber,
            passWord: password,
            userName,
            success: () => console.log('✅ Joined Zoom successfully'),
            error: (err: any) => console.error('Zoom Join Error', err),
          });
        },
        error: (err: any) => console.error('Zoom Init Error', err),
      });
    };

    initZoom();
  }, [sdkKey, signature, meetingNumber, password, userName]);

  return <div id="zmmtg-root" className="w-full h-screen z-[999]" />;
}
