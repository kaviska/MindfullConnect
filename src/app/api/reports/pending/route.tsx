import { NextRequest, NextResponse } from "next/server";
import Report from "../../../models/report";
import dbConnect from "../../../lib/mongodb";

export async function GET(req: NextRequest) {
    const url = new URL(req.url);
    const page = Number(url.searchParams.get("page")) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    try {
        await dbConnect();
        
        const reports = await Report.find({ status: "Pending" })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        const total = await Report.countDocuments({ status: "Pending" });
        const totalPages = Math.ceil(total / limit);

        return NextResponse.json({ reports, totalPages });
    } catch (error) {
        console.error("Error fetching pending reports:", error);
        return NextResponse.json({ message: "Error fetching pending reports", error: error.message }, { status: 500 });
    }
}
