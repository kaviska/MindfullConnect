import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Counselor from "@/models/Counselor";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// Add a new patient
export async function POST(req: NextRequest) {
  await dbConnect();
  try {
    const body = await req.json();
    const patient = new Patient(body);
    await patient.save();
    return NextResponse.json(patient, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error creating patient", error: error },
      { status: 500 }
    );
  }
}

// Get all patients assigned to the counselor

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
      return NextResponse.json({ message: "Only counselors can view patients" }, { status: 403 });
    }

    // Find counselor profile with assigned patients
    const counselor = await Counselor.findOne({ userId: user._id })
      .populate('patients_ids', 'fullName email _id profileImageUrl');

    if (!counselor) {
      return NextResponse.json({ message: "Counselor profile not found" }, { status: 404 });
    }

    return NextResponse.json(counselor.patients_ids || [], { status: 200 });

  } catch (error) {
    console.error("Error fetching patients:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}