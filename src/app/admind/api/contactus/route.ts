import { NextResponse } from "next/server";
import dbConnect from "../../../lib/mongodb";
import ContactUs from "../../../models/contactus";

export async function GET(req: Request) {
    try {
        await dbConnect();

        // Get the page from query params
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = 10; // items per page
        const skip = (page - 1) * limit;

        // Fetch only unreplied contacts
        const contacts = await ContactUs.find({ replied: false })
            .sort({ createdAt: -1 }) // Sort by newest first
            .skip(skip)
            .limit(limit);

        // Get total count for pagination
        const total = await ContactUs.countDocuments({ replied: false });
        const totalPages = Math.ceil(total / limit);

        return NextResponse.json({
            success: true,
            contacts,
            totalPages,
            currentPage: page,
            total
        });
    } catch (error: any) {
        console.error("Error in GET /api/contactus:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
