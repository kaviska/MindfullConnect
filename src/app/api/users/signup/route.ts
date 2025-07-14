import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";

// Ensure MongoDB connection
connect().catch(err => console.error("MongoDB connection error:", err));

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { email, password, fullName, role } = reqBody;

    console.log("Request body:", reqBody);

    // Validate required fields
    if (!email || !password || !fullName) {
      return NextResponse.json(
        { error: "Email, password, and full name are required." },
        { status: 400 }
      );
    }

    // Check if user already exists by email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Hash the password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // Create and save the user
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      role: role || "User",
      isVerified: false,
      lastSeen: new Date()
    });

    const savedUser = await newUser.save();

    console.log("Saved user:", savedUser);

    return NextResponse.json(
      {
        message: "User created successfully",
        success: true,
        user: {
          id: savedUser._id,
          email: savedUser.email,
          fullName: savedUser.fullName,
          role: savedUser.role
        }
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}