import { NextRequest, NextResponse } from "next/server";
import User from "../../../../models/User";
import Report from "../../../../models/report";
import dbConnect from "../../../../lib/mongodb";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        const { id } = await params;
        
        const report = await Report.findById(id).lean();
        
        if (!report) {
            return NextResponse.json({ success: false, message: "Report not found" }, { status: 404 });
        }
        
        return NextResponse.json({ success: true, report });
    } catch (err) {
        console.error("Error fetching report:", err);
        return NextResponse.json({ success: false, error: "Failed to fetch report" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        const { id } = await params;
        const reportId = id;
        const { actionNote, status, banUser } = await req.json();

        const updateFields = {
            actionNote,
            status,
        };

        const updatedReport = await Report.findByIdAndUpdate(
            reportId,
            { $set: updateFields },
            { new: true }
        );

        // Optional: Deactivate user if banned
        if (banUser) {
            const report = await Report.findById(reportId);
            if (report?.reporteeId) {
                await User.findByIdAndUpdate(report.reporteeId, { isActive: false });
            }
        }

        return NextResponse.json({ success: true, updatedReport });
    } catch (err) {
        return NextResponse.json({ success: false, error: "Failed to update" }, { status: 500 });
    }
}
