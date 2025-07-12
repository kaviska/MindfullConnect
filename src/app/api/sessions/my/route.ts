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
      .sort({ date: 1, time: 1 }) // upcoming first
      .populate("counselorId", "fullName profileImageUrl")
      .select("date time status counselorId");

    return NextResponse.json({ sessions });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
