import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../lib/mongodb";
import Counselor from "@/app/models/counselor";

export async function GET(req: NextRequest) {
    try {
        await dbConnect();

        const { searchParams } = new URL(req.url);
        const page = Number(searchParams.get("page") || 1);
        const q = searchParams.get("q") || "";
        const pageSize = 10;
        const skip = (page - 1) * pageSize;

        const filter: any = {
            status: "active",  // Using status field from Counselor model
        };

        if (q.length > 2) {
            filter.$or = [
                { name: { $regex: q, $options: "i" } },
            ];
        }

        const totalCount = await Counselor.countDocuments(filter);
        const totalPages = Math.ceil(totalCount / pageSize);

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
            languagesSpoken: counselor.languagesSpoken,
            highestQualification: counselor.highestQualification,
            university: counselor.university,
            licenseNumber: counselor.licenseNumber,
            availabilityType: counselor.availabilityType,
            sessionDuration: counselor.sessionDuration,
            therapeuticModalities: counselor.therapeuticModalities,
            description: counselor.description,
            createdAt: counselor.createdAt
        }));

        return NextResponse.json({ users: formattedUsers, totalPages });
    } catch (error) {
        console.error("Error fetching active counsellors:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
