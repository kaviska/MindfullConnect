import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
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

// Get all patients
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

    // Get all users with role 'User' (patients)
    const patients = await User.find({ 
      role: { $in: ['User', 'user'] } 
    }).select('fullName email _id').sort({ fullName: 1 });

    return NextResponse.json(patients, { status: 200 });

  } catch (error) {
    console.error("Error fetching patients:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}