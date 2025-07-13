import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import PatientGoal from "@/models/PatientGoal";
import Goals from "@/models/Goals";
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
      return NextResponse.json({ message: "Only counselors can assign goals" }, { status: 403 });
    }

    const counselor = await Counselor.findOne({ userId: user._id });
    if (!counselor) {
      return NextResponse.json({ message: "Counselor profile not found" }, { status: 404 });
    }

    const { goalId, patientId, targetDate, milestones } = await req.json();

    // Validate goal exists
    const goal = await Goals.findById(goalId);
    if (!goal) {
      return NextResponse.json({ message: "Goal not found" }, { status: 404 });
    }

    // Validate patient exists
    const patient = await User.findById(patientId);
    if (!patient) {
      return NextResponse.json({ message: "Patient not found" }, { status: 404 });
    }

    // Check if already assigned
    const existingAssignment = await PatientGoal.findOne({ 
      goalId, 
      patientId, 
      status: { $in: ['assigned', 'in_progress'] } 
    });
    if (existingAssignment) {
      return NextResponse.json({ message: "Goal already assigned to this patient" }, { status: 400 });
    }

    const patientGoal = new PatientGoal({
      goalId,
      patientId,
      counsellorId: counselor._id,
      targetDate: targetDate ? new Date(targetDate) : undefined,
      milestones: milestones || []
    });

    await patientGoal.save();

    return NextResponse.json({ 
      message: "Goal assigned successfully", 
      data: patientGoal 
    }, { status: 201 });

  } catch (error) {
    console.error("Error assigning goal:", error);
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

    const patientGoals = await PatientGoal.find(query)
      .populate('goalId', 'title description')
      .populate('patientId', 'fullName email')
      .populate('counsellorId', 'specialty')
      .sort({ createdAt: -1 });

    return NextResponse.json(patientGoals, { status: 200 });

  } catch (error) {
    console.error("Error fetching patient goals:", error);
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

    const { patientGoalId, status, progress, milestoneId, note } = await req.json();

    const patientGoal = await PatientGoal.findById(patientGoalId);
    if (!patientGoal) {
      return NextResponse.json({ message: "Patient goal not found" }, { status: 404 });
    }

    // Update status and progress
    if (status) patientGoal.status = status;
    if (progress !== undefined) patientGoal.progress = progress;
    if (status === 'completed') patientGoal.completedDate = new Date();

    // Update milestone
    if (milestoneId) {
      const milestone = patientGoal.milestones.id(milestoneId);
      if (milestone) {
        milestone.status = 'completed';
        milestone.completedDate = new Date();
      }
    }

    // Add note
    if (note) {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
      patientGoal.notes.push({
        content: note,
        addedBy: decoded.userId,
        addedAt: new Date()
      });
    }

    await patientGoal.save();

    return NextResponse.json({ 
      message: "Patient goal updated successfully", 
      data: patientGoal 
    }, { status: 200 });

  } catch (error) {
    console.error("Error updating patient goal:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
