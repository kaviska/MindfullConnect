import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import PatientQuiz from "@/models/PatientQuiz";
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
    
    const patientQuiz = await PatientQuiz.findById(id)
      .populate('quizId')
      .populate('patientId', 'fullName email');

    if (!patientQuiz) {
      return NextResponse.json({ message: "Quiz assignment not found" }, { status: 404 });
    }

    // Verify the quiz belongs to the current user
    if (patientQuiz.patientId._id.toString() !== decoded.userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    // Get questions for the quiz
    const questions = await Question.find({ 
      question_group_id: patientQuiz.quizId.question_group_id 
    }).select('question options _id'); // Don't include correct_answer_index

    return NextResponse.json({
      patientQuiz,
      questions
    }, { status: 200 });

  } catch (error) {
    console.error("Error fetching quiz details:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await dbConnect();
  
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Authentication required" }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const { action, answers, timeSpent } = await req.json();
    const { id } = await params;

    const patientQuiz = await PatientQuiz.findById(id);
    if (!patientQuiz) {
      return NextResponse.json({ message: "Quiz assignment not found" }, { status: 404 });
    }

    // Verify the quiz belongs to the current user
    if (patientQuiz.patientId.toString() !== decoded.userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    if (action === 'start') {
      patientQuiz.status = 'in_progress';
      patientQuiz.startedDate = new Date();
      patientQuiz.attempts += 1;
    } else if (action === 'submit') {
      // Get correct answers to calculate score
      const questions = await Question.find({ 
        question_group_id: patientQuiz.quizId.question_group_id 
      });

      let correctAnswers = 0;
      const processedAnswers = answers.map((answer: any) => {
        const question = questions.find(q => q._id.toString() === answer.questionId);
        const isCorrect = question && question.correct_answer_index === answer.selectedOption;
        if (isCorrect) correctAnswers++;
        
        return {
          questionId: answer.questionId,
          selectedOption: answer.selectedOption,
          isCorrect,
          answeredAt: new Date()
        };
      });

      // Fix score calculation to handle NaN
      const totalQuestions = questions.length;
      const score = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

      patientQuiz.status = 'completed';
      patientQuiz.completedDate = new Date();
      patientQuiz.answers = processedAnswers;
      patientQuiz.score = score;
      patientQuiz.totalQuestions = totalQuestions;
      patientQuiz.correctAnswers = correctAnswers;
      patientQuiz.timeSpent = timeSpent || 0;
    }

    await patientQuiz.save();

    return NextResponse.json({ 
      message: "Quiz updated successfully", 
      data: patientQuiz 
    }, { status: 200 });

  } catch (error) {
    console.error("Error updating quiz:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
