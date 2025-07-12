import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(request: Request) {
  try {
    const amount = 300;
    const currency = "USD";
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");
    const counsellorAccountId = "acct_1RjoBE07FeY57x0d";

    const { client_secret: clientSecret } = await stripe.paymentIntents.create({
      amount: amount,
      currency: currency,
      application_fee_amount: Math.floor(amount * 0.2), // 20% commission
      transfer_data: {
        destination: counsellorAccountId, // Stripe Connect account ID
      },
      // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return NextResponse.json(clientSecret, { status: 200 });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
