import Quiz from "@/models/Quiz";
import QuestionGroup from "@/models/QuestionGroup";
import Question from "@/models/Question";
import { NextResponse, NextRequest } from "next/server";
import dbConnect from "@/lib/mongodb";

function respond(data: object, status: number = 200) {
  return NextResponse.json(data, { status });
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const { title, questionGroupId, questionIds } = body;

    // Validate required fields
    if (!title || typeof title !== "string" || title.trim().length < 2) {
      return respond(
        {
          message:
            "Title must be a non-empty string with at least 2 characters",
        },
        400
      );
    }

    if (!questionGroupId || typeof questionGroupId !== "string") {
      return respond({ message: "A valid Question Group ID is required" }, 400);
    }

    if (!Array.isArray(questionIds) || questionIds.length === 0) {
      return respond(
        { message: "At least one valid Question ID is required" },
        400
      );
    }

    // Validate Question Group
    const questionGroup = await QuestionGroup.findById(questionGroupId);
    if (!questionGroup) {
      return respond({ message: "Invalid Question Group ID" }, 400);
    }

    // Validate Questions
    const questions = await Question.find({ _id: { $in: questionIds } });
    if (questions.length !== questionIds.length) {
      return respond(
        { message: "Some Question IDs are invalid or do not exist" },
        400
      );
    }

    // Create and save the Quiz
    const quiz = new Quiz({
      title: title.trim(),
      question_group_id: questionGroupId,
      questions: questionIds,
    });
    await quiz.save();

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
    const quizzes = await Quiz.find({});
    return respond(quizzes, 200);
  } catch (error) {
    return respond({ message: "Error fetching quizzes", error: error }, 500);
  }
}

// Update a quiz
export async function PUT(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const { id, title, questionGroupId, questionIds } = body;

    // Validate required fields
    if (!id) {
      return respond({ message: "Quiz ID is required" }, 400);
    }

    if (title && (typeof title !== "string" || title.trim().length < 2)) {
      return respond(
        {
          message:
            "Title must be a non-empty string with at least 2 characters",
        },
        400
      );
    }

    if (questionGroupId && typeof questionGroupId !== "string") {
      return respond({ message: "A valid Question Group ID is required" }, 400);
    }

    if (
      questionIds &&
      (!Array.isArray(questionIds) || questionIds.length === 0)
    ) {
      return respond(
        { message: "At least one valid Question ID is required" },
        400
      );
    }

    // Validate Quiz existence
    const quiz = await Quiz.findById(id);
    if (!quiz) {
      return respond({ message: "Quiz not found" }, 404);
    }

    // Validate Question Group if provided
    if (questionGroupId) {
      const questionGroup = await QuestionGroup.findById(questionGroupId);
      if (!questionGroup) {
        return respond({ message: "Invalid Question Group ID" }, 400);
      }
    }

    // Validate Questions if provided
    if (questionIds) {
      const questions = await Question.find({ _id: { $in: questionIds } });
      if (questions.length !== questionIds.length) {
        return respond(
          { message: "Some Question IDs are invalid or do not exist" },
          400
        );
      }
    }

    // Update the Quiz
    if (title) quiz.title = title.trim();
    if (questionGroupId) quiz.question_group_id = questionGroupId;
    if (questionIds) quiz.questions = questionIds;

    await quiz.save();

    return respond({ message: "Quiz updated successfully", data: quiz }, 200);
  } catch (error) {
    console.error("Error updating quiz:", error);
    return respond({ message: "Internal Server Error" }, 500);
  }
}

// Delete a quiz
export async function DELETE(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    // Validate required fields
    if (!id) {
      return respond({ message: "Quiz ID is required" }, 400);
    }

    // Validate Quiz existence
    const quiz = await Quiz.findById(id);
    if (!quiz) {
      return respond({ message: "Quiz not found" }, 404);
    }

    // Delete the Quiz
    await Quiz.findByIdAndDelete(id);

    return respond({ message: "Quiz deleted successfully" }, 200);
  } catch (error) {
    console.error("Error deleting quiz:", error);
    return respond({ message: "Internal Server Error" }, 500);
  }
}
