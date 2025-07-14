import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import User from '@/models/User';

export interface TokenPayload {
  id: string;
  username?: string;
  email?: string;
  [key: string]: any;
}

export async function getUserFromToken(): Promise<TokenPayload | null> {
  try {
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      console.error('🚨 JWT_SECRET is not defined in environment variables');
      return null;
    }

    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    console.log('🔐 Token from cookies:', token ? 'Present' : 'Missing');

    if (!token) {
      console.log('❌ No token found in cookies');
      return null;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    console.log('🔐 Decoded token:', decoded);

    if (!decoded.id) {
      console.log('❌ No id in decoded token');
      return null;
    }

    // Verify user exists in database
    const user = await User.findById(decoded.id).lean();
    console.log('🔐 User from DB:', user ? 'Found' : 'Not found', { userId: decoded.id });
    if (!user) {
      console.log('❌ No user found for ID:', decoded.id);
      return null;
    }

    return { id: decoded.id, username: decoded.username, email: decoded.email };
  } catch (err: any) {
    console.error('🚨 getUserFromToken error:', err.message, { name: err.name });
    return null;
  }
}