import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/db";
import Session from "@/models/Session";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();

  const sessionId = params.id;
  
  // ✅ Use cookies instead of Authorization header
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const session = await Session.findById(sessionId);

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    // Check if logged-in user is the one who booked it
    if (session.patientId.toString() !== decoded.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Check if cancellation is at least 24 hours in advance (reduced from 2 days)
    const sessionDate = new Date(`${session.date}T${session.time}`);
    const now = new Date();
    const timeDiff = sessionDate.getTime() - now.getTime();
    const hoursDiff = timeDiff / (1000 * 60 * 60);

    if (hoursDiff < 24) {
      return NextResponse.json({
        error: "Cancellations are only allowed at least 24 hours in advance"
      }, { status: 400 });
    }

    // ✅ Update status instead of deleting
    await Session.findByIdAndUpdate(sessionId, { status: 'cancelled' });

    return NextResponse.json({ message: "Session cancelled successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}