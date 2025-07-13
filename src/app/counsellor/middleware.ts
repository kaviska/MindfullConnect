// app/middleware.ts

import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbconfig from '@/lib/db';
import User from '@/models/User';
import Counselor from '@/models/Counselor';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  // 1. Check token
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  let decodedToken: any;
  try {
    decodedToken = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 2. Connect to DB
  await dbconfig();

  // 3. Fetch user from DB
  const user = await User.findById(decodedToken.userId);
  if (!user) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 4. If user is a counselor, check their status
  if (user.role === 'counselor') {
    const counselor = await Counselor.findOne({ userId: user._id });
    if (!counselor || counselor.status !== 'active') {
      return NextResponse.redirect(new URL('/pending-approval', request.url)); // or show 403
    }
  }

  // ✅ Allow access
  return NextResponse.next();
}
export const config = {
  matcher: ['/counsellor/:path*'], // Apply middleware to these paths
};