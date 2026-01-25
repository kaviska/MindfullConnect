import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import User from '../../../models/User';

export async function GET() {
  try {
    await dbConnect();

    // Fetch all users with role 'User' (patients)
    const users = await User.find({ role: 'User' })
      .select('fullName email isVerified createdAt lastSeen')
      .sort({ createdAt: -1 });

    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    console.error('Error fetching patients:', error);
    return NextResponse.json(
      { error: 'Failed to fetch patients' },
      { status: 500 }
    );
  }
}
