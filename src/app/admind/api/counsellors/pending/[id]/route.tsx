import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../../../lib/mongodb";
import Counselor from "../../../../../models/counselor";

// GET handler to fetch a single counsellor by ID
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        const { id } = await params;
        console.log("Fetching pending counselor with ID:", id);
        
        const counselor = await Counselor.findById(id)
            .populate('userId', 'email fullName')  // Populate user data to get email
            .lean();
        console.log("Found pending counselor:", counselor);
        
        if (!counselor) {
            return NextResponse.json({ message: "Counselor not found" }, { status: 404 });
        }

        // Format the counselor data consistently for frontend
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
            createdAt: counselorData.createdAt
        };

        return NextResponse.json({ user: formattedCounselor }, { status: 200 });
    } catch (error) {
        console.error("GET error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

// ✅ PUT handler to update status to active
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        const { id } = await params;
        const body = await req.json();
        console.log("Updating pending counselor with ID:", id, "Data:", body);

        const updatedCounselor = await Counselor.findByIdAndUpdate(
            id,
            { $set: body },
            { new: true, runValidators: true }
        ).lean();

        if (!updatedCounselor) {
            return NextResponse.json({ message: "Counselor not found" }, { status: 404 });
        }

        // Format the updated counselor data consistently for frontend
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
            createdAt: counselorData.createdAt
        };

        return NextResponse.json({ message: "Counsellor updated", user: formattedCounselor }, { status: 200 });
    } catch (error) {
        console.error("PUT error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        const { id } = await params;
        console.log("Rejecting pending counselor with ID:", id);
        
        const deletedCounselor = await Counselor.findByIdAndDelete(id);

        if (!deletedCounselor) {
            return NextResponse.json({ message: "Counselor not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Counsellor rejected and deleted" }, { status: 200 });
    } catch (error) {
        console.error("DELETE error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
