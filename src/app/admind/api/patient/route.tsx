import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../lib/mongodb";
import User from "../../../models/User";
import { Types } from 'mongoose';

export async function GET(req: NextRequest) {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page") || 1);
    const q = searchParams.get("q") || "";
    const pageSize = 10;

    const query: any = { role: "User" };  // Changed from "patient" to "User"
    if (q.length > 2) {
        query.fullName = { $regex: q, $options: "i" };
    }

    const totalUsers = await User.countDocuments(query);
    const totalPages = Math.ceil(totalUsers / pageSize);

    const users = await User.find(query)
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .lean();

    // Format the data
    const formattedUsers = users.map(user => {
        const userData = user as any; // Type assertion for MongoDB document
        return {
            _id: userData._id.toString(),
            fullName: userData.fullName,
            email: userData.email,
            role: userData.role,
            lastSeen: userData.lastSeen ? new Date(userData.lastSeen).toISOString() : null,
            isVerified: userData.isVerified,
            otp: userData.otp,
            otpExpiry: userData.otpExpiry ? new Date(userData.otpExpiry).toISOString() : null
        };
    });

    return NextResponse.json({ users: formattedUsers, totalPages });
}
