import { NextRequest, NextResponse } from "next/server";
import { fetchUser } from "../../../lib/data";

export async function GET(
    request: NextRequest,
    context: { params: { id: string } }
) {
    const { id } = context.params;

    try {
        const user = await fetchUser(id);

        if (!user) {
            console.error("User not found:", id);
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error("API error:", error);
        return NextResponse.json({ error: "Failed to load user" }, { status: 500 });
    }
}
