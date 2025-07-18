import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Availability from "@/models/Availability";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import { startOfWeek, endOfWeek, format, addDays } from "date-fns";

export async function GET(req: NextRequest) {
  await connectDB();

  try {
    const { searchParams } = new URL(req.url);
    const weekStart = searchParams.get("weekStart");

    if (!weekStart || isNaN(Date.parse(weekStart))) {
      return NextResponse.json({ error: "Invalid or missing weekStart date" }, { status: 400 });
    }

    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Authentication required" }, { status: 401 });
    }

    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET environment variable is not set");
    }

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    } catch (error: any) {
      if (error.name === "TokenExpiredError") {
        return NextResponse.json({ message: "Token expired" }, { status: 401 });
      }
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    if (user.role !== "counselor") {
      return NextResponse.json(
        { error: "Unauthorized: Only counselors can view availability" },
        { status: 403 }
      );
    }

    const startDate = startOfWeek(new Date(weekStart), { weekStartsOn: 1 });
    const endDate = endOfWeek(startDate, { weekStartsOn: 1 });
    const availability = await Availability.find({
      counselorId: user.id,
      date: {
        $gte: format(startDate, "yyyy-MM-dd"),
        $lte: format(endDate, "yyyy-MM-dd"),
      },
    });

    return NextResponse.json({ availabilities: availability });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  await connectDB();

  try {
    // ✅ Only get date and availableSlots from body - no counselorId
    const { date, availableSlots } = await req.json();

    const isValidDate = (date: string) => !isNaN(Date.parse(date));
    const isValidTimeSlot = (slot: string) => /^\d{2}:\d{2}$/.test(slot);
    if (!isValidDate(date) || !Array.isArray(availableSlots) || !availableSlots.every(isValidTimeSlot)) {
      return NextResponse.json({ error: "Invalid date or time slot format" }, { status: 400 });
    }

    // ✅ Get user from token authentication (required)
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Authentication required" }, { status: 401 });
    }

    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET environment variable is not set");
    }

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    } catch (error: any) {
      if (error.name === "TokenExpiredError") {
        return NextResponse.json({ message: "Token expired" }, { status: 401 });
      }
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // ✅ Only counselors can set availability
    if (user.role !== "counselor") {
      return NextResponse.json({ error: "Unauthorized: Only counselors can set availability" }, { status: 403 });
    }

    // ✅ Use authenticated user's ID as counselorId
    const userId = user.id;

    if (!date || !availableSlots.length) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const existing = await Availability.findOne({ counselorId: userId, date });

    let mergedSlots: string[] = availableSlots;
    if (existing) {
      const slotSet = new Set([...existing.availableSlots, ...availableSlots]);
      mergedSlots = Array.from(slotSet);
    }

    const updated = await Availability.findOneAndUpdate(
      { counselorId: userId, date },
      { availableSlots: mergedSlots },
      { upsert: true, new: true }
    );

    return NextResponse.json({ message: "Availability merged", availability: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}