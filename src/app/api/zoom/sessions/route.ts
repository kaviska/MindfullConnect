import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import ZoomMeeting from '@/models/ZoomMeetings';
// import { getUserFromToken } from '@/lib/getUserFromToken'; // JWT-based logic (commented)

export async function GET() {
  try {
    await dbConnect();

    /*
    const user = await getUserFromToken();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    */

    // Temporary hardcoded user (replace with getUserFromToken logic commented above)
    const user: { id: string; username: string; email: string } = {
      id: '681bcecb2a399b0e3c35e3d6',
      username: '681bcecb2a399b0e3c35e3d6',
      email: 'jane@gmail.com'
    };

    const meetings = await ZoomMeeting.find({ counsellorId: user.id })
      .sort({ startTime: -1 })
      .lean();

    return NextResponse.json({ meetings }, { status: 200 });
  } catch (err: any) {
    console.error('[ZoomMeeting GET Error]', err);
    return NextResponse.json({ error: 'Failed to fetch sessions' }, { status: 500 });
  }
}