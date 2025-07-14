import mongoose from "mongoose";
import Goals from "@/models/Goals";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { NextRequest } from "next/server";
import { createNotification } from "@/utility/backend/notificationService";
import jwt from "jsonwebtoken";
import User from "@/models/User";
import Counselor from "@/models/Counselor";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

export async function POST(req: NextRequest) {
  await dbConnect();
  try {
    // Get JWT token from cookies
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 }
      );
    }

    // Verify JWT token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    } catch (error) {
      return NextResponse.json(
        { message: "Invalid token" },
        { status: 401 }
      );
    }

    // Get user and verify they are a counselor
    const user = await User.findById(decoded.userId);
    if (!user || user.role !== "counselor") {
      return NextResponse.json(
        { message: "Only counselors can create goals" },
        { status: 403 }
      );
    }

    // Get counselor profile
    const counselor = await Counselor.findOne({ userId: user._id });
    if (!counselor) {
      return NextResponse.json(
        { message: "Counselor profile not found" },
        { status: 404 }
      );
    }

    const body = await req.json();
    const { title, description } = body;

    // Validation
    if (!title || typeof title !== "string" || title.trim().length < 2) {
      return NextResponse.json(
        {
          message:
            "Title must be a non-empty string with at least 2 characters",
        },
        { status: 400 }
      );
    }

    if (
      !description ||
      typeof description !== "string" ||
      description.trim().length < 5
    ) {
      return NextResponse.json(
        {
          message:
            "Description must be a non-empty string with at least 5 characters",
        },
        { status: 400 }
      );
    }

    const goals = new Goals({
      title: title.trim(),
      description: description.trim(),
      counsellor_id: counselor._id,
    });
    await goals.save();

    const notification = await createNotification({
      type: "question_group",
      message: `New Goal created: ${title}`,
      user_id: decoded.userId,
    });

    return NextResponse.json(
      { message: "Goal created successfully", data: goals },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating goal:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  await dbConnect();
  try {
    const goals = await Goals.find({});
    return NextResponse.json(goals, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching goals", error: error },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  await dbConnect();
  try {
    const body = await req.json();
    const { id, title, description } = body;

    // Validation
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid goal ID" }, { status: 400 });
    }

    if (title && (typeof title !== "string" || title.trim().length < 2)) {
      return NextResponse.json(
        {
          message:
            "Title must be a non-empty string with at least 2 characters",
        },
        { status: 400 }
      );
    }

    if (
      description &&
      (typeof description !== "string" || description.trim().length < 5)
    ) {
      return NextResponse.json(
        {
          message:
            "Description must be a non-empty string with at least 5 characters",
        },
        { status: 400 }
      );
    }

    const updatedGoal = await Goals.findByIdAndUpdate(
      id,
      {
        ...(title && { title: title.trim() }),
        ...(description && { description: description.trim() }),
      },
      { new: true }
    );

    if (!updatedGoal) {
      return NextResponse.json({ message: "Goal not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Goal updated successfully", data: updatedGoal },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating goal:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  await dbConnect();
  try {
    const { searchParams } = new URL(req.url!);
    const id = searchParams.get("id");

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid goal ID" }, { status: 400 });
    }

    const deletedGoal = await Goals.findByIdAndDelete(id);

    if (!deletedGoal) {
      return NextResponse.json({ message: "Goal not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Goal deleted successfully", data: deletedGoal },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting goal:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error },
      { status: 500 }
    );
  }
}
