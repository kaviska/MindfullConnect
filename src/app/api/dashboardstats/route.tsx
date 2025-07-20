import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/mongodb";
import User from "@/app/models/User";
import Session from "@/app/models/sessions";

export async function GET() {
    try {
        await dbConnect();

        // Direct database queries
        const [patients, counselors, sessions] = await Promise.all([
            User.countDocuments({ role: { $regex: new RegExp('^user$', 'i') } }),
            User.countDocuments({ role: { $regex: new RegExp('^counselor$', 'i') } }),
            Session.countDocuments({})
        ]);

        return NextResponse.json({
            success: true,
            data: {
                totalPatients: patients,
                totalCounselors: counselors,
                totalSessions: sessions
            }
        });
    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch statistics" },
            { status: 500 }
        );
    }
}
