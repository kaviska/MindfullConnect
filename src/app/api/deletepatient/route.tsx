import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "../../lib/utils";
import { User } from "../../lib/models";

export async function POST(req: NextRequest) {
    try {
        await connectToDB();
        const formData = await req.formData();
        const id = formData.get("id") as string;

        if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

        await User.findByIdAndDelete(id);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
