import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json(); // Added 'await' here
    const { email, password } = reqBody;
    console.log("Login request:", reqBody);

    // Check if user exists
    const user = await User.findOne({ email }); // Fixed syntax (removed extra braces)
    if (!user) {
      return NextResponse.json(
        { error: "User does not exist" }, // Fixed typo
        { status: 400 }
      );
    }

    // Check if password is correct
    const validPassword = await bcryptjs.compare(password, user.password);
    if (!validPassword) {
      return NextResponse.json(
        { error: "Invalid password" },
        { status: 400 }
      );
    }

    // Create token data
    const tokenData = {
      id: user._id, // Changed from user.id to user._id (MongoDB uses _id)
      username: user.username,
      email: user.email
    };

    // Create token
    if (!process.env.TOKEN_SECRET) {
      throw new Error("TOKEN_SECRET is not defined in environment variables");
    }

    const token = jwt.sign(
      tokenData,
      process.env.TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    const response = NextResponse.json({
      message: "Login successful",
      success: true,
      user: { // Include basic user info in response
        id: user._id,
        username: user.username,
        email: user.email
      }
    });

    // Set cookie
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 86400, // 1 day in seconds
    });

   
    return response;

  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}