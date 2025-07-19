import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import dbConnect from '@/lib/mongodb';
import Session from '@/models/Session';

export async function PATCH(request: NextRequest) {
  console.log('📝 Incoming Zoom update PATCH request');
  
  try {
    const body = await request.json();
    console.log('📋 Received body:', body);
    
    // Note: Only sessionId is needed - we'll get zoomMeetingId from the session
    const { sessionId, topic, start_time, duration } = body;

    // Validate required fields (topic is now optional)
    if (!sessionId || !start_time || !duration) {
      return NextResponse.json(
        { error: 'Missing required fields: sessionId, start_time, and duration are required. Topic is optional.' },
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

    // Connect to DB
    await dbConnect();

    // First, find the session to get the zoomMeetingId
    console.log('🔍 Finding session with ID:', sessionId);
    const session = await (Session as any).findById(sessionId);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    if (!session.zoomMeetingId) {
      return NextResponse.json(
        { error: 'Session does not have a Zoom meeting associated' },
        { status: 400 }
      );
    }

    const meetingId = session.zoomMeetingId;
    console.log('📋 Found session with Zoom meeting ID:', meetingId);

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
    console.log('🔑 Access token obtained for update');

    // Update meeting on Zoom
    console.log('🔄 Updating Zoom meeting:', meetingId);
    
    // Build update payload - only include fields that are being updated
    const zoomUpdatePayload: any = {
      topic: topic || `Therapy Session - ${new Date(start_time).toLocaleDateString()} at ${new Date(start_time).toLocaleTimeString()}`,
      type: 2, // Scheduled meeting
      start_time,
      duration,
      settings: {
        join_before_host: true,
      },
    };


    const updateRes = await axios.patch(
      `https://api.zoom.us/v2/meetings/${meetingId}`,
      zoomUpdatePayload,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('✅ Zoom meeting updated successfully');
    console.log('📊 Update response status:', updateRes.status);

    // Update meeting in MongoDB
    // Convert start_time to date and time components to match schema
    const startDate = new Date(start_time);
    const dateStr = startDate.toISOString().split('T')[0]; // YYYY-MM-DD
    const timeStr = startDate.toTimeString().split(' ')[0].slice(0, 5); // HH:mm

    console.log('🔄 Updating session in database:', {
      sessionId,
      date: dateStr,
      time: timeStr,
      duration
    });

    const updatedSession = await (Session as any).findByIdAndUpdate(
      sessionId, // Use sessionId directly since we already found it
      {
        date: dateStr,
        time: timeStr,
        duration,
        // Note: topic is not stored in Session schema, only in Zoom
      },
      { new: true }
    );

    if (!updatedSession) {
      console.error('❌ Failed to update session:', sessionId);
      return NextResponse.json(
        { error: 'Meeting updated on Zoom, but failed to update session in database' },
        { status: 500 }
      );
    }

    console.log('✅ Session updated successfully in database');
    console.log('📋 Updated session:', JSON.stringify(updatedSession, null, 2));

    return NextResponse.json({
      message: '✅ Zoom meeting and database record updated successfully!',
      session: updatedSession,
      zoomResponse: updateRes.status
    });

  } catch (err: any) {
    console.error('Zoom Update Error:', err.response?.data || err.message);
    return NextResponse.json(
      { error: err.response?.data?.message || err.message || 'Zoom update API error' },
      { status: err.response?.status || 500 }
    );
  }
}