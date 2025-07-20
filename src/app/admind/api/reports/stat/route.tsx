// /pages/api/reports/stats.ts
import { NextResponse } from "next/server";
import Report from "../../../../models/report";
import dbConnect from "../../../../lib/mongodb";

export const GET = async () => {
    try {
        await dbConnect();

        const totalReports = await Report.countDocuments({});
        const resolvedReports = await Report.countDocuments({ status: "Resolved" });
        const pendingReports = await Report.countDocuments({ status: "Pending" });

        const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        const resolvedThisMonth = await Report.countDocuments({
            status: "Resolved",
            updatedAt: { $gte: startOfMonth }
        });

        return NextResponse.json({
            total: totalReports,
            resolved: resolvedReports,
            resolvedThisMonth,
            pending: pendingReports,
        });
    } catch (err) {
        console.error("Stats API Error:", err);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
};
