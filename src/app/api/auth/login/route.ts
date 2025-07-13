import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/db";
import User from "@/models/User";
import Counselor from "@/models/Counselor";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret"; // Use .env for production

export async function POST(request: NextRequest) {
  await connectDB();

  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    user.lastSeen = new Date();
    await user.save();

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "1h",
    });

    //check if user is counselor and status is active
    if (user.role === "counselor") {
      const counselor = await Counselor.findOne({ userId: user._id });
      if (!counselor || counselor.status !== "active") {
        return NextResponse.json(
          { error: "Counselor account is not active" },
          { status: 403 }
        );
      }
    }

    // ✅ Create response with cookies
    const response = NextResponse.json({
      message: "Login successful",
      token:token,
      user: {
        id: user._id,
        _id: user._id, // Include both for compatibility
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });

    // Set JWT token in httpOnly cookie
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60, // 1 hour
      path: "/",
    });

    // Optional: set userId cookie if you want client access
    response.cookies.set("userId", user._id.toString(), {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
  
