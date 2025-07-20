import { NextResponse } from "next/server";
import dbConnect from "../../../../lib/mongodb";
import Session from "../../../../models/session";

export async function GET() {
    try {
        await dbConnect();

        const SESSION_PRICE = 500; // LKR 500 per session
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        // Current month range
        const startOfMonth = new Date(currentYear, currentMonth, 1).toISOString().split('T')[0];
        const endOfMonth = new Date(currentYear, currentMonth + 1, 0).toISOString().split('T')[0];

        // Previous month range
        const prevMonthStart = new Date(currentYear, currentMonth - 1, 1).toISOString().split('T')[0];
        const prevMonthEnd = new Date(currentYear, currentMonth, 0).toISOString().split('T')[0];

        // Current month metrics
        const currentMonthSessions = await Session.find({
            date: { $gte: startOfMonth, $lte: endOfMonth }
        });

        const currentMonthCompleted = currentMonthSessions.filter(s => s.status === 'completed').length;
        const currentMonthConfirmed = currentMonthSessions.filter(s => s.status === 'confirmed').length;
        const currentMonthEarnings = (currentMonthCompleted + currentMonthConfirmed) * SESSION_PRICE;

        // Previous month metrics
        const prevMonthSessions = await Session.find({
            date: { $gte: prevMonthStart, $lte: prevMonthEnd }
        });

        const prevMonthCompleted = prevMonthSessions.filter(s => s.status === 'completed').length;
        const prevMonthConfirmed = prevMonthSessions.filter(s => s.status === 'confirmed').length;
        const prevMonthEarnings = (prevMonthCompleted + prevMonthConfirmed) * SESSION_PRICE;

        // Total lifetime metrics
        const allSessions = await Session.find({});
        const totalCompleted = allSessions.filter(s => s.status === 'completed').length;
        const totalConfirmed = allSessions.filter(s => s.status === 'confirmed').length;
        const totalEarnings = (totalCompleted + totalConfirmed) * SESSION_PRICE;

        // Calculate growth percentage
        const earningsGrowth = prevMonthEarnings > 0 
            ? ((currentMonthEarnings - prevMonthEarnings) / prevMonthEarnings * 100).toFixed(1)
            : 0;

        return NextResponse.json({
            currentMonth: {
                earnings: currentMonthEarnings,
                sessions: currentMonthCompleted + currentMonthConfirmed,
                completed: currentMonthCompleted,
                confirmed: currentMonthConfirmed,
                month: currentDate.toLocaleString("default", { month: "long" })
            },
            previousMonth: {
                earnings: prevMonthEarnings,
                sessions: prevMonthCompleted + prevMonthConfirmed,
                completed: prevMonthCompleted,
                confirmed: prevMonthConfirmed
            },
            total: {
                earnings: totalEarnings,
                sessions: totalCompleted + totalConfirmed,
                completed: totalCompleted,
                confirmed: totalConfirmed
            },
            growth: {
                earnings: earningsGrowth,
                sessions: prevMonthSessions.length > 0 
                    ? ((currentMonthSessions.length - prevMonthSessions.length) / prevMonthSessions.length * 100).toFixed(1)
                    : 0
            },
            sessionPrice: SESSION_PRICE
        });
    } catch (err) {
        console.error("Earnings summary fetch error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
