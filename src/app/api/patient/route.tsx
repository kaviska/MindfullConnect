import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../lib/mongodb";
import { User } from "../../lib/models";

export async function GET(req: NextRequest) {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page") || 1);
    const q = searchParams.get("q") || "";
    const pageSize = 10;

    const query: any = { role: "Patient" };
    if (q.length > 2) {
        query.firstname = { $regex: q, $options: "i" };
    }

    const totalUsers = await User.countDocuments(query);
    const totalPages = Math.ceil(totalUsers / pageSize);

    const users = await User.find(query)
        .skip((page - 1) * pageSize)
        .limit(pageSize);

    return NextResponse.json({ users, totalPages });
}
