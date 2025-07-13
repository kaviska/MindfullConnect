import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import PatientQuiz from "@/models/PatientQuiz";
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
    
    const patientQuiz = await PatientQuiz.findById(id)
      .populate('quizId')
      .populate('patientId', 'fullName email');

    if (!patientQuiz) {
      return NextResponse.json({ message: "Quiz result not found" }, { status: 404 });
    }

    // Verify the quiz belongs to the current user
    if (patientQuiz.patientId._id.toString() !== decoded.userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    // Only show results if quiz is completed
    if (patientQuiz.status !== 'completed') {
      return NextResponse.json({ message: "Quiz not completed yet" }, { status: 400 });
    }

    // Get questions with correct answers for result display
    const questions = await Question.find({ 
      question_group_id: patientQuiz.quizId.question_group_id 
    }).select('question options correct_answer_index _id');

    return NextResponse.json({
      result: patientQuiz,
      questions
    }, { status: 200 });

  } catch (error) {
    console.error("Error fetching quiz result:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
