import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import dbConnect from '@/lib/mongodb';
import ZoomMeeting from '@/models/ZoomMeetings';

export async function POST(req: NextRequest) {
  console.log('🔔 Incoming Zoom create POST request');

  // Read body once
  const body = await req.json();
  console.log('📦 Received body:', body);

  try {
    await dbConnect();

    // Extract fields from body
    const { topic, start_time, duration, counsellorId, patientId } = body;

    // Validate required fields
    if (!topic || !start_time || !duration || !counsellorId || !patientId) {
      return NextResponse.json(
        { error: 'Missing required fields: topic, start_time, duration, counsellorId, and patientId are required' },
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
        settings: { join_before_host: true },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const meeting = zoomRes.data;

    // Step 3: Save to MongoDB
    const newMeeting = new ZoomMeeting({
      meetingId: meeting.id.toString(),
      topic: meeting.topic,
      joinUrl: meeting.join_url,
      startURL: meeting.start_url,
      startTime: new Date(meeting.start_time),
      duration,
      status: meeting.status,
      counsellorId,
      patientId,
    });

    await newMeeting.save();

    return NextResponse.json({
      meetingId: newMeeting.meetingId,
      joinUrl: newMeeting.joinUrl,
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