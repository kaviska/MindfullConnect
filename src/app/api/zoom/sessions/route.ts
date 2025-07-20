import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Session from '@/models/Session';
import jwt from 'jsonwebtoken';
import User from '@/models/User';
import { Model } from 'mongoose';

export async function GET(req: NextRequest) {
  try {
    console.log('Starting session fetch request...');
    await dbConnect();
    console.log('Database connected successfully');

    const token = req.cookies.get("token")?.value;
    console.log('Token found:', token ? 'Yes' : 'No');
    
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

    console.log('User found:', user ? 'Yes' : 'No');
    console.log('User role:', user?.role);

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    // Verify user is a counselor (check both lowercase and capitalized)
    const userRole = user.role?.toLowerCase();
    if (userRole !== 'counselor' && userRole !== 'counsellor') {
      console.log('Access denied for role:', user.role);
      return NextResponse.json(
        { message: `Access denied. Counselor role required. Current role: ${user.role}` },
        { status: 403 }
      );
    }

    // Fetch Zoom meetings where this user is the counsellor
    const SessionModel = Session as Model<any>;
    console.log('Searching for sessions with counselorId:', user._id);
    console.log('User _id type:', typeof user._id);
    console.log('User _id toString:', user._id.toString());
    
    // Try both ObjectId and string matching
    const meetings = await SessionModel.find({ 
      $or: [
        { counselorId: user._id },
        { counselorId: user._id.toString() }
      ]
    })
      .populate('patientId', 'fullName email')
      .sort({ createdAt: -1 }) // latest meetings first
      .lean();

    console.log('Found sessions:', meetings.length);
    console.log('Sessions data:', meetings);

    // Let's also check all sessions to see what counselorIds exist
    const allSessions = await SessionModel.find({})
      .select('counselorId')
      .lean();
    
    console.log('All sessions counselorIds:', allSessions.map(s => ({ id: s.counselorId, type: typeof s.counselorId })));

    return NextResponse.json({ meetings });
  } catch (err: any) {
    console.error('[Session GET Error]', err);
    return NextResponse.json({ error: 'Failed to fetch sessions' }, { status: 500 });
  }
}
