import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import Report from '../../../../models/report';

export async function GET(request: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = 10;
    const skip = (page - 1) * limit;

    // Fetch resolved reports with pagination
    const reports = await Report.find({ status: 'Resolved' })
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const totalCount = await Report.countDocuments({ status: 'Resolved' });
    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({ reports, totalPages }, { status: 200 });
  } catch (error) {
    console.error('Error fetching resolved reports:', error);
    return NextResponse.json(
      { error: 'Failed to fetch resolved reports' },
      { status: 500 }
    );
  }
}
