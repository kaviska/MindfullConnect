import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '../../../lib/mongodb';
import Admin from '../../../models/Admin';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const { firstName, lastName, email, password } = body;

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json({ error: 'All fields required' }, { status: 400 });
    }

    const existing = await Admin.findOne({ email });
    if (existing) {
      return NextResponse.json({ error: 'Admin already exists' }, { status: 400 });
    }

    const totalAdmins = await Admin.countDocuments();
    const isSuperAdmin = totalAdmins === 0;

    const fullPermissions = {
      dashboard: { create: true, read: true, update: true, delete: true },
      counselor: { create: true, read: true, update: true, delete: true },
      patient: { create: true, read: true, update: true, delete: true },
      report: { create: true, read: true, update: true, delete: true },
      employee: { create: true, read: true, update: true, delete: true },
    };

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = await Admin.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      isSuperAdmin,
      permissions: isSuperAdmin ? fullPermissions : {},
    });

    return NextResponse.json({
      message: 'Signup successful',
      userId: newAdmin._id,
      isSuperAdmin: newAdmin.isSuperAdmin,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}