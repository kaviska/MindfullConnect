import Quiz from "@/models/Quiz";
import QuestionGroup from "@/models/QuestionGroup";
import { NextResponse, NextRequest } from "next/server";
import dbConnect from "@/lib/mongodb";
import { createNotification } from "@/utility/backend/notificationService";
import jwt from "jsonwebtoken";
import { decode } from "punycode";


function respond(data: object, status: number = 200) {
  return NextResponse.json(data, { status });
}
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// Add a new quiz
export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    // Get JWT token from cookies
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 }
      );
    }

    // Verify JWT token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    } catch (error) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }
    const body = await req.json();
    const { title, description, question_group_id } = body;

    // Validation
    if (!title || typeof title !== "string" || title.trim().length < 3) {
      return respond(
        {
          message:
            "Title must be a non-empty string with at least 3 characters",
        },
        400
      );
    }

    if (
      !description ||
      typeof description !== "string" ||
      description.trim().length < 5
    ) {
      return respond(
        {
          message:
            "Description must be a non-empty string with at least 5 characters",
        },
        400
      );
    }

    if (!question_group_id) {
      return respond({ message: "Question group ID is required" }, 400);
    }

    const quiz = new Quiz({
      title: title.trim(),
      description: description.trim(),
      question_group_id,
      counsellor_id: decoded.userId,
    });
    await quiz.save();
     const notification = await createNotification({
          type: "quiz",
          message: `New quiz created`,
          user_id:  decoded.userId, // Replace with actual user ID
          });

    return respond({ message: "Quiz created successfully", data: quiz }, 201);
  } catch (error) {
    console.error("Error creating quiz:", error);
    return respond({ message: "Internal Server Error" }, 500);
  }
}

// Get all quizzes
export async function GET() {
  try {
    await dbConnect();
    const quizzes = await Quiz.find();
    return respond(quizzes, 200);
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    return respond({ message: "Error fetching quizzes" }, 500);
  }
}

// Update a quiz
export async function PUT(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const { id, title, description, question_group_id } = body;

    // Validation
    if (!id) {
      return respond({ message: "Quiz ID is required" }, 400);
    }

    if (title && (typeof title !== "string" || title.trim().length < 3)) {
      return respond(
        {
          message:
            "Title must be a non-empty string with at least 3 characters",
        },
        400
      );
    }

    if (
      description &&
      (typeof description !== "string" || description.trim().length < 5)
    ) {
      return respond(
        {
          message:
            "Description must be a non-empty string with at least 5 characters",
        },
        400
      );
    }

    const updatedQuiz = await Quiz.findByIdAndUpdate(
      id,
      {
        title: title?.trim(),
        description: description?.trim(),
        question_group_id,
      },
      { new: true }
    );

    if (!updatedQuiz) {
      return respond({ message: "Quiz not found" }, 404);
    }

    return respond(
      { message: "Quiz updated successfully", data: updatedQuiz },
      200
    );
  } catch (error) {
    console.error("Error updating quiz:", error);
    return respond({ message: "Internal Server Error" }, 500);
  }
}

// Delete a quiz
export async function DELETE(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url!);
    const id = searchParams.get("id");

    if (!id) {
      return respond({ message: "Quiz ID is required for deletion" }, 400);
    }

    const deletedQuiz = await Quiz.findByIdAndDelete(id);

    if (!deletedQuiz) {
      return respond({ message: "Quiz not found" }, 404);
    }

    return respond(
      { message: "Quiz deleted successfully", data: deletedQuiz },
      200
    );
  } catch (error) {
    console.error("Error deleting quiz:", error);
    return respond({ message: "Internal Server Error" }, 500);
  }
}
