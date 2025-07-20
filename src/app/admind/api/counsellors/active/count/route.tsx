import { NextRequest, NextResponse } from "next/server";
import connectMongoDB from "../../../../../lib/mongodb";
import Counselor from "../../../../../models/counselor";

export async function GET(request: NextRequest) {
    try {
        await connectMongoDB();
        
        const count = await Counselor.countDocuments({ status: 'active' });
        
        return NextResponse.json({ count });

    } catch (error) {
        console.error("Error counting active counselors:", error);
        return NextResponse.json(
            { error: "Failed to count counselors" },
            { status: 500 }
        );
    }
}
