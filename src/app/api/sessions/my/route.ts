import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/db";
import Session from "@/models/Session";
import User from "@/models/User";
import Counselor from "@/models/Counselor";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET(request: NextRequest) {
  await connectDB();

  try {
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

    // ✅ Simple population - just get counselor basic info
    const sessions = await Session.find({ patientId: decoded.userId })
      .sort({ date: 1, time: 1 }) // earliest first
      .populate("counselorId", "fullName email") // Get counselor's basic info from User model
      .lean(); // Use lean for better performance

    // ✅ Enhanced mapping with proper null checking
    const result = await Promise.all(
      sessions.map(async (session: any) => {
        let counselorName = "Unknown Counselor";
        let counselorSpecialty = "General Counseling";
        let counselorId = "unknown";

        // ✅ Check if counselorId exists and is populated
        if (session.counselorId && session.counselorId._id) {
          counselorId = session.counselorId._id.toString();
          
          // Get counselor name from populated User data
          if (session.counselorId.fullName) {
            counselorName = session.counselorId.fullName;
          }

          // Get specialty from Counselor collection using the counselorId
          try {
            const counselorDetails = await Counselor.findOne({ 
              userId: session.counselorId._id 
            }).select("specialty").lean();
            
            if (counselorDetails?.specialty) {
              counselorSpecialty = counselorDetails.specialty;
            }
          } catch (err) {
            console.log("Could not fetch counselor specialty:", err);
          }
        } else {
          // ✅ Handle case where counselorId is null or not populated
          console.warn(`⚠️ Session ${session._id} has invalid counselorId:`, session.counselorId);
        }

        return {
          id: session._id.toString(),
          date: session.date,
          time: session.time,
          duration: session.duration || 55,
          status: session.status,
          counselor: {
            id: counselorId,
            name: counselorName,
            specialty: counselorSpecialty
          },
          // TODO: Add zoom link when implemented
          zoomLink: session.zoomLink,
          createdAt: session.createdAt
        };
      })
    );

    return NextResponse.json({ 
      sessions: result,
      total: result.length 
    });
  } catch (error: any) {
    console.error("❌ Error fetching user sessions:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}