import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../lib/mongodb";
import Counselor from "@/app/models/counselor";

export async function GET(req: NextRequest) {
    try {
        await dbConnect();

        const searchParams = req.nextUrl.searchParams;
        const page = parseInt(searchParams.get("page") || "1");
        const query = searchParams.get("q")?.toLowerCase() || "";

        const pageSize = 10;
        const skip = (page - 1) * pageSize;

        const filter: any = {
            status: "pending",  // Using status field from Counselor model
        };

        if (query) {
            filter.$or = [
                { name: { $regex: query, $options: "i" } },
            ];
        }

        const totalCount = await Counselor.countDocuments(filter);
        const counselors = await Counselor.find(filter)
            .populate('userId', 'email fullName')  // Populate user data to get email
            .skip(skip)
            .limit(pageSize)
            .sort({ createdAt: -1 })
            .lean();

        // Format the counselors data consistently for frontend
        const formattedUsers = counselors.map((counselor: any) => ({
            _id: counselor._id.toString(),
            firstname: counselor.name?.split(' ')[0] || '',
            lastname: counselor.name?.split(' ')[1] || '',
            name: counselor.name,
            fullName: counselor.name,
            email: counselor.userId?.email || 'N/A',  // Get email from populated User data
            isActive: counselor.status === "active",
            status: counselor.status,
            imageUrl: counselor.avatar || '/default-avatar.png',
            specialty: counselor.specialty,
            bio: counselor.bio,
            rating: counselor.rating,
            reviews: counselor.reviews,
            consultationFee: counselor.consultationFee,
            yearsOfExperience: counselor.yearsOfExperience,
            createdAt: counselor.createdAt
        }));

        return NextResponse.json({
            users: formattedUsers,
            totalPages: Math.ceil(totalCount / pageSize),
        });
    } catch (error) {
        console.error("Error fetching pending counsellors:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
