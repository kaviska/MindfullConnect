import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "../../../../lib/utils";
import { User } from "../../../../lib/models"; // Make sure the User model has isActive field

// GET handler to fetch a single counsellor by ID
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        await connectToDB();
        const user = await User.findById(params.id);
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }
        return NextResponse.json({ user }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

// ✅ PUT handler to update isActive to true
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        await connectToDB();
        const body = await req.json();

        const updatedUser = await User.findByIdAndUpdate(
            params.id,
            { isActive: body.isActive },
            { new: true }
        );

        if (!updatedUser) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Counsellor updated", user: updatedUser }, { status: 200 });
    } catch (error) {
        console.error("PUT error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        await connectToDB();
        const deletedUser = await User.findByIdAndDelete(params.id);

        if (!deletedUser) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Counsellor deleted" }, { status: 200 });
    } catch (error) {
        console.error("DELETE error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
