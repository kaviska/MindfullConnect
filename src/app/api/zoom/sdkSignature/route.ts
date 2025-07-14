import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: Request) {
  const { meetingNumber, role } = await req.json();

  const sdkKey = process.env.ZOOM_SDK_KEY!;
  const sdkSecret = process.env.ZOOM_SDK_SECRET!;
  const timestamp = new Date().getTime() - 30000;

  const msg = Buffer.from(`${sdkKey}${meetingNumber}${timestamp}${role}`).toString('base64');
  const hash = crypto
    .createHmac('sha256', sdkSecret)
    .update(msg)
    .digest('base64');
  const signature = Buffer.from(
    `${sdkKey}.${meetingNumber}.${timestamp}.${role}.${hash}`
  ).toString('base64');

  return NextResponse.json({ signature });
}