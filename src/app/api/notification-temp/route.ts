import mongoose from "mongoose";
import { NextResponse, NextRequest } from "next/server";
import Notification from "@/models/Notification";
import dbConnect from "@/lib/mongodb";
import { createNotification } from "@/utility/backend/notificationService";

export async function POST(req: NextRequest) {
  await dbConnect();
  try {
    const body = await req.json();
    const { type, message, user_id } = body;
    if (!type || !message || !user_id) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    const notification = await createNotification({
      type,
      message,
      user_id,
    });

    return NextResponse.json(notification, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error creating notification", error: error },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  await dbConnect();
  try {
    const { searchParams } = new URL(req.url);
    const user_id = searchParams.get("user_id");
    const query = user_id ? { user_id } : {};
    const notifications = await Notification.find(query);
    return NextResponse.json(notifications, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching notifications", error: error },
      { status: 500 }
    );
  }
}

// Update a notification
export async function PUT(req: NextRequest) {
  await dbConnect();
  try {
    const body = await req.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { message: "Notification ID is required" },
        { status: 400 }
      );
    }

    const updatedNotification = await Notification.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!updatedNotification) {
      return NextResponse.json(
        { message: "Notification not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedNotification, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error updating notification", error: error },
      { status: 500 }
    );
  }
}

// Delete a notification
export async function DELETE(req: NextRequest) {
  await dbConnect();
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "Notification ID is required" },
        { status: 400 }
      );
    }

    const deletedNotification = await Notification.findByIdAndDelete(id);

    if (!deletedNotification) {
      return NextResponse.json(
        { message: "Notification not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Notification deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error deleting notification", error: error },
      { status: 500 }
    );
  }
}