import { NextResponse } from 'next/server';
import axios from 'axios';
import dbConnect from '@/lib/mongodb';
import ZoomMeeting from '@/models/ZoomMeetings';

export async function POST(req: Request) {
   console.log('🔔 Incoming Zoom create POST request');

  // Read body once here
  const body = await req.json();
  console.log('📦 Received body:', body);

  try {
    await dbConnect();

    // Use the body already read, do NOT read req.json() again
    const { topic, start_time, duration, counsellorId, patientId } = body;

    if (!topic || !start_time || !duration || !counsellorId || !patientId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
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
        type: 2,
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
      meetingId: meeting.id.toString(),      // match schema field name
      topic: meeting.topic,
      joinUrl: meeting.join_url,
      startURL: meeting.start_url,            // Zoom API field for host start URL
      startTime: new Date(meeting.start_time),
      duration,
      status: meeting.status,                  // status field from Zoom meeting data
      counsellorId,
      patientId,
    });


    await newMeeting.save();

    return NextResponse.json({
      meetingId: newMeeting.zoomId,
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
    { error: err.response?.data || err.message || 'Zoom API error' },
    { status: err.response?.status || 500 }
  );
}

}