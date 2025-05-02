import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Question from "@/models/Question";
import QuestionGroup from "@/models/QuestionGroup";

function respond(data: object, status: number = 200) {
  return NextResponse.json(data, { status });
}

// Add a new question
export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const { question, answers, correctAnswerIndex, selectedQuestionGroup } = body;

    // Validate required fields
    if (!question || !answers || correctAnswerIndex === undefined || !selectedQuestionGroup) {
      return respond({ message: "Missing required fields" }, 400);
    }

    // Validate question
    if (typeof question !== "string" || question.trim().length < 2) {
      return respond(
        { message: "Question must be a non-empty string with at least 2 characters" },
        400
      );
    }

    // Validate answers
    if (!Array.isArray(answers) || answers.length < 2) {
      return respond(
        { message: "Answers must be an array with at least 2 items" },
        400
      );
    }

    // Validate correct answer index
    if (correctAnswerIndex < 0 || correctAnswerIndex >= answers.length) {
      return respond({ message: "Invalid correct answer index" }, 400);
    }

    // Validate question group
    if (!selectedQuestionGroup || typeof selectedQuestionGroup !== "string") {
      return respond({ message: "Invalid question group" }, 400);
    }

    // Check if the question already exists
    const existingQuestion = await Question.findOne({ question: question.trim() });
    if (existingQuestion) {
      return respond({ message: "Question already exists" }, 400);
    }

    // Check if the question group exists
    const questionGroup = await QuestionGroup.findById(selectedQuestionGroup);
    if (!questionGroup) {
      return respond({ message: "Invalid question group ID" }, 400);
    }

    // Create and save the question
    const newQuestion = new Question({
      question: question.trim(),
      options: answers,
      correct_answer_index: correctAnswerIndex,
      question_group_id: selectedQuestionGroup,
    });
    await newQuestion.save();

    return respond(
      { message: "Question created successfully", data: newQuestion },
      201
    );
  } catch (error) {
    console.error("Error creating question:", error);
    return respond(
      { message: "Internal Server Error" },
      500
    );
  }
}

// Get all questions
export async function GET() {
  try {
    await dbConnect();
    const questions = await Question.find({});
    return respond(questions, 200);
  } catch (error) {
    console.error("Error fetching questions:", error);
    return respond(
      { message: "Error fetching questions" },
      500
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const { id, question, answers, correctAnswerIndex, selectedQuestionGroup } = body;

    // Validate required fields
    if (!id) {
      return respond({ message: "Question ID is required" }, 400);
    }

    // Validate question
    if (question && (typeof question !== "string" || question.trim().length < 2)) {
      return respond(
        { message: "Question must be a non-empty string with at least 2 characters" },
        400
      );
    }

    // Validate answers
    if (answers && (!Array.isArray(answers) || answers.length < 2)) {
      return respond(
        { message: "Answers must be an array with at least 2 items" },
        400
      );
    }

    // Validate correct answer index
    if (
      correctAnswerIndex !== undefined &&
      (correctAnswerIndex < 0 || (answers && correctAnswerIndex >= answers.length))
    ) {
      return respond({ message: "Invalid correct answer index" }, 400);
    }

    // Validate question group
    if (selectedQuestionGroup && typeof selectedQuestionGroup !== "string") {
      return respond({ message: "Invalid question group" }, 400);
    }

    // Check if the question exists
    const existingQuestion = await Question.findById(id);
    if (!existingQuestion) {
      return respond({ message: "Question not found" }, 404);
    }

    // Check if the question group exists (if provided)
    if (selectedQuestionGroup) {
      const questionGroup = await QuestionGroup.findById(selectedQuestionGroup);
      if (!questionGroup) {
        return respond({ message: "Invalid question group ID" }, 400);
      }
    }

    // Update the question
    if (question) existingQuestion.question = question.trim();
    if (answers) existingQuestion.options = answers;
    if (correctAnswerIndex !== undefined) existingQuestion.correct_answer_index = correctAnswerIndex;
    if (selectedQuestionGroup) existingQuestion.question_group_id = selectedQuestionGroup;

    await existingQuestion.save();

    return respond(
      { message: "Question updated successfully", data: existingQuestion },
      200
    );
  } catch (error) {
    console.error("Error updating question:", error);
    return respond(
      { message: "Internal Server Error" },
      500
    );
  }
}

// Delete a question
export async function DELETE(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    // Validate required fields
    if (!id) {
      return respond({ message: "Question ID is required" }, 400);
    }

    // Check if the question exists
    const existingQuestion = await Question.findById(id);
    if (!existingQuestion) {
      return respond({ message: "Question not found" }, 404);
    }

    // Delete the question
    await Question.findByIdAndDelete(id);

    return respond(
      { message: "Question deleted successfully" },
      200
    );
  } catch (error) {
    console.error("Error deleting question:", error);
    return respond(
      { message: "Internal Server Error" },
      500
    );
  }
}