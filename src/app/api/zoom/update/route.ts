import { NextResponse } from 'next/server';
import axios from 'axios';
import dbConnect from '@/lib/mongodb';
import ZoomMeeting from '@/models/ZoomMeetings';

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { meetingId, topic, start_time, duration } = body;

    if (!meetingId) {
      return NextResponse.json({ error: 'Meeting ID is required' }, { status: 400 });
    }

    // Connect to DB
    await dbConnect();

    // Get OAuth token
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

    // Update meeting on Zoom
    const updateRes = await axios.patch(
      `https://api.zoom.us/v2/meetings/${meetingId}`,
      {
        topic,
        start_time,
        duration,
        settings: {
          join_before_host: true,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // Update meeting in MongoDB
    const updatedMeeting = await ZoomMeeting.findOneAndUpdate(
      { meetingId: meetingId },
      {
        topic,
        startTime: new Date(start_time),
        duration,
      },
      { new: true }
    );

    if (!updatedMeeting) {
      return NextResponse.json(
        { error: 'Meeting updated on Zoom, but not found in database' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: '✅ Zoom meeting and database record updated successfully!',
      meeting: updatedMeeting,
    });

  } catch (err: any) {
    console.error('Zoom Update Error:', err.response?.data || err.message);
    return NextResponse.json(
      { error: err.response?.data || 'Zoom update API error' },
      { status: err.response?.status || 500 }
    );
  }
}
