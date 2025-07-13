import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/db";
import Session from "@/models/Session";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(request: NextRequest) {
  await connectDB();

  try {
    const token = request.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

    const { counselorId, date, time } = await request.json();

    if (!counselorId || !date || !time) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Check for double booking
    const existing = await Session.findOne({ counselorId, date, time });
    if (existing) {
      return NextResponse.json({ error: "Time slot already booked" }, { status: 409 });
    }

    const session = new Session({
      patientId: decoded.userId,
      counselorId,
      date,
      time,
      status: "confirmed",
    });

    //whos is the counsellor counselorId=userid
    //patendids user id

    await session.save();

    return NextResponse.json({ message: "Session booked", session });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
