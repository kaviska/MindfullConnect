import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/db";
import Session from "@/models/Session";
import User from "@/models/User";
import axios from "axios";

const JWT_SECRET = process.env.JWT_SECRET!;

// Utility function to delete Zoom meeting
async function deleteZoomMeeting(meetingId: string): Promise<boolean> {
  try {
    // Step 1: Get Access Token
    const tokenRes = await axios.post(
      `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${process.env.ZOOM_ACCOUNT_ID}`,
      {},
      {
        headers: {
          Authorization:
            'Basic ' +
            Buffer.from(
              `${process.env.ZOOM_CLIENT_ID}:${process.env.ZOOM_CLIENT_SECRET}`
            ).toString('base64'),
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const accessToken = tokenRes.data.access_token;

    // Step 2: Delete from Zoom
    await axios.delete(`https://api.zoom.us/v2/meetings/${meetingId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    console.log("✅ Zoom meeting deleted successfully:", meetingId);
    return true;
  } catch (error: any) {
    console.error("❌ Failed to delete Zoom meeting:", error.response?.data || error.message);
    return false;
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();

  const sessionId = params.id;
  
  // ✅ Use cookies instead of Authorization header
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const session = await (Session as any).findById(sessionId);

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    // Get user to check their role
    const user = await (User as any).findById(decoded.userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if user has permission to cancel this session
    const isPatient = session.patientId.toString() === decoded.userId;
    const isCounselor = user.role === 'counselor' && session.counselorId.toString() === decoded.userId;

    if (!isPatient && !isCounselor) {
      return NextResponse.json({ error: "Forbidden: You can only cancel your own sessions" }, { status: 403 });
    }

    // For patients, check if cancellation is at least 24 hours in advance
    if (isPatient) {
      const sessionDate = new Date(`${session.date}T${session.time}`);
      const now = new Date();
      const timeDiff = sessionDate.getTime() - now.getTime();
      const hoursDiff = timeDiff / (1000 * 60 * 60);

      if (hoursDiff < 24) {
        return NextResponse.json({
          error: "Cancellations are only allowed at least 24 hours in advance"
        }, { status: 400 });
      }
    }

    // If there's a zoom link, try to delete the Zoom meeting
    if (session.zoomLink) {
      try {
        // Extract meeting ID from zoom link
        // Zoom URLs are like: https://zoom.us/j/1234567890 or https://us04web.zoom.us/j/1234567890
        const meetingIdMatch = session.zoomLink.match(/\/j\/(\d+)/);
        if (meetingIdMatch && meetingIdMatch[1]) {
          const zoomMeetingId = meetingIdMatch[1];
          console.log("Attempting to delete Zoom meeting with ID:", zoomMeetingId);
          
          // Call the utility function to delete from Zoom
          const deleteSuccess = await deleteZoomMeeting(zoomMeetingId);
          
          if (deleteSuccess) {
            console.log("✅ Zoom meeting deleted successfully");
          } else {
            console.error("❌ Failed to delete Zoom meeting, but continuing with session cancellation");
          }
        } else {
          console.warn("Could not extract meeting ID from Zoom link:", session.zoomLink);
        }
      } catch (zoomError: any) {
        console.error("Error deleting Zoom meeting:", zoomError);
        // Continue with cancellation even if Zoom deletion fails
      }
    }

    // ✅ Update status to cancelled and remove zoom link
    await (Session as any).findByIdAndUpdate(sessionId, { 
      status: 'cancelled',
      zoomLink: null // Remove the zoom link
    });

    return NextResponse.json({ 
      message: "Session cancelled successfully",
      sessionId: sessionId 
    });
  } catch (error: any) {
    console.error("Error cancelling session:", error);
    return NextResponse.json({ error: error.message || "Failed to cancel session" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();

  const sessionId = params.id;
  
  // ✅ Use cookies instead of Authorization header
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const body = await request.json();
    const { status } = body;

    const session = await (Session as any).findById(sessionId);

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    // Get user to check their role
    const user = await (User as any).findById(decoded.userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if user has permission to update this session
    const isCounselor = user.role === 'counselor' && session.counselorId.toString() === decoded.userId;

    if (!isCounselor) {
      return NextResponse.json({ error: "Forbidden: Only the assigned counselor can update this session" }, { status: 403 });
    }

    // Validate the status
    const validStatuses = ["pending", "confirmed", "cancelled", "completed", "counselor requested reschedule"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    // Update the session status
    await (Session as any).findByIdAndUpdate(sessionId, { status });

    return NextResponse.json({ 
      message: "Session status updated successfully",
      sessionId: sessionId,
      newStatus: status
    });
  } catch (error: any) {
    console.error("Error updating session:", error);
    return NextResponse.json({ error: error.message || "Failed to update session" }, { status: 500 });
  }
}