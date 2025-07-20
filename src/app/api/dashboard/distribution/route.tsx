import { NextRequest, NextResponse } from "next/server";
import connectMongoDB from "../../../lib/mongodb";
import User from "../../../models/User";
import Counselor from "../../../models/counselor";

export async function GET(request: NextRequest) {
    try {
        await connectMongoDB();

        // Get patients count (role: 'User')
        const patientsCount = await User.countDocuments({ role: 'User' });
        
        // Get counselors count from Counselor collection (active status)
        const counsellorsCount = await Counselor.countDocuments({ status: 'active' });

        const distribution = [
            { name: 'Patients', value: patientsCount },
            { name: 'Counsellors', value: counsellorsCount }
        ];

        return NextResponse.json({
            distribution,
            total: patientsCount + counsellorsCount,
            breakdown: {
                patients: patientsCount,
                counsellors: counsellorsCount
            }
        });

    } catch (error) {
        console.error("Error fetching user distribution:", error);
        return NextResponse.json(
            { error: "Failed to fetch user distribution" },
            { status: 500 }
        );
    }
}
