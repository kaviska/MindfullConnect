import { NextResponse } from "next/server";
import dbConnect from "../../../lib/mongodb";
import Session from "../../../models/session";

export async function GET() {
    try {
        await dbConnect();
        
        const sessions = await Session.find({})
            .populate('patientId', 'fullName email')
            .populate('counselorId', 'fullName email')
            .sort({ createdAt: -1 });
        
        // Transform the data to match what the component expects
        const transformedSessions = sessions.map(session => ({
            _id: session._id,
            patientId: {
                _id: session.patientId?._id,
                fullName: session.patientId?.fullName
            },
            counselorId: {
                _id: session.counselorId?._id,
                name: session.counselorId?.fullName // Map fullName to name for counselor
            },
            date: session.date,
            status: session.status,
            sessionType: session.sessionType || 'therapy',
            time: session.time,
            duration: session.duration
        }));
        
        return NextResponse.json({ 
            sessions: transformedSessions,
            count: transformedSessions.length 
        });
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
