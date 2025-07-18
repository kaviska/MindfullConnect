import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import Counselor from '@/models/Counselor';
import dbconfig from '@/lib/db';
import Stripe from 'stripe';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

export async function POST(request: NextRequest) {
  await dbconfig();

  try {
    const token = request.cookies.get('token')?.value || request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const userId = decoded.userId;

    const profileData = await request.json();

    // Find existing counselor profile
    const existingCounselor = await Counselor.findOne({ userId });
    
    if (!existingCounselor) {
      return NextResponse.json({ error: 'Counselor profile not found' }, { status: 404 });
    }

    // Create Stripe Connect account if not exists
    let stripeAccountId = existingCounselor.stripeAccountId;

    if (!stripeAccountId) {
      try {
        const account = await stripe.accounts.create({
          type: "express",
          capabilities: {
            card_payments: { requested: true },
            transfers: { requested: true },
          },
          metadata: {
            counselorId: existingCounselor._id.toString(),
            userId: userId
          }
        });

        stripeAccountId = account.id;
      } catch (stripeError) {
        console.error('Stripe account creation error:', stripeError);
        // Continue with profile update even if Stripe fails
      }
    }

    // Update counselor profile with new data
    const updatedCounselor = await Counselor.findOneAndUpdate(
      { userId },
      {
        ...profileData,
        profileCompleted: true,
        status: 'active',
        ...(stripeAccountId && { stripeAccountId })
      },
      { new: true }
    );

    return NextResponse.json({
      message: 'Profile updated successfully',
      counselor: updatedCounselor
    }, { status: 200 });

  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  await dbconfig();

  try {
    const token = request.cookies.get('token')?.value || request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const userId = decoded.userId;

    const counselor = await Counselor.findOne({ userId }).populate('userId', 'fullName email');
    
    if (!counselor) {
      return NextResponse.json({ error: 'Counselor profile not found' }, { status: 404 });
    }

    return NextResponse.json({ counselor }, { status: 200 });

  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
