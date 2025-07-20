import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/db";
import User from "@/models/User";
import Counselor from "@/models/Counselor";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// GET - Fetch counselor profile
export async function GET(request: NextRequest) {
  await connectDB();

  try {
    // Get token from cookies
    const token = request.cookies.get("token")?.value;
    
    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    
    // Find user
    const user = await User.findById(decoded.userId);
    if (!user || user.role !== "counselor") {
      return NextResponse.json(
        { error: "Unauthorized - Counselor access required" },
        { status: 403 }
      );
    }

    // Find counselor profile
    const counselor = await Counselor.findOne({ userId: user._id });
    if (!counselor) {
      return NextResponse.json(
        { error: "Counselor profile not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      counselor: counselor,
    });

  } catch (error) {
    console.error("Get counselor profile error:", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}

// PUT - Update counselor profile
export async function PUT(request: NextRequest) {
  await connectDB();

  try {
    // Get token from cookies
    const token = request.cookies.get("token")?.value;
    
    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    
    // Find user
    const user = await User.findById(decoded.userId);
    if (!user || user.role !== "counselor") {
      return NextResponse.json(
        { error: "Unauthorized - Counselor access required" },
        { status: 403 }
      );
    }

    // Get update data
    const updateData = await request.json();

    // Remove fields that shouldn't be updated directly
    const { userId, _id, __v, createdAt, rating, reviews, ...allowedUpdates } = updateData;

    // Update counselor profile
    const counselor = await Counselor.findOneAndUpdate(
      { userId: user._id },
      { 
        ...allowedUpdates,
        profileCompleted: true // Mark profile as completed when updated
      },
      { new: true, runValidators: true }
    );

    if (!counselor) {
      return NextResponse.json(
        { error: "Counselor profile not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      counselor: counselor,
    });

  } catch (error) {
    console.error("Update counselor profile error:", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
