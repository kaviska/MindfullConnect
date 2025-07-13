import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Quiz from "@/models/Quiz";
import Question from "@/models/Question";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await dbConnect();
  
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Authentication required" }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const { id } = await params;
    
    // Get the quiz
    const quiz = await Quiz.findById(id);
    if (!quiz) {
      return NextResponse.json({ message: "Quiz not found" }, { status: 404 });
    }

    // Get questions for the quiz with correct answers (only for counselors)
    const questions = await Question.find({ 
      question_group_id: quiz.question_group_id 
    }).select('question options correct_answer_index _id');

    return NextResponse.json(questions, { status: 200 });

  } catch (error) {
    console.error("Error fetching quiz questions:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
