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

export async function POST(request: NextRequest) {
  await connectDB();

  try {
    const token = request.cookies.get('token')?.value || request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const userId = decoded.userId;

    const profileData = await request.json();

    // Find existing counselor profile
    const existingCounselor = await Counselor.findOne({ userId });
    
    if (!existingCounselor) {
      return NextResponse.json({ error: 'Counselor profile not found' }, { status: 404 });
    }

    // Create Stripe Connect account if not exists
    let stripeAccountId = existingCounselor.stripeAccountId;

    if (!stripeAccountId) {
      try {
        const account = await stripe.accounts.create({
          type: "express",
          capabilities: {
            card_payments: { requested: true },
            transfers: { requested: true },
          },
          metadata: {
            counselorId: existingCounselor._id.toString(),
            userId: userId
          }
        });

        stripeAccountId = account.id;
      } catch (stripeError) {
        console.error('Stripe account creation error:', stripeError);
        // Continue with profile update even if Stripe fails
      }
    }

    // Update counselor profile with new data
    const updatedCounselor = await Counselor.findOneAndUpdate(
      { userId },
      {
        ...profileData,
        profileCompleted: true,
        status: 'active',
        ...(stripeAccountId && { stripeAccountId })
      },
      { new: true }
    );

    return NextResponse.json({
      message: 'Profile updated successfully',
      counselor: updatedCounselor
    }, { status: 200 });

  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}