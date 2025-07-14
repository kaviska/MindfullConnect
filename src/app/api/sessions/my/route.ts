// /app/api/sessions/my/route.ts
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/db";
import Session from "@/models/Session";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET(request: NextRequest) {
  await connectDB();

  try {
    const token = request.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

    const sessions = await Session.find({ patientId: decoded.userId })
      .sort({ date: 1, time: 1 }) // earliest first
      .populate("counselorId", "fullName"); // Only get fullName of counselor

    // ✨ Map result to frontend-friendly shape
    const result = sessions.map((s) => ({
      date: s.date,
      time: s.time,
      counselor: s.counselorId?.fullName || "Counselor"
    }));

    return NextResponse.json({ sessions: result });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
