import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import dbConnect from '@/lib/mongodb';
import Session from '@/models/Session';

export async function POST(req: NextRequest) {
  console.log('Incoming Zoom create POST request');

  // Read body once
  const body = await req.json();
  console.log('Received body:', body);

  try {
    await dbConnect();

    // Extract fields from body - updated to work with session data
    const { sessionId, topic, start_time, duration } = body;

    // Validate required fields
    if (!sessionId || !topic || !start_time || !duration) {
      return NextResponse.json(
        { error: 'Missing required fields: sessionId, topic, start_time, and duration are required' },
        { status: 400 }
      );
    }

    // Validate start_time format
    const startTimeDate = new Date(start_time);
    if (isNaN(startTimeDate.getTime())) {
      return NextResponse.json(
        { error: 'Invalid start_time format' },
        { status: 400 }
      );
    }

    // Check if session exists
    const session = await Session.findById(sessionId).exec();
    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
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
        start_time,
        duration,
        settings: { 
          join_before_host: true,
          waiting_room: false,
          auto_recording: 'none'
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const meeting = zoomRes.data;

    // Step 3: Update Session with Zoom link
    const updatedSession = await Session.findByIdAndUpdate(
      sessionId,
      { 
        zoomLink: meeting.join_url,
        status: 'confirmed' // Update status when zoom link is created
      },
      { new: true }
    ).exec();

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
      topic: meeting.topic
    });

  } catch (err: any) {
    // Log the full error object for debugging
    console.error('Zoom Create Error full object:', err);

    // Log response data if present
    if (err.response?.data) {
      console.error('Zoom API response data:', err.response.data);
    }

    return NextResponse.json(
      { error: err.response?.data?.message || err.message || 'Zoom API error' },
      { status: err.response?.status || 500 }
    );
  }
}