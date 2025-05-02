import { NextResponse } from "next/server";
import AssignedQuiz from "@/models/AssignedQuiz";
import Quiz from "@/models/Quiz";
import Question from "@/models/Question";
import dbConnect from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { quiz_id, patient_id, counsellor_id } = await req.json();

    if (!quiz_id || !patient_id || !counsellor_id) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Fetch the quiz and its associated questions
    const quiz = await Quiz.findById(quiz_id).populate("question_group_id");
    if (!quiz) {
      return NextResponse.json(
        { message: "Quiz not found" },
        { status: 404 }
      );
    }

    // Fetch questions associated with the quiz's question group
    const questions = await Question.find({
      question_group_id: quiz.question_group_id,
    });

    // Map questions to the format required by the AssignedQuiz model
    const formattedQuestions = questions.map((q) => ({
      question: q.question,
      choices: q.options,
      correctAnswer: q.options[q.correct_answer_index],
    }));

    // Create the assigned quiz with populated questions
    const assignedQuiz = new AssignedQuiz({
      quiz_id,
      patient_id,
      counsellor_id,
      questions: formattedQuestions,
    });

    await assignedQuiz.save();

    return NextResponse.json(
      { message: "Quiz assigned successfully", assignedQuiz },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error assigning quiz:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url!);
    const counsellor_id = searchParams.get("counsellor_id");
    const patient_id = searchParams.get("patient_id");

    if (!counsellor_id && !patient_id) {
      return NextResponse.json(
        { message: "Missing required fields: counsellor_id or patient_id" },
        { status: 400 }
      );
    }

    const query: any = {};
    if (counsellor_id) query.counsellor_id = counsellor_id;
    if (patient_id) query.patient_id = patient_id;

    const assignedQuizzes = await AssignedQuiz.find(query)
      .populate("quiz_id", "title description")
      .populate("patient_id", "name email")
      .populate("counsellor_id", "name email");

    if (!assignedQuizzes || assignedQuizzes.length === 0) {
      return NextResponse.json(
        { message: "No assigned quizzes found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Assigned quizzes retrieved successfully", assignedQuizzes },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error retrieving assigned quizzes:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}