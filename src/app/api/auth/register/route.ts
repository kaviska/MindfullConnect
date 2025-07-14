import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '@/models/User';
import Counselor from '@/models/Counselor';
import dbconfig from '@/lib/db';
import { sendOtpEmail } from '@/lib/mailer';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export async function POST(request: NextRequest) {
  await dbconfig();

  try {
    const body = await request.json();
    const fullName = body.fullName?.trim();
    const email = body.email?.toLowerCase().trim();
    const password = body.password;
    const role = body.role || 'User';

    // Validate input
    if (!fullName || !email || !password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    // Create user
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      role,
      lastSeen: new Date(),
      isVerified: false,
      otp,
      otpExpiry,
    });

    await newUser.save();

    // If counselor, create profile
    if (role === 'counselor') {
      const counselorProfile = new Counselor({
        userId: newUser._id,
        name: fullName,
        description: 'New counselor - profile pending completion',
        rating: 0,
        reviews: 0,
        avatar: '/ava2.svg',
        status: 'pending',
        profileCompleted: false
      });

      await counselorProfile.save();
    }

    // Generate JWT token
    const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, {
      expiresIn: "1h",
    });

    // Send OTP via email
    try {
      await sendOtpEmail(email, otp);
    } catch (emailErr) {
      console.error("Email error:", emailErr);
      return NextResponse.json({ error: 'Failed to send OTP' }, { status: 500 });
    }

    // Create response with token and user data
    const response = NextResponse.json({
      message: 'User registered successfully. OTP sent to email.',
      token: token,
      user: {
        id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        role: newUser.role,
        isVerified: newUser.isVerified
      },
    }, { status: 201 });

    // Set JWT token in httpOnly cookie
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60, // 1 hour
      path: "/",
    });

    // Optional: set userId cookie if you want client access
    response.cookies.set("userId", newUser._id.toString(), {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60,
      path: "/",
    });

    return response;

  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}