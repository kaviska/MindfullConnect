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
export async function GET() {
  await dbConnect();
  try {
    //if request has counsellor_id, filter by that id
    
    const counsellors = await Counsellor.find({});
    return NextResponse.json(counsellors);
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching counsellors" },
      { status: 500 }
    );
  }
}