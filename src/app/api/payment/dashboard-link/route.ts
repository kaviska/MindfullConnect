import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import Counselor from "@/models/Counselor";
import dbconfig from "@/lib/db";
import Stripe from "stripe";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

export async function GET(request: NextRequest) {
  await dbconfig();

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

    const token =
      request.cookies.get("token")?.value ||
      request.headers.get("authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const userId = decoded.userId;

    const counselor = await Counselor.findOne({ userId });

    if (!counselor || !counselor.stripeAccountId) {
      return NextResponse.json(
        {
          error: "Stripe account not found. Please complete onboarding first.",
        },
        { status: 400 }
      );
    }

    const loginLink = await stripe.accounts.createLoginLink(
      counselor.stripeAccountId
    );

    return NextResponse.json(loginLink, { status: 200 });
  } catch (error) {
    console.error("Error retrieving account:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
