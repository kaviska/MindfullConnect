import { NextRequest,NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Milestone from "@/models/MileStone";
// Add a new milestone
export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        const body = await req.json();
        const milestone = new Milestone(body);
        await milestone.save();
        return NextResponse.json(milestone, { status: 201 });        
    } catch (error) {
        return NextResponse.json(
            { message: "Error creating milestone", error: error },
            { status: 500 }
        );
    }
    }

    export async function GET() {
        try {
            await dbConnect();
            const milestones = await Milestone.find({});
            return NextResponse.json(milestones, { status: 200 });
        } catch (error) {
            return NextResponse.json(
                { message: "Error fetching milestones", error: error },
                { status: 500 }
            );
        }
    }