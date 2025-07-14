import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/db";
import Session from "@/models/Session";
import Counselor from "@/models/Counselor";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(request: NextRequest) {
  await connectDB();

  try {
    // ✅ Get token from cookies instead of Authorization header
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

    // ✅ Update to match your request body format
    const { counselorId, time, date } = await request.json();

    if (!counselorId || !date || !time) {
      return NextResponse.json({ error: "Missing required fields: counselorId, date, time" }, { status: 400 });
    }

    // Check for double booking
    const existing = await Session.findOne({ 
      counselorId, 
      date, 
      time // Use time from request (matches your body)
    });
    
    if (existing) {
      return NextResponse.json({ error: "Time slot already booked" }, { status: 409 });
    }

    // Create the session
    const session = new Session({
      patientId: decoded.userId,
      counselorId,
      date,
      time, // Use time from request
      status: "booked",
    });

    await session.save();

    // ✅ Add patient to counselor's patients_ids array (if not already present)
    await Counselor.findByIdAndUpdate(
      counselorId,
      {
        $addToSet: { patients_ids: decoded.userId } // Only adds if not already present
      },
      { new: true }
    );

    console.log(`Session booked: Patient ${decoded.userId} with Counselor ${counselorId} on ${date} at ${time}`);

    return NextResponse.json({ 
      message: "Session booked successfully", 
      session: {
        id: session._id,
        patientId: session.patientId,
        counselorId: session.counselorId,
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