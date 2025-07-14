import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(request: Request) {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");
    // const body = await request.json();
    // const {counsell}

    // 1. Create a new Stripe Connect account
    const account = await stripe.accounts.create({
      type: "express",
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
    });

    console.log("Stripe account created:", account.id); 

    // 2. Create an onboarding link
    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: "http://localhost:3000/reauth",
      return_url: "http://localhost:3000/onboarded",
      type: "account_onboarding",
    });

    return NextResponse.json({
      url: accountLink.url,
      accountId: account.id,
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
