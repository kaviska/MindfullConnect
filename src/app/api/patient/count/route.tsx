import { NextRequest, NextResponse } from "next/server";
import connectMongoDB from "../../../lib/mongodb";
import User from "../../../models/User";

export async function GET(request: NextRequest) {
    try {
        await connectMongoDB();
        
        const count = await User.countDocuments({ role: 'User' });
        
        return NextResponse.json({ count });

    } catch (error) {
        console.error("Error counting patients:", error);
        return NextResponse.json(
            { error: "Failed to count patients" },
            { status: 500 }
        );
    }
}
