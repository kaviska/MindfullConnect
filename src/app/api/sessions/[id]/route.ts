import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/db";
import Session from "@/models/Session";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();

  const sessionId = params.id;
  const token = request.headers.get("authorization")?.split(" ")[1];

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

    // Check if cancellation is at least 2 days in advance
    const sessionDate = new Date(`${session.date}T${session.time}`);
    const now = new Date();
    const timeDiff = sessionDate.getTime() - now.getTime();
    const daysDiff = timeDiff / (1000 * 60 * 60 * 24);

    if (daysDiff < 2) {
      return NextResponse.json({
        error: "Cancellations are only allowed at least 2 days in advance"
      }, { status: 400 });
    }

    await Session.findByIdAndDelete(sessionId);

    return NextResponse.json({ message: "Session cancelled successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
