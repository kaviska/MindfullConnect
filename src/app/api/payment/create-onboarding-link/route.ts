import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import Counselor from "@/models/Counselor";
import dbconfig from "@/lib/db";
import Stripe from "stripe";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

export async function POST(request: NextRequest) {
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

    if (!counselor) {
      return NextResponse.json(
        { error: "Counselor profile not found" },
        { status: 404 }
      );
    }

    let stripeAccountId = counselor.stripeAccountId;

    // Create account if doesn't exist
    if (!stripeAccountId) {
      const account = await stripe.accounts.create({
        type: "express",
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
        metadata: {
          counselorId: counselor._id.toString(),
          userId: userId
        }
      });

      stripeAccountId = account.id;

      // Update counselor with new account ID
      await Counselor.findByIdAndUpdate(counselor._id, {
        stripeAccountId: stripeAccountId
      });
    }

    // Create onboarding link
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const accountLink = await stripe.accountLinks.create({
      account: stripeAccountId,
      refresh_url: `${baseUrl}/counsellor/payment/reauth`,
      return_url: `${baseUrl}/counsellor/payment/onboarded`,
      type: "account_onboarding",
    });

    return NextResponse.json({
      url: accountLink.url,
      accountId: stripeAccountId,
    }, { status: 200 });

  } catch (error) {
    console.error("Error creating onboarding link:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
