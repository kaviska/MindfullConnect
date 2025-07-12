import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { sendEmail } from "@/utils/sendEmail";

// Ensure connection is established
connect().catch((err) => console.error("MongoDB connection error:", err));

export async function POST(request: NextRequest) {
  let reqBody;
  try {
    reqBody = await request.json();
    const { username, email, password } = reqBody;

    // Validate request body
    if (!username || !email || !password) {
      console.error("Missing fields in request body:", reqBody);
      return NextResponse.json({ error: "Username, email, and password are required" }, { status: 400 });
    }

    console.log("Request body:", reqBody);

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.error(`User already exists for email: ${email}`);
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // Expires in 10 minutes

    // Hash password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // Create new user (not verified yet)
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      otp,
      otpExpiry,
      isVerified: false,
    });

    // Log user before saving
    console.log(`User before save for email: ${email}`, {
      username: newUser.username,
      email: newUser.email,
      otp: newUser.otp,
      otpExpiry: newUser.otpExpiry,
      isVerified: newUser.isVerified,
    });

    // Save user and verify OTP was saved
    const savedUser = await newUser.save();
    console.log(`User after save for email: ${email}`, {
      username: savedUser.username,
      email: savedUser.email,
      otp: savedUser.otp,
      otpExpiry: savedUser.otpExpiry,
      isVerified: savedUser.isVerified,
    });

    if (!savedUser.otp) {
      console.error(`Failed to save OTP for email: ${email}, saved user:`, savedUser);
      return NextResponse.json(
        { error: "Failed to save OTP. Please try again." },
        { status: 500 }
      );
    }

    console.log(`Temporary user saved for email: ${email}, OTP: ${otp}, Saved OTP: ${savedUser.otp}`);

    // Send OTP email only after successful save
    await sendEmail({
      to: email,
      subject: "MindfulConnect - Verify Your Email",
      text: `Your OTP for email verification is: ${otp}. It is valid for 10 minutes.`,
    });

    return NextResponse.json({
      message: "OTP sent to your email",
      success: true,
    }, { status: 200 });

  } catch (error: any) {
    console.error(`Signup error for email: ${reqBody?.email || 'unknown'}`, error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}