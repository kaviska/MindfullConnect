import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

connect();

export async function PUT(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value || "";
    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.TOKEN_SECRET!) as { id: string };
    const userId = decoded.id;

    const reqBody = await request.json();
    const { firstName, lastName, nic, address, city, postalCode, role } = reqBody;

    if (!role || !["patient", "counselor"].includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.nic = nic || user.nic;
    user.address = address || user.address;
    user.city = city || user.city;
    user.postalCode = postalCode || user.postalCode;
    user.role = role || user.role;

    const updatedUser = await user.save();

    return NextResponse.json({
      message: "Profile updated successfully",
      success: true,
      user: {
        id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        nic: updatedUser.nic,
        address: updatedUser.address,
        city: updatedUser.city,
        postalCode: updatedUser.postalCode,
        role: updatedUser.role,
        profileImage: updatedUser.profileImage,
      },
    });
  } catch (error: any) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: error.message || "Profile update failed" }, { status: 500 });
  }
}