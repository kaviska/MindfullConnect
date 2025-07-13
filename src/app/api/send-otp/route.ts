import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { sendOtpEmail } from "@/lib/mailer";

export async function POST(req: NextRequest) {
  await connectDB();

  const { email } = await req.json();

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

  let user = await User.findOne({ email });
  if (!user) {
    user = new User({ email, fullName: "Temp", password: "placeholder" }); // Adjust if needed
  }

  user.otp = otp;
  user.otpExpiry = otpExpiry;
  user.isVerified = false;

  await user.save();
  console.log("Sending OTP email to:", email);
await sendOtpEmail(email, otp);
console.log("OTP email sent.");

  return NextResponse.json({ message: "OTP sent to email" });
}