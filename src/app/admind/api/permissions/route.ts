import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import Admin from '../../../models/Admin'; // Adjust path if needed

export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const { employeeId, permissions } = await req.json();

    if (!employeeId || !permissions) {
      return NextResponse.json({ error: 'employeeId and permissions are required' }, { status: 400 });
    }

    const updatedAdmin = await Admin.findByIdAndUpdate(
      employeeId,
      { permissions },
      { new: true }
    );

    if (!updatedAdmin) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Permissions updated successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Server error', details: error }, { status: 500 });
  }
}
