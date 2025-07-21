import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const { meetingNumber, role } = await req.json();

    // Validate required environment variables
    const sdkKey = process.env.NEXT_PUBLIC_ZOOM_SDK_KEY;
    const sdkSecret = process.env.ZOOM_SDK_SECRET;

    if (!sdkKey || !sdkSecret) {
      console.error('Missing Zoom SDK credentials:', { 
        hasSDKKey: !!sdkKey, 
        hasSDKSecret: !!sdkSecret 
      });
      return NextResponse.json(
        { error: 'Zoom SDK credentials not configured' },
        { status: 500 }
      );
    }

    // Validate input parameters
    if (!meetingNumber) {
      return NextResponse.json(
        { error: 'Meeting number is required' },
        { status: 400 }
      );
    }

    // Use current timestamp (in milliseconds)
    const timestamp = new Date().getTime();
    const roleValue = role !== undefined ? role : 0; // Default to attendee role

    console.log('Generating signature with:', {
      sdkKey,
      meetingNumber,
      timestamp,
      role: roleValue
    });

    // Create the signature according to Zoom's specification
    const msg = Buffer.from(`${sdkKey}${meetingNumber}${timestamp}${roleValue}`).toString('base64');
    const hash = crypto
      .createHmac('sha256', sdkSecret)
      .update(msg)
      .digest('base64');
    
    const signature = Buffer.from(
      `${sdkKey}.${meetingNumber}.${timestamp}.${roleValue}.${hash}`
    ).toString('base64');

    console.log('Generated signature successfully');

    return NextResponse.json({ 
      signature,
      timestamp,
      sdkKey // Return the SDK key to ensure consistency
    });

  } catch (error) {
    console.error('Error generating Zoom signature:', error);
    return NextResponse.json(
      { error: 'Failed to generate signature' },
      { status: 500 }
    );
  }
}