import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Counsellor from "@/models/Counselor";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  await dbConnect();

  const url = new URL(request.url);
  const counsellorId = url.pathname.split("/").pop(); // extract the [id] from URL

  if (!counsellorId) {
    return NextResponse.json({ error: "Counsellor ID is required" }, { status: 400 });
  }

  try {
    const counsellor = await Counsellor.findById(counsellorId).populate("patients_ids").exec();

    if (!counsellor) {
      return NextResponse.json({ error: "Counsellor not found" }, { status: 404 });
    }

    return NextResponse.json(counsellor.patients_ids, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching patients for the counsellor", details: error instanceof Error ? error.message : error },
      { status: 500 }
    );
  }
}
