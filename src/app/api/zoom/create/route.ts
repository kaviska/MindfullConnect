import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import connectDB from '@/lib/db'; // Use consistent DB connection
import Session from '@/models/Session';
import ZoomMeeting from '@/models/ZoomMeetings';

export async function POST(req: NextRequest) {
  console.log('Incoming Zoom create POST request');

  // Read body once
  const body = await req.json();
  console.log('Received body:', body);

  try {
    await connectDB();

    // Extract fields from body - updated to work with session data
    const { sessionId, topic, start_time, duration } = body;

    // Validate required fields
    if (!sessionId || !topic || !start_time || !duration) {
      return NextResponse.json(
        { error: 'Missing required fields: sessionId, topic, start_time, and duration are required' },
        { status: 400 }
      );
    }

    // Validate environment variables
    if (!process.env.ZOOM_ACCOUNT_ID || !process.env.ZOOM_CLIENT_ID || !process.env.ZOOM_CLIENT_SECRET) {
      console.error('Missing Zoom environment variables');
      return NextResponse.json(
        { error: 'Zoom configuration is incomplete' },
        { status: 500 }
      );
    }

    // Validate duration (should be a positive number)
    if (typeof duration !== 'number' || duration <= 0 || duration > 480) { // Max 8 hours
      return NextResponse.json(
        { error: 'Duration must be a positive number between 1 and 480 minutes' },
        { status: 400 }
      );
    }

    // Validate start_time format
    const startTimeDate = new Date(start_time);
    if (isNaN(startTimeDate.getTime())) {
      return NextResponse.json(
        { error: 'Invalid start_time format. Please use ISO 8601 format.' },
        { status: 400 }
      );
    }

    // Check if start time is in the future
    if (startTimeDate.getTime() <= Date.now()) {
      return NextResponse.json(
        { error: 'Start time must be in the future' },
        { status: 400 }
      );
    }

    // Check if session exists
    const session = await (Session as any).findById(sessionId);
    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    // Check if session already has a Zoom link
    if (session.zoomLink) {
      return NextResponse.json(
        { error: 'Session already has a Zoom meeting created' },
        { status: 400 }
      );
    }

    // Step 1: Get Access Token
    const tokenRes = await axios.post(
      `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${process.env.ZOOM_ACCOUNT_ID}`,
      {},
      {
        headers: {
          Authorization:
            'Basic ' +
            Buffer.from(
              `${process.env.ZOOM_CLIENT_ID}:${process.env.ZOOM_CLIENT_SECRET}`
            ).toString('base64'),
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const accessToken = tokenRes.data.access_token;

    // Step 2: Create Zoom Meeting
    const zoomRes = await axios.post(
      'https://api.zoom.us/v2/users/me/meetings',
      {
        topic,
        type: 2, // Scheduled meeting
        start_time: startTimeDate.toISOString(), // Ensure proper ISO format
        duration,
        timezone: 'UTC', // Use UTC to avoid timezone issues
        settings: { 
          join_before_host: true,
          waiting_room: false,
          auto_recording: 'none',
          allow_multiple_devices: true,
          approval_type: 2, // No registration required
          audio: 'both', // Telephone and VoIP
          mute_upon_entry: false
        },
        agenda: `Counseling session between counselor and patient scheduled for ${duration} minutes.`
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const meeting = zoomRes.data;

    // Step 3: Save Zoom meeting to database
    const zoomMeeting = new ZoomMeeting({
      meetingId: meeting.id.toString(),
      topic: meeting.topic,
      status: 'waiting',
      joinUrl: meeting.join_url,
      startURL: meeting.start_url,
      startTime: startTimeDate,
      duration,
      counsellorId: session.counselorId.toString(),
      patientId: session.patientId.toString(),
    });

    await zoomMeeting.save();

    // Step 4: Update Session with Zoom link
    const updatedSession = await (Session as any).findByIdAndUpdate(
      sessionId,
      { 
        zoomLink: meeting.join_url,
        status: 'confirmed' // Update status when zoom link is created
      },
      { new: true }
    );

    console.log('✅ Zoom meeting created and session updated:', {
      sessionId,
      meetingId: meeting.id,
      joinUrl: meeting.join_url
    });

    return NextResponse.json({
      success: true,
      sessionId: updatedSession._id,
      meetingId: meeting.id.toString(),
      joinUrl: meeting.join_url,
      startUrl: meeting.start_url,
      topic: meeting.topic,
      startTime: meeting.start_time,
      duration: meeting.duration
    });

  } catch (err: any) {
    // Log the full error object for debugging
    console.error('Zoom Create Error full object:', err);

    // Log response data if present
    if (err.response?.data) {
      console.error('Zoom API response data:', err.response.data);
    }

    // Handle specific Zoom API errors
    if (err.response?.status === 401) {
      return NextResponse.json(
        { error: 'Zoom authentication failed. Please check your credentials.' },
        { status: 401 }
      );
    }

    if (err.response?.status === 429) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }

    // Handle validation errors
    if (err.name === 'ValidationError') {
      return NextResponse.json(
        { error: 'Database validation error: ' + err.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: err.response?.data?.message || err.message || 'Failed to create Zoom meeting' },
      { status: err.response?.status || 500 }
    );
  }
}