import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import Counselor from '../../../../models/counselor';

export async function GET(request: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const query = searchParams.get('q') || '';
    const limit = 10;
    const skip = (page - 1) * limit;

    // Build search filter for pending counselors
    const filter: any = { status: 'pending' };
    
    if (query) {
      filter.$or = [
        { name: { $regex: query, $options: 'i' } },
        { specialty: { $regex: query, $options: 'i' } }
      ];
    }

    // Fetch pending counselors with pagination
    const users = await Counselor.find(filter)
      .populate('userId', 'email fullName')
      .select('name specialty yearsOfExperience consultationFee rating status createdAt bio reviews userId')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
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

    // Get total count for pagination
    const totalCount = await Counselor.countDocuments(filter);
    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({ users: formattedUsers, totalPages }, { status: 200 });
  } catch (error) {
    console.error('Error fetching pending counselors:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pending counselors' },
      { status: 500 }
    );
  }
}
