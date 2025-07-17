import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "../../../lib/utils";
import { User } from "../../../lib/models";

export async function GET(req: NextRequest) {
    try {
        await connectToDB();

        const searchParams = req.nextUrl.searchParams;
        const page = parseInt(searchParams.get("page") || "1");
        const query = searchParams.get("q")?.toLowerCase() || "";

        const pageSize = 10;
        const skip = (page - 1) * pageSize;

        const filter: any = {
            role: "Counsellor",
            isActive: false,
        };

        if (query) {
            filter.$or = [
                { firstname: { $regex: query, $options: "i" } },
                { lastname: { $regex: query, $options: "i" } },
                { email: { $regex: query, $options: "i" } },
            ];
        }

        const totalCount = await User.countDocuments(filter);
        const users = await User.find(filter)
            .skip(skip)
            .limit(pageSize)
            .sort({ createdAt: -1 });

        return NextResponse.json({
            users,
            totalPages: Math.ceil(totalCount / pageSize),
        });
    } catch (error) {
        console.error("Error fetching pending counsellors:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
