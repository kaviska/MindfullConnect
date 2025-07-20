import { NextResponse } from "next/server";
import dbConnect from "../../../../lib/mongodb";
import Session from "../../../../models/session";

export async function GET() {
    try {
        await dbConnect();

        const currentDate = new Date();
        const SESSION_PRICE = 15000; // LKR 15,000 per session

        // Get all sessions grouped by status
        const allSessions = await Session.find({});

        const statusBreakdown = {
            pending: allSessions.filter(s => s.status === 'pending').length,
            confirmed: allSessions.filter(s => s.status === 'confirmed').length,
            completed: allSessions.filter(s => s.status === 'completed').length,
            cancelled: allSessions.filter(s => s.status === 'cancelled').length,
            'counselor requested reschedule': allSessions.filter(s => s.status === 'counselor requested reschedule').length,
        };

        // Calculate potential vs actual earnings
        const actualEarnings = statusBreakdown.completed * SESSION_PRICE;
        const confirmedEarnings = statusBreakdown.confirmed * SESSION_PRICE;
        const totalPotentialEarnings = (statusBreakdown.completed + statusBreakdown.confirmed) * SESSION_PRICE;

        // Get monthly breakdown for current year
        const currentYear = currentDate.getFullYear();
        const monthlyData = [];

        for (let month = 0; month < 12; month++) {
            const startDate = new Date(currentYear, month, 1).toISOString().split('T')[0];
            const endDate = new Date(currentYear, month + 1, 0).toISOString().split('T')[0];

            const monthSessions = allSessions.filter(session =>
                session.date >= startDate && session.date <= endDate
            );

            const monthCompleted = monthSessions.filter(s => s.status === 'completed').length;
            const monthConfirmed = monthSessions.filter(s => s.status === 'confirmed').length;

            monthlyData.push({
                month: new Date(currentYear, month, 1).toLocaleString("default", { month: "long" }),
                completed: monthCompleted,
                confirmed: monthConfirmed,
                earnings: (monthCompleted + monthConfirmed) * SESSION_PRICE,
                actualEarnings: monthCompleted * SESSION_PRICE,
                projectedEarnings: monthConfirmed * SESSION_PRICE
            });
        }

        return NextResponse.json({
            overview: {
                totalSessions: allSessions.length,
                actualEarnings,
                confirmedEarnings,
                totalPotentialEarnings,
                sessionPrice: SESSION_PRICE
            },
            statusBreakdown,
            monthlyData,
            year: currentYear
        });
    } catch (err) {
        console.error("Business analytics fetch error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
