import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/db";
import User from "@/models/User";

export async function GET(request: NextRequest) {
  await connectDB();

  try {
    // Get JWT token from cookies
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
      { message: "Authentication required" },
      { status: 401 }
      );
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not defined");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    // Verify JWT token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET) as { userId: string };
    } catch (error) {
      return NextResponse.json(
      { message: "Invalid token" },
      { status: 401 }
      );
    }

    // Fetch all users except the logged-in user, include profileImageUrl
    const users = await User.find({ _id: { $ne: decoded.userId } }).select(
      "fullName email role _id profileImageUrl"
    );

    return NextResponse.json({ users });
  } catch (error: any) {
    console.error("Error fetching users in /api/users:", error.message, error.stack);
    return NextResponse.json({ error: error.message || "Server error" }, { status: 500 });
  }
}