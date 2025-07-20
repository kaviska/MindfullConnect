import { NextResponse } from "next/server";
import dbConnect from "../../lib/mongodb";
import Session from "../../models/session";

export async function GET() {
    try {
        await dbConnect();
        
        const sessions = await Session.find({})
            .populate('patientId', 'firstname lastname email')
            .populate('counselorId', 'firstname lastname email')
            .sort({ createdAt: -1 });
        
        return NextResponse.json(sessions);
    } catch (error) {
        console.error('Error fetching sessions:', error);
        return NextResponse.json({ error: 'Failed to fetch sessions' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await dbConnect();
        
        const body = await request.json();
        const session = new Session(body);
        await session.save();
        
        return NextResponse.json(session, { status: 201 });
    } catch (error) {
        console.error('Error creating session:', error);
        return NextResponse.json({ error: 'Failed to create session' }, { status: 500 });
    }
}
