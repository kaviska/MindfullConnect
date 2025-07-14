import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db';
import User from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'; // Use env var in production

export async function GET(request: NextRequest) {
  await connectDB();

  try {
    // 🔐 Get token from cookie
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized: Token not found' }, { status: 401 });
    }

    // ✅ Verify JWT
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    } catch (err) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }

    // 📦 Fetch user by ID, excluding password
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user }, { status: 200 });

  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
