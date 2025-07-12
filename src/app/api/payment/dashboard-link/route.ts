import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function GET(request: Request) {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");
    const accountId = "acct_1RjoBE07FeY57x0d";

    if (!accountId) {
      return NextResponse.json(
        { error: "Account ID is required" },
        { status: 400 }
      );
    }

    const loginLink = await stripe.accounts.createLoginLink(accountId);

    return NextResponse.json(loginLink, { status: 200 });
  } catch (error) {
    console.error("Error retrieving account:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
