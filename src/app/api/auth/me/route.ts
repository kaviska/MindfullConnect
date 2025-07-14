import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/models/User";
import dbConnect from "@/lib/db";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

export async function GET(req: NextRequest) {
  await dbConnect();

  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Return user data directly (not wrapped in user object)
    return NextResponse.json({
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      profileImageUrl: user.profileImageUrl || "/ava2.svg"
    }, { status: 200 });

  } catch (error) {
    console.error("Auth check error:", error);
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }
}
