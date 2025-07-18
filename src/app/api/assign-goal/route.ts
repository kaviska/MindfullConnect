import { NextResponse } from "next/server";
import mongoose from "mongoose";
import AssignedGoal from "@/models/AssignedGoal";
import Patient from "@/models/Patient";
import Counsellor from "@/models/Counselor";
import Goals from "@/models/Goals";
import Milestone from "@/models/MileStone";
import dbConnect from "@/lib/mongodb";

// Response helper
function respond(data: object, status: number = 200) {
  return NextResponse.json(data, { status });
}

// POST method - assign a goal
export async function POST(req: Request) {
  try {
    await dbConnect();
    const { goal_id, patient_id, counsellor_id } = await req.json();

    // Basic validation
    if (!goal_id || !patient_id || !counsellor_id) {
      return respond({ message: "Missing required fields" }, 400);
    }

    // Validate ObjectId format
    if (
      !mongoose.Types.ObjectId.isValid(goal_id) ||
      !mongoose.Types.ObjectId.isValid(patient_id) ||
      !mongoose.Types.ObjectId.isValid(counsellor_id)
    ) {
      return respond({ message: "Invalid ID format" }, 400);
    }

    // Validate existence of each document
    const [goal, patient, counsellor] = await Promise.all([
      Goals.findById(goal_id),
      Patient.findById(patient_id),
      Counsellor.findById(counsellor_id),
    ]);

    if (!goal) return respond({ message: "Invalid goal_id" }, 400);
    if (!patient) return respond({ message: "Invalid patient_id" }, 400);
    if (!counsellor) return respond({ message: "Invalid counsellor_id" }, 400);

    // Check for existing assignment
    const existingAssignment = await AssignedGoal.findOne({
      goal_id,
      patient_id,
      counsellor_id,
    });

    if (existingAssignment) {
      return respond(
        { message: "Goal already assigned to this patient by this counsellor" },
        400
      );
    }

       
    if (goal.counsellor_id.toString() !== counsellor_id) {
      return respond(
        { message: "This goal was not created by the specified counsellor" },
        400
      );
    }
    
    // Get the milestones for the goal
    const milestones = await Milestone.find({ goal_id: goal._id });

    // Map milestones to include breakdown in the assigned goal
    interface MilestoneBreakdownItem {
      description: string;
      time: string;
      status: string;
    }

    interface MilestoneDocument {
      breakdown: { description: string; time: string }[];
    }

    const milestoneBreakdown: MilestoneBreakdownItem[] = milestones.flatMap(
      (milestone: MilestoneDocument) =>
      milestone.breakdown.map((item) => ({
        description: item.description,
        time: item.time,
        status: "pending",
      }))
    );

    // Create and save assignment
    const assignedGoal = new AssignedGoal({
      goal_id,
      patient_id,
      counsellor_id,
      breakdown: milestoneBreakdown,
    });

    await assignedGoal.save();

    return respond(
      { message: "Goal assigned successfully", assignedGoal },
      201
    );
  } catch (error) {
    console.error("Error assigning goal:", error);
    return respond({ message: "Internal Server Error" }, 500);
  }
}

// GET method - fetch assigned goals
export async function GET(req: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url!);
    const counsellor_id = searchParams.get("counsellor_id");
    const patient_id = searchParams.get("patient_id");

    if (!counsellor_id || !patient_id) {
      return respond({ message: "Missing required fields" }, 400);
    }

    if (
      !mongoose.Types.ObjectId.isValid(patient_id) ||
      !mongoose.Types.ObjectId.isValid(counsellor_id)
    ) {
      return respond({ message: "Invalid ID format" }, 400);
    }

    const assignedGoals = await AssignedGoal.find({
      counsellor_id,
      patient_id,
    })
      .populate("goal_id", "title description")
      .populate("patient_id", "name email")
      .populate("counsellor_id", "name email");

    if (!assignedGoals || assignedGoals.length === 0) {
      return respond({ message: "No assigned goals found" }, 404);
    }

    return respond(
      { message: "Assigned goals retrieved successfully", assignedGoals },
      200
    );
  } catch (error) {
    console.error("Error retrieving assigned goals:", error);
    return respond({ message: "Internal Server Error" }, 500);
  }
}