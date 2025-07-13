import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Counselor from "@/models/Counselor";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

export async function POST(req: NextRequest) {
  await dbConnect();

  try {
   
    const { counsellorUserId, patientUserId } = await req.json();

    if (!counsellorUserId || !patientUserId) {
      return NextResponse.json({ message: "Both counselor and patient user IDs are required" }, { status: 400 });
    }

    // Verify counselor user exists and is a counselor
    const counselorUser = await User.findById(counsellorUserId);
    if (!counselorUser || counselorUser.role !== "counselor") {
      return NextResponse.json({ message: "Counselor user not found or invalid role" }, { status: 404 });
    }

    // Verify patient exists and is a user
    const patient = await User.findById(patientUserId);
    if (!patient || !['User', 'user'].includes(patient.role)) {
      return NextResponse.json({ message: "Patient not found or invalid role" }, { status: 404 });
    }

    // Find counselor profile
    const counselor = await Counselor.findOne({ userId: counsellorUserId });
    if (!counselor) {
      return NextResponse.json({ message: "Counselor profile not found" }, { status: 404 });
    }

    // // Check if patient is already assigned
    // if (counselor.patients_ids.includes(patientUserId)) {
    //   return NextResponse.json({ message: "Patient is already assigned to this counselor" }, { status: 400 });
    // }

    // Add patient to counselor's patients_ids array
    if (!Array.isArray(counselor.patients_ids)) {
      counselor.patients_ids = [];
    }
    counselor.patients_ids.push(patientUserId);
    await counselor.save();

    return NextResponse.json({ 
      message: "Patient assigned successfully",
      counselorId: counselor._id,
      counselorUserId: counsellorUserId,
      patientUserId: patientUserId
    }, { status: 200 });

  } catch (error) {
    console.error("Error assigning patient:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  await dbConnect();

  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Authentication required" }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const user = await User.findById(decoded.userId);

    if (!user || user.role !== "counselor") {
      return NextResponse.json({ message: "Only counselors can unassign patients" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const counsellorUserId = searchParams.get("counsellorUserId");
    const patientUserId = searchParams.get("patientUserId");

    if (!counsellorUserId || !patientUserId) {
      return NextResponse.json({ message: "Both counselor and patient user IDs are required" }, { status: 400 });
    }

    // Find counselor profile
    const counselor = await Counselor.findOne({ userId: counsellorUserId });
    if (!counselor) {
      return NextResponse.json({ message: "Counselor profile not found" }, { status: 404 });
    }

    // Remove patient from counselor's patients_ids array
    counselor.patients_ids = counselor.patients_ids.filter(id => id.toString() !== patientUserId);
    await counselor.save();

    return NextResponse.json({ 
      message: "Patient unassigned successfully",
      counselorId: counselor._id,
      counselorUserId: counsellorUserId,
      patientUserId: patientUserId
    }, { status: 200 });

  } catch (error) {
    console.error("Error unassigning patient:", error);
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

    if (!user || user.role !== "counselor") {
      return NextResponse.json({ message: "Only counselors can view assigned patients" }, { status: 403 });
    }

    // Find counselor profile
    const counselor = await Counselor.findOne({ userId: user._id }).populate('patients_ids', 'fullName email _id');
    if (!counselor) {
      return NextResponse.json({ message: "Counselor profile not found" }, { status: 404 });
    }

    return NextResponse.json({ 
      assignedPatients: counselor.patients_ids,
      totalCount: counselor.patients_ids.length
    }, { status: 200 });

  } catch (error) {
    console.error("Error fetching assigned patients:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
