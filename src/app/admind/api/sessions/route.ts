import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import Session from '../../../models/session';

export async function GET() {
  try {
    await dbConnect();

    // Get recent sessions with pagination
    const sessions = await Session.find()
      .populate('patientId', 'fullName email')
      .populate('counselorId', 'fullName email')
      .sort({ createdAt: -1 })
      .limit(10);

    // Get total count
    const totalCount = await Session.countDocuments();

    return NextResponse.json({ 
      sessions, 
      count: totalCount 
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching sessions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sessions' },
      { status: 500 }
    );
  }
}
