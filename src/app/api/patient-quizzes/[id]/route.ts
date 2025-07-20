import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import PatientQuiz from "@/models/PatientQuiz";
import Quiz from "@/models/Quiz";
import Question from "@/models/Question";
import User from "@/models/User";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// Helper function to verify token and get user
const verifyToken = async (req: NextRequest) => {
  const token = req.cookies.get("token")?.value;
  if (!token) {
    throw new Error("Authentication required");
  }

  const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
  const user = await User.findById(decoded.userId);
  if (!user) {
    throw new Error("User not found");
  }

  return { user, userId: decoded.userId };
};

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const { user, userId } = await verifyToken(request);

    const patientQuiz = await PatientQuiz.findById(params.id)
      .populate({
        path: 'quizId',
        select: 'title description question_group_id'
      });

    if (!patientQuiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    // Check if user has access to this quiz
    if (user.role === "patient" && patientQuiz.patientId.toString() !== userId) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    if (user.role === "counselor" && patientQuiz.counsellorId.toString() !== userId) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Get questions for the quiz
    const questions = await Question.find({
      question_group_id: patientQuiz.quizId.question_group_id
    }).select('_id question options');

    return NextResponse.json({
      patientQuiz,
      questions
    });

  } catch (error) {
    console.error("Error fetching patient quiz:", error);
    if (error instanceof Error && error.message === "Authentication required") {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const { user, userId } = await verifyToken(request);

    const body = await request.json();
    const { action, answers, timeSpent } = body;

    const patientQuiz = await PatientQuiz.findById(params.id)
      .populate({
        path: 'quizId',
        select: 'question_group_id'
      });

    if (!patientQuiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    // Check if user has access to this quiz
    if (user.role === "patient" && patientQuiz.patientId.toString() !== userId) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    if (action === "start") {
      patientQuiz.status = "in-progress";
      patientQuiz.startedAt = new Date();
      await patientQuiz.save();

      return NextResponse.json({ message: "Quiz started successfully" });
    }

    if (action === "submit") {
      // Get questions to calculate score
      const questions = await Question.find({
        question_group_id: patientQuiz.quizId.question_group_id
      });

      let score = 0;
      answers.forEach((answer: any) => {
        const question = questions.find(q => q._id.toString() === answer.questionId);
        if (question && question.correct_answer_index === answer.selectedOption) {
          score++;
        }
      });

      // Update patient quiz
      patientQuiz.status = "completed";
      patientQuiz.answers = answers;
      patientQuiz.score = score;
      patientQuiz.totalQuestions = questions.length;
      patientQuiz.timeSpent = timeSpent;
      patientQuiz.completedAt = new Date();
      patientQuiz.attempts += 1;

      await patientQuiz.save();

      return NextResponse.json({
        message: "Quiz submitted successfully",
        score,
        totalQuestions: questions.length
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });

  } catch (error) {
    console.error("Error updating patient quiz:", error);
    if (error instanceof Error && error.message === "Authentication required") {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
