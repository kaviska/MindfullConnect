import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/db";
import Session from "@/models/Session";
import User from "@/models/User";

const JWT_SECRET = process.env.JWT_SECRET!;

function getIdFromRequest(request: NextRequest): string | null {
  const url = new URL(request.url);
  const segments = url.pathname.split('/');
  // Assuming route structure: /api/sessions/[id]
  const idIndex = segments.findIndex(seg => seg === 'sessions') + 1;
  return segments[idIndex] || null;
}

export async function DELETE(request: NextRequest) {
  await connectDB();

  const sessionId = getIdFromRequest(request);
  if (!sessionId) {
    return NextResponse.json({ error: "Missing session id" }, { status: 400 });
  }

  const token = request.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const session = await (Session as any).findById(sessionId);

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    const user = await (User as any).findById(decoded.userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isPatient = session.patientId.toString() === decoded.userId;
    const isCounselor = user.role === "counselor" && session.counselorId.toString() === decoded.userId;

    if (!isPatient && !isCounselor) {
      return NextResponse.json(
        { error: "Forbidden: You can only cancel your own sessions" },
        { status: 403 }
      );
    }

    if (isPatient) {
      const sessionDate = new Date(`${session.date}T${session.time}`);
      const now = new Date();
      const hoursDiff = (sessionDate.getTime() - now.getTime()) / (1000 * 60 * 60);

      if (hoursDiff < 24) {
        return NextResponse.json(
          { error: "Cancellations are only allowed at least 24 hours in advance" },
          { status: 400 }
        );
      }
    }

    if (session.zoomLink) {
      try {
        console.log("Removing Zoom link for cancelled session:", sessionId);
      } catch (zoomError) {
        console.error("Error deleting Zoom meeting:", zoomError);
      }
    }

    await (Session as any).findByIdAndUpdate(sessionId, {
      status: "cancelled",
      zoomLink: null,
    });

    return NextResponse.json({
      message: "Session cancelled successfully",
      sessionId,
    });
  } catch (error: any) {
    console.error("Error cancelling session:", error);
    return NextResponse.json(
      { error: error.message || "Failed to cancel session" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  await connectDB();

  const sessionId = getIdFromRequest(request);
  if (!sessionId) {
    return NextResponse.json({ error: "Missing session id" }, { status: 400 });
  }

  const token = request.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const body = await request.json();
    const { status } = body;

    const session = await (Session as any).findById(sessionId);

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    const user = await (User as any).findById(decoded.userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isCounselor = user.role === "counselor" && session.counselorId.toString() === decoded.userId;

    if (!isCounselor) {
      return NextResponse.json(
        { error: "Forbidden: Only the assigned counselor can update this session" },
        { status: 403 }
      );
    }

    const validStatuses = [
      "pending",
      "confirmed",
      "cancelled",
      "completed",
      "counselor requested reschedule",
    ];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    await (Session as any).findByIdAndUpdate(sessionId, { status });

    return NextResponse.json({
      message: "Session status updated successfully",
      sessionId,
      newStatus: status,
    });
  } catch (error: any) {
    console.error("Error updating session:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update session" },
      { status: 500 }
    );
  }
}
