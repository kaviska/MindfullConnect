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
      const { ZoomMtg } = await import('@zoom/meetingsdk');

      ZoomMtg.setZoomJSLib('https://source.zoom.us/3.13.2/lib', '/av');
      ZoomMtg.preLoadWasm();
      ZoomMtg.prepareWebSDK();
      ZoomMtg.i18n.load('en-US');

      ZoomMtg.init({
        leaveUrl: window.location.origin,
        isSupportAV: true,
        patchJsMedia: true,
        success: () => {
          ZoomMtg.join({
            signature,
            meetingNumber,
            userName,
            sdkKey,
            userEmail: '',
            passWord: password,
            success: () => {
              console.log('Joined Zoom successfully')
            },
            error: (err: any) => {
              console.error('Zoom Join Error', err);
              alert(`Failed to join meeting: ${err.errorCode} - ${err.reason}`);
            }
          });
        },
        error: (err: any) => console.error('Zoom Init Error', err),
      });
    };

    initZoom();
  }, [sdkKey, signature, meetingNumber, password, userName]);

  return (
    <div id="zmmtg-root" className="w-full h-screen" style={{ position: 'relative', zIndex: 999 }} />
  );
}
