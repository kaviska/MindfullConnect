import { NextResponse } from "next/server";
import dbConnect from "../../../../lib/mongodb";
import Session from "../../../../models/session";

export async function GET() {
    try {
        await dbConnect();

        // Standard session price (in LKR)
        const SESSION_PRICE = 500; // LKR 500 per session

        const currentDate = new Date();
        const months = [];
        
        // Generate last 6 months data
        for (let i = 5; i >= 0; i--) {
            const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
            const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i + 1, 0);
            
            // Convert to string format for database query (YYYY-MM-DD)
            const startDateStr = startDate.toISOString().split('T')[0];
            const endDateStr = endDate.toISOString().split('T')[0];
            
            // Count completed sessions for this month
            const completedSessions = await Session.countDocuments({
                status: "completed",
                date: {
                    $gte: startDateStr,
                    $lte: endDateStr
                }
            });

            // Count confirmed sessions (assuming they will be completed)
            const confirmedSessions = await Session.countDocuments({
                status: "confirmed",
                date: {
                    $gte: startDateStr,
                    $lte: endDateStr
                }
            });

            // Calculate total earnings for the month
            const totalSessions = completedSessions + confirmedSessions;
            const monthlyEarnings = totalSessions * SESSION_PRICE;

            months.push({
                month: startDate.toLocaleString("default", { month: "long" }),
                total: monthlyEarnings,
                sessions: totalSessions,
                completed: completedSessions,
                confirmed: confirmedSessions
            });
        }

        return NextResponse.json(months);
    } catch (err) {
        console.error("Monthly earnings fetch error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
