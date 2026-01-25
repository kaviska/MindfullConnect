import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import Counselor from '../../../../models/counselor';

export async function GET() {
  try {
    await dbConnect();

    // Fetch all active counselors
    const users = await Counselor.find({ status: 'active' })
      .populate('userId', 'email fullName')
      .select('name specialty yearsOfExperience consultationFee rating status createdAt userId')
      .sort({ createdAt: -1 })
      .lean();

    // Map to include email from userId
    const formattedUsers = users.map((user: any) => {
      const nameParts = (user.name || '').split(' ');
      return {
        ...user,
        email: user.userId?.email || 'N/A',
        fullName: user.userId?.fullName || user.name,
        firstname: nameParts[0] || '',
        lastname: nameParts.slice(1).join(' ') || ''
      };
    });

    return NextResponse.json({ users: formattedUsers }, { status: 200 });
  } catch (error) {
    console.error('Error fetching active counselors:', error);
    return NextResponse.json(
      { error: 'Failed to fetch active counselors' },
      { status: 500 }
    );
  }
}
