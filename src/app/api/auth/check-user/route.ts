import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import Counselor from "@/models/Counselor";

export async function POST(request: NextRequest) {
  await connectDB();

  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let counselorStatus = null;
    if (user.role === "counselor") {
      const counselor = await Counselor.findOne({ userId: user._id });
      counselorStatus = counselor?.status || "inactive";
    }

    return NextResponse.json({
      user: {
        id: user._id,
        role: user.role,
        counselorStatus
      }
    });

  } catch (error) {
    console.error("Check user error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
