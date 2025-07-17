import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "../../../lib/utils";
import { User } from "../../../lib/models";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        await connectToDB();
        const user = await User.findById(params.id);
        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, user });
    } catch (error) {
        return NextResponse.json({ success: false, message: "Internal error" }, { status: 500 });
    }
}
