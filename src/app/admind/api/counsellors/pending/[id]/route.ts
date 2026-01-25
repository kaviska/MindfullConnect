import { NextResponse } from 'next/server';
import dbConnect from '../../../../../lib/mongodb';
import Counselor from '../../../../../models/counselor';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    const { id } = await params;

    const user = await Counselor.findById(id)
      .populate('userId', 'email fullName')
      .lean();

    if (user && (user as any).userId) {
      const nameParts = ((user as any).name || '').split(' ');
      (user as any).email = (user as any).userId.email || 'N/A';
      (user as any).fullName = (user as any).userId.fullName || (user as any).name;
      (user as any).firstname = nameParts[0] || '';
      (user as any).lastname = nameParts.slice(1).join(' ') || '';
    }

    if (!user) {
      return NextResponse.json(
        { error: 'Counselor not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error('Error fetching counselor:', error);
    return NextResponse.json(
      { error: 'Failed to fetch counselor' },
      { status: 500 }
    );
  }
}
