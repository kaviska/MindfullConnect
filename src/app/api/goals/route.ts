import mongoose from 'mongoose';
import Goals from '@/models/Goals';
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
    await dbConnect();
    try {
        const body = await req.json();
        const goals = new Goals(body);
        await goals.save();
        return NextResponse.json(goals, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: 'Error creating goals', error: error }, { status: 500 });
    }
    }

export async function GET(req: NextRequest) {
    await dbConnect();
    try {
        const goals = await Goals.find({});
        return NextResponse.json(goals, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Error fetching goals', error: error }, { status: 500 });
    }
}
