import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '@/models/User';
import Counselor from '@/models/Counselor';
import dbconfig from '@/lib/db';

const JWT_SECRET = 'your_jwt_secret'; // ⚠️ Use environment variable in production

export async function POST(request: NextRequest) {
  await dbconfig();

  try {
    const { fullName, email, password, role } = await request.json();

    if (!fullName || !email || !password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      fullName,
      email,
      password: hashedPassword,
      role: role || 'User',
      lastSeen: new Date(),
    });

    await user.save();

    // If counselor, create profile
    if (role === 'counselor') {
      const counselorProfile = new Counselor({
        userId: user._id,
        specialty: 'General Counseling',
        description: 'Certified counselor',
        rating: 4.8,
        reviews: 0,
        avatar: '/ava2.svg',
        status: 'inactive',
      });

      await counselorProfile.save();
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });

    // ✅ Create response and set cookies
    const response = NextResponse.json({
      message: 'User registered successfully',
      user: { id: user._id, fullName, email, role }
    }, { status: 201 });

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60, // 1 hour
      path: '/',
    });

   
    return response;

  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
