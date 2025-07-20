import Question from "@/models/Question";
import QuestionGroup from "@/models/QuestionGroup";
import { NextResponse, NextRequest } from "next/server";
import dbConnect from "@/lib/mongodb";
import { createNotification } from "@/utility/backend/notificationService";
import jwt from "jsonwebtoken";
 

function respond(data: object, status: number = 200) {
  return NextResponse.json(data, { status });
}
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";


// Add a new question group
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
          return NextResponse.json(
            { message: "Invalid token" },
            { status: 401 }
          );
        }
    const body = await req.json();
    const { title } = body;

    if (!title || typeof title !== "string" || title.trim().length < 2) {
      return respond(
        { message: "Title must be a non-empty string with at least 2 characters" },
        400
      );
    }

    const existing = await QuestionGroup.findOne({ title: title.trim() });
    if (existing) {
      return respond(
        { message: "Question group already exists" },
        400
      );
    }

    const questionGroup = new QuestionGroup({ title: title.trim() });
    await questionGroup.save();

      const notification = await createNotification({
        type: "question_group",
        message: `New question group created: ${title}`,
        user_id: decoded.userId,
        });

    return respond(
      { message: "Question group created successfully", data: questionGroup },
      201
    );
  } catch (error) {
    console.error("Error creating question group:", error);
    return respond(
      { message: "Internal Server Error" },
      500
    );
  }
}

// Get all question groups
export async function GET() {
  try {
    await dbConnect();
    const questionGroups = await QuestionGroup.find({});
    return respond(questionGroups, 200);
  } catch (error) {
    console.log("Error fetching question groups:", error);
    return respond(
      { message: "Error fetching question groups", error: error },
      500
    );
  }
}

// Update a question group
export async function PUT(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const { id, title } = body;

    if (!id || !title || typeof title !== "string" || title.trim().length < 2) {
      return respond(
        { message: "Invalid ID or title. Title must be a non-empty string with at least 2 characters" },
        400
      );
    }

    const updatedGroup = await QuestionGroup.findByIdAndUpdate(
      id,
      { title: title.trim() },
      { new: true }
    );

    if (!updatedGroup) {
      return respond(
        { message: "Question group not found" },
        404
      );
    }

    return respond(
      { message: "Question group updated successfully", data: updatedGroup },
      200
    );
  } catch (error) {
    console.error("Error updating question group:", error);
    return respond(
      { message: "Internal Server Error" },
      500
    );
  }
}

// Delete a question group
export async function DELETE(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url!);
    const id = searchParams.get("id");

    if (!id) {
      return respond(
        { message: "ID is required for deletion" },
        400
      );
    }

    const deletedGroup = await QuestionGroup.findByIdAndDelete(id);

    if (!deletedGroup) {
      return respond(
        { message: "Question group not found" },
        404
      );
    }

    return respond(
      { message: "Question group deleted successfully", data: deletedGroup },
      200
    );
  } catch (error) {
    console.error("Error deleting question group:", error);
    return respond(
      { message: "Internal Server Error" },
      500
    );
  }
}