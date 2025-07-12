import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Availability from "@/models/Availability";
import Session from "@/models/Session";

export async function GET(request: NextRequest) {
  await connectDB();

  const counselorId = request.nextUrl.searchParams.get("counselorId");
  const date = request.nextUrl.searchParams.get("date");

  if (!counselorId || !date) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  const availability = await Availability.findOne({ counselorId, date });

  if (!availability) {
    return NextResponse.json({ availableSlots: [] });
  }

  const bookedSessions = await Session.find({ counselorId, date }).select("time");

  const bookedTimes = bookedSessions.map(s => s.time);
const freeSlots = availability.availableSlots.filter((slot: string) => !bookedTimes.includes(slot));

  return NextResponse.json({ availableSlots: freeSlots });
}
