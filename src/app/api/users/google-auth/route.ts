import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";

connect();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export async function POST(request: NextRequest) {
  try {
    const { idToken } = await request.json();

    if (!idToken) {
      return NextResponse.json({ error: "ID token is required" }, { status: 400 });
    }

    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      return NextResponse.json({ error: "Invalid Google ID token" }, { status: 400 });
    }

    const { email, given_name, family_name, sub: googleId, picture } = payload;

    let user = await User.findOne({ email });
    if (!user) {
      user = new User({
        username: given_name?.replace(/\s/g, '').toLowerCase() + Math.random().toString(36).slice(-4) || `user_${googleId}`,
        email,
        googleId,
        firstName: given_name,
        lastName: family_name,
        profileImage: picture,
        isVerified: true,
        isAdmin: false,
      });
      await user.save();
    } else if (!user.googleId) {
      user.googleId = googleId;
      user.firstName = given_name;
      user.lastName = family_name;
      user.profileImage = picture;
      user.isVerified = true;
      await user.save();
    }

    const tokenData = {
      id: user._id,
      username: user.username,
      email: user.email,
    };

    if (!process.env.TOKEN_SECRET) {
      throw new Error("TOKEN_SECRET is not defined");
    }

    const token = jwt.sign(tokenData, process.env.TOKEN_SECRET, { expiresIn: "1d" });

    const response = NextResponse.json({
      message: "Google authentication successful",
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profileImage: user.profileImage,
      },
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 86400,
    });

    return response;
  } catch (error: any) {
    console.error("Google auth error:", error);
    return NextResponse.json({ error: error.message || "Google authentication failed" }, { status: 500 });
  }
}