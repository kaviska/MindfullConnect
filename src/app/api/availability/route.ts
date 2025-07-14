import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Availability from "@/models/Availability";

export async function POST(request: NextRequest) {
  await connectDB();

  try {
    const { counselorId, date, availableSlots } = await request.json();

    if (!counselorId || !date || !availableSlots?.length) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Find existing availability
    const existing = await Availability.findOne({ counselorId, date });

    let mergedSlots: string[] = availableSlots;

    if (existing) {
      // Merge without duplicates
      const slotSet = new Set([...existing.availableSlots, ...availableSlots]);
      mergedSlots = Array.from(slotSet);
    }

    const updated = await Availability.findOneAndUpdate(
      { counselorId, date },
      { availableSlots: mergedSlots },
      { upsert: true, new: true }
    );

    return NextResponse.json({ message: "Availability merged", availability: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
