import { NextResponse } from 'next/server';

let users: { email: string; password: string }[] = [];

export async function POST(request: Request) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
  }

  if (users.some(user => user.email === email)) {
    return NextResponse.json({ error: 'User already exists' }, { status: 400 });
  }

  users.push({ email, password });
  return NextResponse.json({ message: 'User registered successfully' }, { status: 201 });
}