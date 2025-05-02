import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Milestone from "@/models/MileStone";

// Add a new milestone
export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        const body = await req.json();

        // Input validation
        if (!body.goal_id || typeof body.goal_id !== "string") {
            return NextResponse.json(
                { message: "Invalid or missing 'goal_id'" },
                { status: 400 }
            );
        }

        if (!Array.isArray(body.breakdown) || body.breakdown.length === 0) {
            return NextResponse.json(
                { message: "'breakdown' must be a non-empty array" },
                { status: 400 }
            );
        }

        for (const item of body.breakdown) {
            if (!item.description || typeof item.description !== "string") {
                return NextResponse.json(
                    { message: "Each breakdown item must have a valid 'description'" },
                    { status: 400 }
                );
            }
            if (!item.time || typeof item.time !== "string") {
                return NextResponse.json(
                    { message: "Each breakdown item must have a valid 'time'" },
                    { status: 400 }
                );
            }
        }

        const milestone = new Milestone(body);
        await milestone.save();
        return NextResponse.json(milestone, { status: 201 });
    } catch (error) {
        console.error("Error creating milestone:", error);
        return NextResponse.json(
            { message: "Error creating milestone" },
            { status: 500 }
        );
    }
}

// Get all milestones
export async function GET() {
    try {
        await dbConnect();
        const milestones = await Milestone.find({});
        return NextResponse.json(milestones, { status: 200 });
    } catch (error) {
        console.error("Error fetching milestones:", error);
        return NextResponse.json(
            { message: "Error fetching milestones", },
            { status: 500 }
        );
    }
}