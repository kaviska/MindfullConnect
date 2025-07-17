import { NextResponse } from 'next/server';

let users: { email: string; password: string }[] = [];

export async function POST(request: Request) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
  }

  const user = users.find(u => u.email === email && u.password === password);
  if (user) {
    return NextResponse.json({ message: 'Login successful' }, { status: 200 });
  }
  return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
}                                                                                                                                                     