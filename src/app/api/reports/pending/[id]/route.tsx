import { NextRequest, NextResponse } from "next/server";
import { User, Report } from "../../../../lib/models";
import { connectToDB } from "../../../../lib/utils";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        await connectToDB();
        const reportId = params.id;
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
