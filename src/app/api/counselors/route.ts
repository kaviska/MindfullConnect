import connectDB from "@/lib/db";
import Availability from "@/models/Availability";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  await connectDB();

  try {
    const date = request.nextUrl.searchParams.get("date");

    if (!date) {
      return NextResponse.json({ error: "Date is required" }, { status: 400 });
    }

    // Step 1: Get all counselors
    const counselors = await User.find({ role: "counselor" });

    if (!counselors.length) {
      return NextResponse.json({ counselors: [] }); // no counselors
    }

    // Step 2: Get availability for those counselors on the selected date
    const counselorIds = counselors.map((c) => c._id);
    const availableOnDate = await Availability.find({
      counselorId: { $in: counselorIds },
      date,
    });

    // Step 3: Filter only those counselors who have availability
    const availableCounselorIds = new Set(
      availableOnDate.map((a) => a.counselorId.toString())
    );
    const filtered = counselors.filter((c) =>
      availableCounselorIds.has(c._id.toString())
    );

    // Step 4: Return simplified counselor data
    const result = filtered.map((c) => ({
      _id: c._id,
      name: c.fullName,
      email: c.email,
      description: "Experienced counselor ready to help you grow.", // placeholder
      rating: 4.8, // static or dynamic later
      reviews: 64, // static or dynamic later

      profileImageUrl: c.profileImageUrl,
      specialty: "General Counseling", // optional placeholder
    }));

    return NextResponse.json({ counselors: result });
  } catch (error: any) {
    console.error("Error fetching counselors:", error.message);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
