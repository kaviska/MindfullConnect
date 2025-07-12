import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";

connect().catch((err) => console.error("MongoDB connection error:", err));

export async function POST(request: NextRequest) {
  let reqBody;
  try {
    reqBody = await request.json();
    const { email, otp } = reqBody;

    if (!email || !otp) {
      console.error("Missing email or OTP in request body:", reqBody);
      return NextResponse.json({ error: "Email and OTP are required" }, { status: 400 });
    }

    const user = await User.findOne({ email });

    if (!user) {
      console.error(`User not found for email: ${email}`);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!user.otp) {
      console.error(`No OTP found for email: ${email}, stored OTP: ${user.otp}`);
      return NextResponse.json({ error: "No OTP found. Please request a new OTP." }, { status: 400 });
    }

    if (user.otp !== otp) {
      console.error(`Invalid OTP for email: ${email}, provided: ${otp}, stored: ${user.otp}`);
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
    }

    if (user.otpExpiry < new Date()) {
      console.error(`OTP expired for email: ${email}, expiry: ${user.otpExpiry}`);
      return NextResponse.json({ error: "OTP has expired" }, { status: 400 });
    }

    user.otp = undefined;
    user.otpExpiry = undefined;
    user.isVerified = true;

    const savedUser = await user.save();
    console.log(`User verified successfully for email: ${email}`);

    return NextResponse.json({
      message: "User verified successfully",
      success: true,
      savedUser: {
        _id: savedUser._id,
        username: savedUser.username,
        email: savedUser.email,
      },
    }, { status: 200 });

  } catch (error: any) {
    console.error(`OTP verification error for email: ${reqBody?.email || 'unknown'}`, error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}