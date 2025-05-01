import Question from "@/models/Question";
import QuestionGroup from "@/models/QuestionGroup";
import { NextResponse, NextRequest } from "next/server";
import dbConnect from "@/lib/mongodb";

// Add a new question group
export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const questionGroup = new QuestionGroup(body);
    await questionGroup.save();
    return NextResponse.json(questionGroup, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error creating question group", error: error },
      { status: 500 }
    );
  }
}

// Get all question groups
export async function GET() {
  try {
    await dbConnect();
    const questionGroups = await QuestionGroup.find({});
    return NextResponse.json(questionGroups, { status: 200 });
  } catch (error) {
    console.log("Errror Form Question Grop load",error)
    return NextResponse.json(
      { message: "Error fetching question groups", error: error },
      { status: 500 }
    );
  }
}