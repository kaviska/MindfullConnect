import { NextResponse } from 'next/server';

export async function GET() {
  const sdkKey = process.env.NEXT_PUBLIC_ZOOM_SDK_KEY;
  const sdkSecret = process.env.ZOOM_SDK_SECRET;

  return NextResponse.json({
    hasSDKKey: !!sdkKey,
    sdkKey: sdkKey ? `${sdkKey.substring(0, 8)}...` : 'Not set',
    hasSDKSecret: !!sdkSecret,
    sdkSecret: sdkSecret ? `${sdkSecret.substring(0, 8)}...` : 'Not set',
    timestamp: new Date().getTime(),
    nodeEnv: process.env.NODE_ENV
  });
}
