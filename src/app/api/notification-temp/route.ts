import mongoose from "mongoose";
import { NextResponse,NextRequest } from "next/server";
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
    const notifications = await Notification.find({});
    return NextResponse.json(notifications, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching notifications", error: error },
      { status: 500 }
    );
  }
}