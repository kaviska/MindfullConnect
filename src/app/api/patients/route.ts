import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Patient from "@/models/Patient";

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
export async function GET() {
  await dbConnect();
  try {
    const patients = await Patient.find({});
    return NextResponse.json(patients);
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching patients" },
      { status: 500 }
    );
  }
}