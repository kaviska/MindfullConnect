import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import User from '@/models/User';
import Counselor from '@/models/Counselor';
import dbconfig from '@/lib/db';
import { sendOtpEmail } from '@/lib/mailer';

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

    // Send OTP via email
    try {
      await sendOtpEmail(email, otp);
    } catch (emailErr) {
      console.error("Email error:", emailErr);
      return NextResponse.json({ error: 'Failed to send OTP' }, { status: 500 });
    }

    // Create Counselor profile if needed
    if (role === 'counselor') {
      await new Counselor({
    userId: newUser._id,
    name: fullName,
    specialty: 'General Counseling',
    description: 'Certified counselor',
    rating: 4.8,
    reviews: 0,
    avatar: '/ava2.svg',
    status: 'inactive',
  }).save();
}

    return NextResponse.json({
      message: 'User registered. OTP sent to email.',
      user: { email, role },
    }, { status: 201 });

  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}