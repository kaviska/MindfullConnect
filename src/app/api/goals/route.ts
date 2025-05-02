import mongoose from "mongoose";
import Goals from "@/models/Goals";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { NextRequest } from "next/server";
import { createNotification } from "@/utility/backend/notificationService";

export async function POST(req: NextRequest) {
  await dbConnect();
  try {
    const body = await req.json();
    const { title, description, counsellor_id } = body;

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

    if (!counsellor_id || !mongoose.Types.ObjectId.isValid(counsellor_id)) {
      return NextResponse.json(
        { message: "Invalid counsellor ID" },
        { status: 400 }
      );
    }

    const goals = new Goals({
      title: title.trim(),
      description: description.trim(),
      counsellor_id,
    });
    await goals.save();
    const notification = await createNotification({
      type: "question_group",
      message: `New Goal created: ${title}`,
      user_id: "68120f0abdb0b2d10474be42", // Replace with actual user ID
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
