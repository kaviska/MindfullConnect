import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Counsellor from "@/models/Counsellor";

// Add a new counsellor
export async function POST(req: NextRequest) {
  await dbConnect();
  try {
    const body = await req.json();
    const counsellor = new Counsellor(body);
    await counsellor.save();
    return NextResponse.json(counsellor, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error creating counsellor", error: error },
      { status: 500 }
    );
  }
}

// Get all counsellors
export async function GET(req: NextRequest) {
  await dbConnect();
  try {
    const { searchParams } = new URL(req.url);
    const counsellorId = searchParams.get("id");

    console.log(await Counsellor.findById(counsellorId));

    let counsellors;
    if (counsellorId) {
      counsellors = await Counsellor.findById(counsellorId).populate("patients_ids");
      if (!counsellors) {
        return NextResponse.json(
          { error: "Counsellor not found" },
          { status: 404 }
        );
      }
    } else {
      counsellors = await Counsellor.find({}).populate("patients_ids");
    }

    return NextResponse.json(counsellors);
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { error: "Error fetching counsellors" },
      { status: 500 }
    );
  }
}