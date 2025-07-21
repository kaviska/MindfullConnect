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

    const SessionModel = Session as Model<any>;
    
    // Get today's date in YYYY-MM-DD format
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];

    // Get current date and time for comparison
    const now = new Date();

    // Count total sessions for this counselor
    const totalSessions = await SessionModel.countDocuments({
      $or: [
        { counselorId: user._id },
        { counselorId: user._id.toString() }
      ]
    });

    // Count upcoming sessions (future sessions that are not cancelled or completed)
    const upcomingSessions = await SessionModel.countDocuments({
      $or: [
        { counselorId: user._id },
        { counselorId: user._id.toString() }
      ],
      $and: [
        {
          $or: [
            { date: { $gt: todayString } }, // Future dates
            { 
              date: todayString, // Today's sessions
              time: { $gte: now.toTimeString().slice(0, 5) } // Future times today
            }
          ]
        },
        {
          status: { $nin: ['cancelled', 'completed'] } // Exclude cancelled and completed sessions
        }
      ]
    });

    // Count today's sessions (regardless of status)
    const todaysSessions = await SessionModel.countDocuments({
      $or: [
        { counselorId: user._id },
        { counselorId: user._id.toString() }
      ],
      date: todayString
    });

    // Count completed sessions
    const completedSessions = await SessionModel.countDocuments({
      $or: [
        { counselorId: user._id },
        { counselorId: user._id.toString() }
      ],
      status: 'completed'
    });

    // Count cancelled sessions
    const cancelledSessions = await SessionModel.countDocuments({
      $or: [
        { counselorId: user._id },
        { counselorId: user._id.toString() }
      ],
      status: 'cancelled'
    });

    // Count pending sessions
    const pendingSessions = await SessionModel.countDocuments({
      $or: [
        { counselorId: user._id },
        { counselorId: user._id.toString() }
      ],
      status: 'pending'
    });

    return NextResponse.json({
      success: true,
      stats: {
        totalSessions,
        upcomingSessions,
        todaysSessions,
        completedSessions,
        cancelledSessions,
        pendingSessions
      }
    });

  } catch (error: any) {
    console.error('[Session Stats Error]', error);
    return NextResponse.json({ 
      error: 'Failed to fetch session statistics',
      details: error.message 
    }, { status: 500 });
  }
}
