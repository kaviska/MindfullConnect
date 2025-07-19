import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../lib/mongodb";
import User from "../../../models/User";

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();

        const params = await context.params; // await here
        const id = params.id;

        const user = await User.findById(id).lean();

        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        // Format the user data
        const userData = user as any; // Type assertion for MongoDB document
        const formattedUser = {
            _id: userData._id.toString(),
            fullName: userData.fullName,
            email: userData.email,
            role: userData.role,
            lastSeen: userData.lastSeen ? new Date(userData.lastSeen).toISOString() : null,
            isVerified: userData.isVerified,
            otp: userData.otp,
            otpExpiry: userData.otpExpiry ? new Date(userData.otpExpiry).toISOString() : null
        };

        return NextResponse.json({ success: true, user: formattedUser });
    } catch (error) {
        console.error("GET /api/patient/[id] failed:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}
