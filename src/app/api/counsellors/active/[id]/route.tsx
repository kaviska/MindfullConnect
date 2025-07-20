import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../../lib/mongodb";
import Counselor from "@/app/models/counselor";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        const { id } = await params;
        console.log("Fetching counselor with ID:", id);
        
        const counselor = await Counselor.findById(id)
            .populate('userId', 'email fullName')  // Populate user data to get email
            .lean();
        console.log("Found counselor:", counselor);
        
        if (!counselor) {
            return NextResponse.json({ message: "Counselor not found" }, { status: 404 });
        }

        // Format the counselor data consistently with the list API
        const counselorData = counselor as any;
        const formattedCounselor = {
            _id: counselorData._id.toString(),
            firstname: counselorData.name?.split(' ')[0] || '',
            lastname: counselorData.name?.split(' ')[1] || '',
            name: counselorData.name,
            fullName: counselorData.name,
            email: counselorData.userId?.email || 'N/A',  // Get email from populated User data
            isActive: counselorData.status === "active",
            status: counselorData.status,
            imageUrl: counselorData.avatar || '/default-avatar.png',
            specialty: counselorData.specialty,
            bio: counselorData.bio,
            rating: counselorData.rating,
            reviews: counselorData.reviews,
            consultationFee: counselorData.consultationFee,
            yearsOfExperience: counselorData.yearsOfExperience,
            languagesSpoken: counselorData.languagesSpoken,
            highestQualification: counselorData.highestQualification,
            university: counselorData.university,
            licenseNumber: counselorData.licenseNumber,
            availabilityType: counselorData.availabilityType,
            sessionDuration: counselorData.sessionDuration,
            therapeuticModalities: counselorData.therapeuticModalities,
            description: counselorData.description,
            createdAt: counselorData.createdAt
        };
        
        return NextResponse.json({ user: formattedCounselor }, { status: 200 });
    } catch (error) {
        console.error("GET error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        const { id } = await params;
        const deletedCounselor = await Counselor.findByIdAndDelete(id);

        if (!deletedCounselor) {
            return NextResponse.json({ message: "Counselor not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Counsellor deleted" }, { status: 200 });
    } catch (error) {
        console.error("DELETE error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        const { id } = await params;
        const body = await req.json();

        const updatedCounselor = await Counselor.findByIdAndUpdate(
            id,
            { $set: body },
            { new: true, runValidators: true }
        ).lean();

        if (!updatedCounselor) {
            return NextResponse.json({ message: "Counselor not found" }, { status: 404 });
        }

        // Format the updated counselor data consistently with GET endpoint
        const counselorData = updatedCounselor as any;
        const formattedCounselor = {
            _id: counselorData._id.toString(),
            firstname: counselorData.name?.split(' ')[0] || '',
            lastname: counselorData.name?.split(' ')[1] || '',
            name: counselorData.name,
            fullName: counselorData.name,
            email: counselorData.email,
            isActive: counselorData.status === "active",
            status: counselorData.status,
            imageUrl: counselorData.avatar || '/default-avatar.png',
            specialty: counselorData.specialty,
            bio: counselorData.bio,
            rating: counselorData.rating,
            reviews: counselorData.reviews,
            consultationFee: counselorData.consultationFee,
            yearsOfExperience: counselorData.yearsOfExperience,
            languagesSpoken: counselorData.languagesSpoken,
            highestQualification: counselorData.highestQualification,
            university: counselorData.university,
            licenseNumber: counselorData.licenseNumber,
            availabilityType: counselorData.availabilityType,
            sessionDuration: counselorData.sessionDuration,
            therapeuticModalities: counselorData.therapeuticModalities,
            description: counselorData.description,
            createdAt: counselorData.createdAt
        };

        return NextResponse.json({ user: formattedCounselor }, { status: 200 });
    } catch (error) {
        console.error("PATCH error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
