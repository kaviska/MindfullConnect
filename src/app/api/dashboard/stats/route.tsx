import { NextResponse } from "next/server";
import dbConnect from "../../../lib/mongodb";
import User from "../../../models/User";
import Session from "../../../models/sessions";

export async function GET() {
    try {
        await dbConnect();

        // Get total patients (role = User)
        const [patientCount, counselorCount, sessionCount] = await Promise.all([
            // Count patients (role = User)
            User.countDocuments({
                role: { $regex: new RegExp("User", "i") } // Case insensitive match
            }),

            // Count counselors
            User.countDocuments({
                role: { $regex: new RegExp("counselor", "i") } // Case insensitive match
            }),

            // Count all sessions
            Session.countDocuments({})
        ]);

        console.log('Stats retrieved:', { patientCount, counselorCount, sessionCount }); // Debug log

        return NextResponse.json({
            totalPatients: patientCount,
            totalCounselors: counselorCount,
            totalSessions: sessionCount
        });
    } catch (error) {
        console.error("Error details:", error);
        return NextResponse.json(
            { error: "Failed to fetch statistics" },
            { status: 500 }
        );
    }
}
