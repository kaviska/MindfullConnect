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
    const session = await (Session as any).findById(sessionId);
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
    console.log('🔑 Access token obtained successfully');

    // Step 2: Create Zoom Meeting
    console.log('🚀 Creating Zoom meeting with data:', {
      topic,
      type: 2,
      start_time,
      duration,
      settings: { 
        join_before_host: true,
        waiting_room: false,
        auto_recording: 'none'
      }
    });

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

    // Log the complete meeting object for debugging
    console.log('📊 Full Zoom meeting response:', JSON.stringify(meeting, null, 2));
    console.log('🆔 Meeting ID from Zoom API:', meeting.id);
    console.log('🔗 Join URL from Zoom API:', meeting.join_url);
    console.log('📝 Meeting ID type:', typeof meeting.id);

    // Step 3: Update Session with Zoom link
    console.log('🔄 Updating session with ID:', sessionId);
    const updateData = { 
      zoomLink: meeting.join_url,
      zoomMeetingId: meeting.id.toString() // Store Zoom meeting ID
    };
    console.log('📋 Update data being sent to database:', updateData);

    // Check if session exists before update
    console.log('📄 Session before update check...');

    // Debug: Check schema fields
    console.log('🔧 Session schema paths:', Object.keys((Session as any).schema.paths));
    console.log('🔧 Schema strict mode:', (Session as any).schema.options.strict);

    let updatedSession: any;
    try {
      // Try alternative update method with $set
      updatedSession = await (Session as any).findByIdAndUpdate(
        sessionId,
        { $set: updateData },
        { new: true, runValidators: true, strict: false }
      );
      
      console.log('✅ Database update operation completed');
      
      if (!updatedSession) {
        console.error('❌ Updated session is null - session may not exist');
        return NextResponse.json(
          { error: 'Failed to update session - session not found' },
          { status: 404 }
        );
      }

      // Also try a direct query to double-check what's in the database
      const verificationSession = await (Session as any).findById(sessionId);
      console.log('🔍 Direct database query result:', JSON.stringify(verificationSession, null, 2));
      
    } catch (dbError: any) {
      console.error('❌ Database update error:', dbError);
      console.error('❌ Database error message:', dbError.message);
      console.error('❌ Database error stack:', dbError.stack);
      throw dbError; // Re-throw to be caught by outer catch
    }

    console.log('✅ Database update completed. Updated session:', JSON.stringify(updatedSession, null, 2));
    console.log('🔍 Verification - zoomMeetingId in updated session:', updatedSession.zoomMeetingId);
    console.log('🔍 Verification - zoomLink in updated session:', updatedSession.zoomLink);

    console.log('✅ Zoom meeting created and session updated:', {
      sessionId,
      meetingId: meeting.id,
      joinUrl: meeting.join_url,
      storedZoomMeetingId: updatedSession.zoomMeetingId
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
    console.error('❌ Zoom Create Error full object:', err);
    console.error('❌ Error message:', err.message);
    console.error('❌ Error stack:', err.stack);

    // Log response data if present
    if (err.response?.data) {
      console.error('❌ Zoom API response data:', JSON.stringify(err.response.data, null, 2));
      console.error('❌ Zoom API status code:', err.response.status);
      console.error('❌ Zoom API status text:', err.response.statusText);
    }

    // Log axios config if present
    if (err.config) {
      console.error('❌ Request config:', {
        url: err.config.url,
        method: err.config.method,
        headers: err.config.headers
      });
    }

    return NextResponse.json(
      { error: err.response?.data?.message || err.message || 'Zoom API error' },
      { status: err.response?.status || 500 }
    );
  }
}