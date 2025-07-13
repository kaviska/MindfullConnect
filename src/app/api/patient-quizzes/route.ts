import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import PatientQuiz from "@/models/PatientQuiz";
import Quiz from "@/models/Quiz";
import User from "@/models/User";
import Counselor from "@/models/Counselor";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

export async function POST(req: NextRequest) {
  await dbConnect();
  
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Authentication required" }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    
    const user = await User.findById(decoded.userId);
    if (!user || user.role !== "counselor") {
      return NextResponse.json({ message: "Only counselors can assign quizzes" }, { status: 403 });
    }

    const counselor = await Counselor.findOne({ userId: user._id });
    if (!counselor) {
      return NextResponse.json({ message: "Counselor profile not found" }, { status: 404 });
    }

    const { quizId, patientId, dueDate, maxAttempts } = await req.json();

    // Validate quiz exists
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return NextResponse.json({ message: "Quiz not found" }, { status: 404 });
    }

    // Validate patient exists
    const patient = await User.findById(patientId);
    if (!patient) {
      return NextResponse.json({ message: "Patient not found" }, { status: 404 });
    }

    // Check if already assigned
    const existingAssignment = await PatientQuiz.findOne({ 
      quizId, 
      patientId, 
      status: { $in: ['assigned', 'in_progress'] } 
    });
    if (existingAssignment) {
      return NextResponse.json({ message: "Quiz already assigned to this patient" }, { status: 400 });
    }

    const patientQuiz = new PatientQuiz({
      quizId,
      patientId,
      counsellorId: counselor._id,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      maxAttempts: maxAttempts || 3
    });

    await patientQuiz.save();

    return NextResponse.json({ 
      message: "Quiz assigned successfully", 
      data: patientQuiz 
    }, { status: 201 });

  } catch (error) {
    console.error("Error assigning quiz:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  await dbConnect();
  
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Authentication required" }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const user = await User.findById(decoded.userId);
    
    let query = {};
    
    if (user?.role === "counselor") {
      const counselor = await Counselor.findOne({ userId: user._id });
      query = { counsellorId: counselor?._id };
    } else {
      query = { patientId: decoded.userId };
    }

    const patientQuizzes = await PatientQuiz.find(query)
      .populate('quizId', 'title description')
      .populate('patientId', 'fullName email')
      .populate('counsellorId', 'name specialty')
      .sort({ createdAt: -1 });

    return NextResponse.json(patientQuizzes, { status: 200 });

  } catch (error) {
    console.error("Error fetching patient quizzes:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  await dbConnect();
  
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Authentication required" }, { status: 401 });
    }

    const { patientQuizId, status, answers, timeSpent, totalQuestions } = await req.json();

    const patientQuiz = await PatientQuiz.findById(patientQuizId);
    if (!patientQuiz) {
      return NextResponse.json({ message: "Patient quiz not found" }, { status: 404 });
    }

    // Update status
    if (status) {
      patientQuiz.status = status;
      if (status === 'in_progress' && !patientQuiz.startedDate) {
        patientQuiz.startedDate = new Date();
      }
      if (status === 'completed') {
        patientQuiz.completedDate = new Date();
        patientQuiz.attempts += 1;
      }
    }

    // Update total questions
    if (totalQuestions !== undefined) {
      patientQuiz.totalQuestions = totalQuestions;
    }

    // Update answers and calculate score
    if (answers && answers.length > 0) {
      patientQuiz.answers = answers;
      
      // Calculate score
      const correctAnswers = answers.filter((answer: any) => answer.isCorrect).length;
      patientQuiz.correctAnswers = correctAnswers;
      const total = patientQuiz.totalQuestions || answers.length;
      patientQuiz.score = total > 0 ? Math.round((correctAnswers / total) * 100) : 0;
    }

    // Update time spent
    if (timeSpent !== undefined) {
      patientQuiz.timeSpent = timeSpent;
    }

    await patientQuiz.save();

    return NextResponse.json({ 
      message: "Patient quiz updated successfully", 
      data: patientQuiz 
    }, { status: 200 });

  } catch (error) {
    console.error("Error updating patient quiz:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
