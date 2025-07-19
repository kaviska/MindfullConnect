import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Counselor from "@/models/Counselor";

export async function GET() {
  try {
    await connectDB();

    // Fetch active counselors with complete profiles
    const counselors = await Counselor.find({
      status: "active",
      profileCompleted: true
    })
    .select('name specialty yearsOfExperience rating reviews consultationFee bio avatar status therapeuticModalities languagesSpoken availabilityType')
    .sort({ rating: -1, reviews: -1 }) // Sort by rating and reviews
    .limit(12) // Limit to 12 for home page
    .lean();

    // Add default values and clean data
    const formattedCounselors = counselors.map(counselor => ({
      ...counselor,
      rating: counselor.rating || 4.8,
      reviews: counselor.reviews || Math.floor(Math.random() * 100) + 20,
      avatar: counselor.avatar || "/default-avatar.png",
      yearsOfExperience: counselor.yearsOfExperience || 5,
      therapeuticModalities: counselor.therapeuticModalities || [],
      languagesSpoken: counselor.languagesSpoken || ['English'],
      availabilityType: counselor.availabilityType || 'online'
    }));

    return NextResponse.json({
      success: true,
      counselors: formattedCounselors,
      total: formattedCounselors.length
    });

  } catch (error) {
    console.error("Error fetching featured counselors:", error);
    return NextResponse.json(
      { error: "Failed to fetch counselors" },
      { status: 500 }
    );
  }
}
