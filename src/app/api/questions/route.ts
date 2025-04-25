import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Question from "@/models/Question";



export async function POST(req: NextRequest) {
  await dbConnect();
  try {
    const body = await req.json();
    const question = new Question(body);
    await question.save();
    return NextResponse.json(question, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Error creating question", error: error }, { status: 500 });
  }
}

export async function GET() {
  await dbConnect();
  try {
    const questions = await Question.find({});
    return NextResponse.json(questions);
  } catch (error) {
    return NextResponse.json({ error: "Error fetching questions" }, { status: 500 });
  }
}
