import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/db";
import Session from "@/models/Session";
import User from "@/models/User";
import { Model } from 'mongoose';

const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET(request: NextRequest) {
  await connectDB();

  try {
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    // Verify JWT token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    } catch (error) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Get user and verify they are a counselor
    const UserModel = User as Model<any>;
    const user = await UserModel.findById(decoded.userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Verify user is a counselor
    const userRole = user.role?.toLowerCase();
    if (userRole !== 'counselor' && userRole !== 'counsellor') {
      return NextResponse.json({ 
        error: `Access denied. Counselor role required. Current role: ${user.role}` 
      }, { status: 403 });
    }

    // Fetch sessions for this counselor
    const SessionModel = Session as Model<any>;
    const sessions = await SessionModel.find({ 
      $or: [
        { counselorId: user._id },
        { counselorId: user._id.toString() }
      ]
    })
      .select('date time status') // Only get the fields we need for availability checking
      .lean();

    // Format the response to match what the availability component expects
    const formattedSessions = sessions.map((session: any) => ({
      date: session.date,
      time: session.time,
      status: session.status
    }));

    return NextResponse.json({ 
      success: true,
      sessions: formattedSessions 
    });

  } catch (err: any) {
    console.error('[Counselor Sessions GET Error]', err);
    return NextResponse.json({ 
      error: 'Failed to fetch counselor sessions' 
    }, { status: 500 });
  }
}
