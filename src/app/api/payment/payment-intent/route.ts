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
    
    // Determine the final amount to charge (convert dollars to cents)
    const counselorFeeInDollars = counselor?.consultationFee;
    const counselorFeeInCents = counselorFeeInDollars ? counselorFeeInDollars * 100 : 0;
    const finalAmount = (counselorFeeInCents && counselorFeeInCents > 0) ? counselorFeeInCents : amount;
    
    console.log(`💰 Counselor fee: $${counselorFeeInDollars} (${counselorFeeInCents} cents)`);
    console.log(`💰 Final amount to charge: $${finalAmount/100} (${finalAmount} cents)`);
    
    // Calculate platform fee (20%) and counselor amount (80%)
    const platformFeeAmount = Math.floor(finalAmount * 0.2); // 20% to platform
    const counselorAmount = finalAmount - platformFeeAmount; // 80% to counselor
    
    console.log(`💰 Platform fee (20%): $${platformFeeAmount/100} (${platformFeeAmount} cents)`);
    console.log(`💰 Counselor amount (80%): $${counselorAmount/100} (${counselorAmount} cents)`);
    
    const connectAccountId = counselor?.stripeAccountId;
    console.log("Connect Account ID:", connectAccountId);

    let paymentIntentParams: any = {
      amount: finalAmount,
      currency: currency,
      metadata: {
        sessionId: sessionId,
        counselorId: counselorId,
        counselorFeeInDollars: counselorFeeInDollars?.toString() || '0',
        platformFeeInCents: platformFeeAmount.toString(),
        counselorAmountInCents: counselorAmount.toString(),
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
        const hasTransferCapability = account.capabilities?.transfers === "active";

        if (hasTransferCapability) {
          paymentIntentParams.application_fee_amount = platformFeeAmount; // 20% commission to platform
          paymentIntentParams.transfer_data = {
            destination: connectAccountId, // 80% goes to counselor
          };
          console.log(`✅ Using Connect account: ${connectAccountId} for counselor: ${counselorId}`);
          console.log(`✅ Platform will receive: $${platformFeeAmount/100} as application fee`);
          console.log(`✅ Counselor will receive: $${counselorAmount/100} as transfer`);
        } else {
          console.log(`⚠️ Connect account ${connectAccountId} lacks transfer capability, processing direct payment`);
        }
      } catch (error) {
        console.log(`⚠️ Connect account ${connectAccountId} invalid, processing direct payment:`, error);
      }
    } else {
      console.log(`ℹ️ No Connect account for counselor: ${counselorId}, processing direct payment`);
    }

    const { client_secret: clientSecret } = await stripe.paymentIntents.create(paymentIntentParams);
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
