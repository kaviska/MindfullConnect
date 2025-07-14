import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/db";
import Session from "@/models/Session";
import Counselor from "@/models/Counselor";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(request: NextRequest) {
  await connectDB();

  try {
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const { counselorId, time, date } = await request.json();

    if (!counselorId || !date || !time) {
      return NextResponse.json({ error: "Missing required fields: counselorId, date, time" }, { status: 400 });
    }

    // Find the counselor document by userId to get the actual counselor _id
    const counselor = await Counselor.findOne({ userId: counselorId });
    if (!counselor) {
      return NextResponse.json({ error: "Counselor not found" }, { status: 404 });
    }

    const existing = await Session.findOne({ 
      counselorId: counselor._id, // Use the counselor's _id
      date, 
      time
    });
    
    if (existing) {
      return NextResponse.json({ error: "Time slot already booked" }, { status: 409 });
    }

    const session = new Session({
      patientId: decoded.userId,
      counselorId: counselor._id, // Use the counselor's _id
      date,
      time,
      status: "booked",
    });

    await session.save();

    await Counselor.findByIdAndUpdate(
      counselor._id, // Use the counselor's _id
      {
        $addToSet: { patients_ids: decoded.userId }
      },
      { new: true }
    );

    console.log(`Session booked: Patient ${decoded.userId} with Counselor ${counselor._id} on ${date} at ${time}`);

    return NextResponse.json({ 
      message: "Session booked successfully", 
      session: {
        id: session._id,
        patientId: session.patientId,
        counselorId: counselorId, // Return the original userId for frontend consistency
        date: session.date,
        time: session.time,
        status: session.status
      }
    });

  } catch (error: any) {
    console.error("Error booking session:", error);
    return NextResponse.json({ error: error.message || "Failed to book session" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  await connectDB();

  try {
    const { sessionId, status } = await request.json();

    if (!sessionId || !status) {
      return NextResponse.json({ error: "Missing sessionId or status" }, { status: 400 });
    }

    const session = await Session.findByIdAndUpdate(
      sessionId,
      { status },
      { new: true }
    );

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    return NextResponse.json({ 
      message: "Session status updated successfully", 
      session 
    });

  } catch (error: any) {
    console.error("Error updating session status:", error);
    return NextResponse.json({ error: error.message || "Failed to update session" }, { status: 500 });
  }
}