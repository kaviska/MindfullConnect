import { NextResponse } from 'next/server';
import axios from 'axios';
import dbConnect from '@/lib/mongodb';
import ZoomMeeting from '@/models/ZoomMeetings';

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const meetingId = searchParams.get('meetingId');

    if (!meetingId) {
      return NextResponse.json({ error: 'Meeting ID is required' }, { status: 400 });
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

    // Step 2: Delete from Zoom
    await axios.delete(`https://api.zoom.us/v2/meetings/${meetingId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    // Step 3: Delete from MongoDB
    await dbConnect();
    await ZoomMeeting.findOneAndDelete({ meetingId: meetingId });

    return NextResponse.json({ message: 'Meeting deleted from Zoom and DB' });
  } catch (err: any) {
    console.error('Zoom Delete Error:', err.response?.data || err.message);
    return NextResponse.json(
      { error: err.response?.data || 'Zoom API error' },
      { status: err.response?.status || 500 }
    );
  }
}