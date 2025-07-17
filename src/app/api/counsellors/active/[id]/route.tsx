import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "../../../../lib/utils";
import { User } from "../../../../lib/models";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        await connectToDB();
        const user = await User.findById(params.id);
        if (!user || user.role !== "Counsellor" || user.isActive !== true) {
            return NextResponse.json({ message: "User not found or not active" }, { status: 404 });
        }
        return NextResponse.json({ user }, { status: 200 });
    } catch (error) {
        console.error("GET error:", error);
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
