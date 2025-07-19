import { NextResponse } from "next/server";
import Stripe from "stripe";
import connectDB from "@/lib/db";
import Counselor from "@/models/Counselor";
import Session from "@/models/Session";     

export async function POST(request: Request) {
  try {
    const { amount = 300, sessionId, counselorId } = await request.json();
    const currency = "USD";
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

    await connectDB();

    // Check if counselor has a Connect account
    const counselor = await Counselor.findOne({ userId: counselorId });
    console.log("Counsellor", counselorId, counselor);
    
    // Determine the final amount to charge
    const counselorFee = counselor?.consultationFee;
    const finalAmount = (counselorFee && counselorFee > 0) ? counselorFee : amount;
    console.log(`💰 Using amount: $${finalAmount/100} (Counselor fee: $${counselorFee/100 || 'not set'}, Default: $${amount/100})`);
    
    // Debug the stripeAccountId field
    console.log("All counselor keys:", Object.keys(counselor || {}));
    console.log("Raw stripeAccountId:", counselor?.stripeAccountId);
    console.log("toObject stripeAccountId:", counselor?.toObject()?.stripeAccountId);
    console.log("Direct access:", counselor && counselor['stripeAccountId']);
    
    const connectAccountId = counselor?.toObject()?.stripeAccountId || counselor?.stripeAccountId;
    console.log("Connect Account ID:", connectAccountId);

    let paymentIntentParams: any = {
      amount: finalAmount,
      currency: currency,
      metadata: {
        sessionId: sessionId,
        counselorId: counselorId,
      },
      automatic_payment_methods: {
        enabled: true,
      },
    };

    // If Connect account exists, add transfer data (80% to counselor, 20% commission)
    if (connectAccountId) {
      try {
        // Verify the Connect account has required capabilities
        const account = await stripe.accounts.retrieve(connectAccountId);
        const hasTransferCapability = account.capabilities?.transfers ===
          "active";

        if (hasTransferCapability) {
          paymentIntentParams.application_fee_amount = Math.floor(finalAmount * 0.2); // 20% commission
          paymentIntentParams.transfer_data = {
            destination: connectAccountId, // 80% goes to counselor
          };
          console.log(
            `✅ Using Connect account: ${connectAccountId} for counselor: ${counselorId}`
          );
        } else {
          console.log(
            `⚠️ Connect account ${connectAccountId} lacks transfer capability, processing direct payment`
          );
        }
      } catch (error) {
        console.log(
          `⚠️ Connect account ${connectAccountId} invalid, processing direct payment:`,
          error
        );
      }
    } else {
      console.log(
        `ℹ️ No Connect account for counselor: ${counselorId}, processing direct payment`
      );
    }

    const { client_secret: clientSecret } = await stripe.paymentIntents.create(
      paymentIntentParams
    );
     // ✅ Update session status to confirmed after successful payment intent creation
    if (sessionId) {
      await Session.findByIdAndUpdate(sessionId, {
        status: "confirmed"
      });
      console.log(`✅ Session ${sessionId} status updated to confirmed`);
    }

    return NextResponse.json(
      { client_secret: clientSecret, amount: finalAmount },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error creating payment intent:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
