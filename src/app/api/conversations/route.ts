import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/db";
import Conversation from "@/models/Conversation";
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

    const conversations = await Conversation.find({
      participants: decoded.userId,
    })
      .populate("participants", "fullName email profileImageUrl lastSeen role")
      .populate("lastMessage");

    return NextResponse.json({ conversations });
  } catch (error: any) {
    console.error("Error fetching conversations:", error.message, error.stack);
    return NextResponse.json({ error: error.message || "Server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
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

    const { participantId } = await request.json();

    const participant = await User.findById(participantId);
    if (!participant) {
      return NextResponse.json({ error: "Participant not found" }, { status: 404 });
    }

    const existingConversation = await Conversation.findOne({
      participants: { $all: [decoded.userId, participantId] },
    });

    if (existingConversation) {
      return NextResponse.json({ conversation: existingConversation });
    }

    const conversation = new Conversation({
      participants: [decoded.userId, participantId],
    });

    await conversation.save();
    await conversation.populate("participants", "fullName email profileImageUrl lastSeen role");

    return NextResponse.json({ conversation }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating conversation:", error.message, error.stack);
    return NextResponse.json({ error: error.message || "Server error" }, { status: 500 });
  }
}