import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import Payment from '../../../../models/payment';
import Session from '../../../../models/session';

export async function GET() {
  try {
    await dbConnect();

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Get start and end of current month
    const startOfCurrentMonth = new Date(currentYear, currentMonth, 1);
    const endOfCurrentMonth = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59);

    // Get start and end of previous month
    const startOfPreviousMonth = new Date(currentYear, currentMonth - 1, 1);
    const endOfPreviousMonth = new Date(currentYear, currentMonth, 0, 23, 59, 59);

    // Get current month earnings and count
    const currentMonthData = await Payment.aggregate([
      {
        $match: {
          status: 'completed',
          transactionDate: {
            $gte: startOfCurrentMonth,
            $lte: endOfCurrentMonth
          }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);

    // Get previous month earnings and count
    const previousMonthData = await Payment.aggregate([
      {
        $match: {
          status: 'completed',
          transactionDate: {
            $gte: startOfPreviousMonth,
            $lte: endOfPreviousMonth
          }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);

    // Get total all time
    const totalData = await Payment.aggregate([
      {
        $match: {
          status: 'completed'
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);

    // Get session counts for current month
    const currentMonthSessions = await Session.countDocuments({
      createdAt: {
        $gte: startOfCurrentMonth,
        $lte: endOfCurrentMonth
      }
    });

    const currentMonthCompleted = await Session.countDocuments({
      status: 'completed',
      createdAt: {
        $gte: startOfCurrentMonth,
        $lte: endOfCurrentMonth
      }
    });

    const currentMonthConfirmed = await Session.countDocuments({
      status: 'confirmed',
      createdAt: {
        $gte: startOfCurrentMonth,
        $lte: endOfCurrentMonth
      }
    });

    // Get session counts for previous month
    const previousMonthSessions = await Session.countDocuments({
      createdAt: {
        $gte: startOfPreviousMonth,
        $lte: endOfPreviousMonth
      }
    });

    const previousMonthCompleted = await Session.countDocuments({
      status: 'completed',
      createdAt: {
        $gte: startOfPreviousMonth,
        $lte: endOfPreviousMonth
      }
    });

    const previousMonthConfirmed = await Session.countDocuments({
      status: 'confirmed',
      createdAt: {
        $gte: startOfPreviousMonth,
        $lte: endOfPreviousMonth
      }
    });

    // Get total session counts
    const totalSessions = await Session.countDocuments();
    const totalCompleted = await Session.countDocuments({ status: 'completed' });
    const totalConfirmed = await Session.countDocuments({ status: 'confirmed' });

    const currentEarnings = currentMonthData[0]?.total || 0;
    const previousEarnings = previousMonthData[0]?.total || 0;
    const totalEarnings = totalData[0]?.total || 0;

    // Calculate growth percentages
    const earningsGrowth = previousEarnings > 0 
      ? (((currentEarnings - previousEarnings) / previousEarnings) * 100).toFixed(1)
      : '0.0';

    const sessionsGrowth = previousMonthSessions > 0
      ? (((currentMonthSessions - previousMonthSessions) / previousMonthSessions) * 100).toFixed(1)
      : '0.0';

    // Calculate average session price
    const sessionPrice = currentMonthSessions > 0 
      ? Math.round(currentEarnings / currentMonthSessions)
      : 0;

    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                   'July', 'August', 'September', 'October', 'November', 'December'];

    return NextResponse.json({
      currentMonth: {
        earnings: currentEarnings,
        sessions: currentMonthSessions,
        completed: currentMonthCompleted,
        confirmed: currentMonthConfirmed,
        month: months[currentMonth]
      },
      previousMonth: {
        earnings: previousEarnings,
        sessions: previousMonthSessions,
        completed: previousMonthCompleted,
        confirmed: previousMonthConfirmed
      },
      total: {
        earnings: totalEarnings,
        sessions: totalSessions,
        completed: totalCompleted,
        confirmed: totalConfirmed
      },
      growth: {
        earnings: earningsGrowth,
        sessions: sessionsGrowth
      },
      sessionPrice: sessionPrice
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching earnings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch earnings' },
      { status: 500 }
    );
  }
}
