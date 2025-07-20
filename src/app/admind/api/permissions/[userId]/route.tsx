// /admind/api/permissions/[userId]/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import Admin from '../../../../models/Admin'; 


export async function GET(
  _req: Request,
  context: { params: { userId: string } }
) {
  await dbConnect();

  const { userId } = context.params;

  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  }

  try {
    const admin = await Admin.findById(userId).lean();

    if (!admin || Array.isArray(admin)) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
    }

    return NextResponse.json({ permissions: (admin as any).permissions || {} });
  } catch (error) {
    return NextResponse.json({ error: 'Server error', details: error }, { status: 500 });
  }
}


