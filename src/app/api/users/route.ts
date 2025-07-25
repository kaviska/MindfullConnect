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

    // ✅ Get the logged-in user to check their role
    const currentUser = await User.findById(decoded.userId).select("role");
    if (!currentUser) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    // ✅ Define filter based on user role
    let userFilter: any = { _id: { $ne: decoded.userId } }; // Exclude current user

    if (currentUser.role === "counselor") {
      // ✅ If counselor, show only patients
      userFilter.role = "patient";
    } else if (currentUser.role === "patient") {
      // ✅ If patient, show only counselors
      userFilter.role = "counselor";
    }
    // ✅ For admin/superadmin, show all users except themselves (no additional filter)

    // ✅ Fetch filtered users with the same selection as before
    const users = await User.find(userFilter).select(
      "fullName email role _id profileImageUrl"
    );

    // ✅ Keep the same response structure as before
    return NextResponse.json({ users });
  } catch (error: any) {
    console.error("Error fetching users in /api/users:", error.message, error.stack);
    return NextResponse.json({ error: error.message || "Server error" }, { status: 500 });
  }
}