import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import Report from '../../../../models/report';

export async function GET() {
  try {
    await dbConnect();

    // Get total counts for different statuses
    const pendingCount = await Report.countDocuments({ status: 'Pending' });
    const resolvedCount = await Report.countDocuments({ status: 'Resolved' });
    const totalCount = pendingCount + resolvedCount;

    return NextResponse.json({
      pending: pendingCount,
      resolved: resolvedCount,
      total: totalCount
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching report stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch report stats' },
      { status: 500 }
    );
  }
}
