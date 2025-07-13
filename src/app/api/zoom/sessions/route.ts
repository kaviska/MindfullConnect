import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { getUserFromToken } from '@/lib/getUserFromToken';
import ZoomMeeting from '@/models/ZoomMeetings';
import jwt from 'jsonwebtoken';
import User from '@/models/User';
import { use } from 'react';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 }
      );
    }
    
    const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

    // Verify JWT token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    } 
    catch (error) {
      return NextResponse.json(
        { message: "Invalid token" },
        { status: 401 }
      );
    }

    // Get user and verify they are a counselor
    const user = await User.findById(decoded.userId);

    // Fetch Zoom meetings where this user is the counsellor
    const meetings = await ZoomMeeting.find({ counsellorId: user.id })
      .sort({ startTime: -1 }) // latest meetings first
      .lean();

    return NextResponse.json({ meetings });
  } catch (err: any) {
    console.error('[ZoomMeeting GET Error]', err);
    return NextResponse.json({ error: 'Failed to fetch sessions' }, { status: 500 });
  }
}
