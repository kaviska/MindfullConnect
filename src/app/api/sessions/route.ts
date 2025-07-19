import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/db";
import Session from "@/models/Session";
import Counselor from "@/models/Counselor";
import { createNotification } from "@/utility/backend/notificationService";


const JWT_SECRET = process.env.JWT_SECRET!;

// Updated POST route - Create session
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

    // ✅ Check for existing session using User._id directly
    const existing = await Session.findOne({ 
      counselorId: counselorId, // Use User._id directly, no lookup needed
      date, 
      time
    });
    
    if (existing) {
      return NextResponse.json({ error: "Time slot already booked" }, { status: 409 });
    }

    // ✅ Create session with User._id directly
    const session = new Session({
      patientId: decoded.userId,
      counselorId: counselorId, // Use User._id directly
      date,
      time,
      status: "pending", // Use a valid status from your enum
    });

    await session.save();

    // ✅ Optional: Update counselor's patient list using User._id
    try {
      const counselor = await Counselor.findOne({ userId: counselorId }).exec();
      if (counselor) {
        await Counselor.findByIdAndUpdate(
          counselor._id,
          {
            $addToSet: { patients_ids: decoded.userId }
          },
          { new: true }
        );
      }
    } catch (counselorError) {
      console.log("Warning: Could not update counselor patient list:", counselorError);
      // Continue without failing the session creation
    }
    

    console.log(`Session booked: Patient ${decoded.userId} with Counselor ${counselorId} on ${date} at ${time}`);

    return NextResponse.json({ 
      message: "Session booked successfully", 
      session: {
        _id: session._id,
        patientId: session.patientId,
        counselorId: session.counselorId,
        date: session.date,
        time: session.time,
        status: session.status,
        zoomLink: session.zoomLink
      }
    });

  } catch (error: any) {
    console.error("Error booking session:", error);
    return NextResponse.json({ error: error.message || "Failed to book session" }, { status: 500 });
  }
}

// PATCH route - Update session status
export async function PATCH(request: NextRequest) {
  await connectDB();

  try {
    const { sessionId, status } = await request.json();

    if (!sessionId || !status) {
      return NextResponse.json({ error: "Missing required fields: sessionId, status" }, { status: 400 });
    }

    // Validate status value
    const validStatuses = ["pending", "confirmed", "cancelled", "completed", "counselor requested reschedule"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status value" }, { status: 400 });
    }

    // Find and update the session
    const session = await Session.findByIdAndUpdate(
      sessionId,
      { status },
      { new: true }
    );

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    console.log(`Session ${sessionId} status updated to: ${status}`);
     // Create notification for the counselor 
    const notification = await createNotification({
      type: "session_created",
      message: `New Session created: Date: ${session.date}, Time: ${session.time}, Link: ${session.zoomLink || "N/A"}`,
      user_id: session.counselorId,
    });

    return NextResponse.json({ 
      message: "Session status updated successfully", 
      session: {
        _id: session._id,
        patientId: session.patientId,
        counselorId: session.counselorId,
        date: session.date,
        time: session.time,
        status: session.status,
        zoomLink: session.zoomLink
      }
    });

  } catch (error: any) {
    console.error("Error updating session status:", error);
    return NextResponse.json({ error: error.message || "Failed to update session status" }, { status: 500 });
  }
}
