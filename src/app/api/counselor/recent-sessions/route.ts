import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import connectDB from '@/lib/db';
import Session from '@/models/Session';
import jwt from 'jsonwebtoken';
import User from '@/models/User';
import { Model } from 'mongoose';

export async function GET(req: NextRequest) {
  try {
    await connectDB();

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
    const UserModel = User as Model<any>;
    const user = await UserModel.findById(decoded.userId);

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    // Verify user is a counselor
    const userRole = user.role?.toLowerCase();
    if (userRole !== 'counselor' && userRole !== 'counsellor') {
      return NextResponse.json(
        { message: `Access denied. Counselor role required. Current role: ${user.role}` },
        { status: 403 }
      );
    }

    // Fetch recent sessions for this counselor (limit to 5)
    const SessionModel = Session as Model<any>;
    const recentSessions = await SessionModel.find({ 
      $or: [
        { counselorId: user._id },
        { counselorId: user._id.toString() }
      ]
    })
      .populate('patientId', 'fullName email')
      .sort({ createdAt: -1 }) // latest sessions first
      .limit(5) // Only get top 5 recent sessions
      .lean();

    // Format the response for better presentation
    const formattedSessions = recentSessions.map((session: any) => {
      // Determine the appropriate icon based on session type/status
      let activityType = 'video';
      let activityColor = 'blue';
      
      if (session.status === 'completed') {
        activityType = 'video';
        activityColor = 'blue';
      } else if (session.status === 'cancelled') {
        activityType = 'calendar';
        activityColor = 'red';
      } else if (session.status === 'pending') {
        activityType = 'calendar';
        activityColor = 'yellow';
      }

      // Calculate relative time
      const sessionDate = new Date(`${session.date}T${session.time}`);
      const now = new Date();
      const diffInMs = now.getTime() - sessionDate.getTime();
      const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
      const diffInDays = Math.floor(diffInHours / 24);
      
      let timeAgo;
      if (diffInDays > 0) {
        timeAgo = `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
      } else if (diffInHours > 0) {
        timeAgo = `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
      } else {
        timeAgo = 'Recently';
      }

      // If session is in the future, show when it's scheduled
      if (sessionDate > now) {
        const diffInFutureHours = Math.floor((sessionDate.getTime() - now.getTime()) / (1000 * 60 * 60));
        const diffInFutureDays = Math.floor(diffInFutureHours / 24);
        
        if (diffInFutureDays > 0) {
          timeAgo = `In ${diffInFutureDays} day${diffInFutureDays > 1 ? 's' : ''}`;
        } else if (diffInFutureHours > 0) {
          timeAgo = `In ${diffInFutureHours} hour${diffInFutureHours > 1 ? 's' : ''}`;
        } else {
          timeAgo = 'Soon';
        }
      }

      return {
        id: session._id,
        patientName: session.patientId?.fullName || 'Unknown Patient',
        patientEmail: session.patientId?.email || '',
        date: session.date,
        time: session.time,
        status: session.status,
        activityType,
        activityColor,
        timeAgo,
        description: getActivityDescription(session.status, session.patientId?.fullName || 'Unknown Patient')
      };
    });

    return NextResponse.json({ 
      success: true,
      recentSessions: formattedSessions 
    });

  } catch (err: any) {
    console.error('[Recent Sessions GET Error]', err);
    return NextResponse.json({ 
      error: 'Failed to fetch recent sessions' 
    }, { status: 500 });
  }
}

// Helper function to generate activity descriptions
function getActivityDescription(status: string, patientName: string): string {
  switch (status) {
    case 'completed':
      return `Session completed with ${patientName}`;
    case 'cancelled':
      return `Session cancelled with ${patientName}`;
    case 'pending':
      return `Session scheduled with ${patientName}`;
    case 'confirmed':
      return `Session confirmed with ${patientName}`;
    case 'counselor requested reschedule':
      return `Reschedule requested for ${patientName}`;
    default:
      return `Session with ${patientName}`;
  }
}
