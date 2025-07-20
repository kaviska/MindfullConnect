import { NextRequest, NextResponse } from "next/server";
import connectMongoDB from "../../../lib/mongodb";
import Session from "../../../models/Session";

export async function GET(request: NextRequest) {
    try {
        await connectMongoDB();
        
        const count = await Session.countDocuments();
        
        return NextResponse.json({ count });

    } catch (error) {
        console.error("Error counting sessions:", error);
        return NextResponse.json(
            { error: "Failed to count sessions" },
            { status: 500 }
        );
    }
}
