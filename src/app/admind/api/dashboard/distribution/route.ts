import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import User from '../../../../models/User';
import Counselor from '../../../../models/counselor';

export async function GET() {
  try {
    await dbConnect();

    // Count patients (users with role 'User')
    const patientsCount = await User.countDocuments({ role: 'User' });

    // Count active counselors
    const counsellorsCount = await Counselor.countDocuments({ status: 'active' });

    const distribution = [
      { name: 'Patients', value: patientsCount },
      { name: 'Counsellors', value: counsellorsCount },
    ];

    return NextResponse.json({ distribution }, { status: 200 });
  } catch (error) {
    console.error('Error fetching distribution data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch distribution data' },
      { status: 500 }
    );
  }
}
