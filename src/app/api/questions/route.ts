import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Question from "@/models/Question";
import { createNotification } from "@/utility/backend/notificationService";
import jwt from "jsonwebtoken";


function respond(data: object, status: number = 200) {
  return NextResponse.json(data, { status });
}
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// Create a new question
export async function POST(req: NextRequest) {
  await dbConnect();


  try {
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
              return NextResponse.json(
                { message: "Invalid token" },
                { status: 401 }
              );
            }
    const body = await req.json();
    const { question, options, correct_answer_index, question_group_id } = body;

    // Validation
    if (
      !question ||
      typeof question !== "string" ||
      question.trim().length < 5
    ) {
      return respond(
        { message: "Question must be a non-empty string with at least 5 characters" },
        400
      );
    }

    if (!Array.isArray(options) || options.length < 2) {
      return respond(
        { message: "Options must be an array with at least 2 items" },
        400
      );
    }

    if (
      typeof correct_answer_index !== "number" ||
      correct_answer_index < 0 ||
      correct_answer_index >= options.length
    ) {
      return respond(
        { message: "Correct answer index must be a valid index of the options array" },
        400
      );
    }

    if (!question_group_id) {
      return respond(
        { message: "Question group ID is required" },
        400
      );
    }

    
    const notification = await createNotification({
      type: "question_created",
      message: `New Question created`,
      user_id: decoded.userId,
    });

    const questionDoc = new Question(body);
    await questionDoc.save();
    
    return respond(questionDoc, 201);
  } catch (error) {
    console.error("Error creating question:", error);
    return respond({ message: "Internal Server Error" }, 500);
  }
}

// Get all questions
export async function GET() {
  await dbConnect();
  try {
    const questions = await Question.find({});
    return respond(questions);
  } catch (error) {
    console.error("Error fetching questions:", error);
    return respond({ message: "Error fetching questions" }, 500);
  }
}

// Update a question
export async function PUT(req: NextRequest) {
  await dbConnect();
  try {
    const body = await req.json();
    const { id, question, options, correct_answer_index, question_group_id } = body;

    // Validation
    if (!id) {
      return respond({ message: "Question ID is required" }, 400);
    }

    if (
      question &&
      (typeof question !== "string" || question.trim().length < 5)
    ) {
      return respond(
        { message: "Question must be a non-empty string with at least 5 characters" },
        400
      );
    }

    if (options && (!Array.isArray(options) || options.length < 2)) {
      return respond(
        { message: "Options must be an array with at least 2 items" },
        400
      );
    }

    if (
      correct_answer_index !== undefined &&
      (typeof correct_answer_index !== "number" ||
        correct_answer_index < 0 ||
        (options && correct_answer_index >= options.length))
    ) {
      return respond(
        { message: "Correct answer index must be a valid index of the options array" },
        400
      );
    }

    const updatedQuestion = await Question.findByIdAndUpdate(
      id,
      { question, options, correct_answer_index, question_group_id },
      { new: true }
    );

    if (!updatedQuestion) {
      return respond({ message: "Question not found" }, 404);
    }

    return respond(
      { message: "Question updated successfully", data: updatedQuestion },
      200
    );
  } catch (error) {
    console.error("Error updating question:", error);
    return respond({ message: "Internal Server Error" }, 500);
  }
}

// Delete a question
export async function DELETE(req: NextRequest) {
  await dbConnect();
  try {
    const { searchParams } = new URL(req.url!);
    const id = searchParams.get("id");

    if (!id) {
      return respond({ message: "Question ID is required for deletion" }, 400);
    }

    const deletedQuestion = await Question.findByIdAndDelete(id);

    if (!deletedQuestion) {
      return respond({ message: "Question not found" }, 404);
    }

    return respond(
      { message: "Question deleted successfully", data: deletedQuestion },
      200
    );
  } catch (error) {
    console.error("Error deleting question:", error);
    return respond({ message: "Internal Server Error" }, 500);
  }
}