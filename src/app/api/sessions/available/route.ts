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
    console.log("🔍 Looking for availability with counselorId (User._id):", counselorId);
  console.log("📅 Looking for availability on date:", date);

  const availability = await Availability.findOne({ counselorId, date });

  if (!availability) {
        console.log("❌ No availability found for:", { counselorId, date });

    return NextResponse.json({ availableSlots: [] });
  }
  // ✅ Get booked sessions using the same User._id
  const bookedSessions = await Session.find({ counselorId, date }).select("time");
  console.log("🗓️ Found booked sessions:", bookedSessions);

  const bookedTimes = bookedSessions.map(s => s.time);
  console.log("⏰ Booked times:", bookedTimes);

  const freeSlots = availability.availableSlots.filter((slot: string) => !bookedTimes.includes(slot));
  console.log("✅ Free slots:", freeSlots);

 

  return NextResponse.json({ availableSlots: freeSlots });
}
