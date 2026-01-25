import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import Payment from '../../../../models/payment';

export async function GET() {
  try {
    await dbConnect();

    const now = new Date();
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    // Get earnings for last 6 months
    const chartData = await Payment.aggregate([
      {
        $match: {
          status: 'completed',
          transactionDate: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$transactionDate' },
            month: { $month: '$transactionDate' }
          },
          total: { $sum: '$amount' }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    // Format the data for the chart
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const formattedData = chartData.map(item => ({
      month: months[item._id.month - 1],
      total: item.total
    }));

    // Fill in missing months with 0
    const allMonths = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = months[date.getMonth()];
      const existing = formattedData.find(d => d.month === monthName);
      allMonths.push({
        month: monthName,
        total: existing?.total || 0
      });
    }

    return NextResponse.json(allMonths, { status: 200 });
  } catch (error) {
    console.error('Error fetching chart data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chart data' },
      { status: 500 }
    );
  }
}
