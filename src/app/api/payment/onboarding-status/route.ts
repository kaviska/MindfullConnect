import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import Counselor from '@/models/Counselor';
import dbconfig from '@/lib/db';
import Stripe from 'stripe';

const JWT_SECRET = 'your_jwt_secret';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

export async function GET(request: NextRequest) {
  await dbconfig();

  try {
    const token = request.cookies.get('token')?.value || request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const userId = decoded.userId;

    const counselor = await Counselor.findOne({ userId });
    
    if (!counselor || !counselor.stripeAccountId) {
      return NextResponse.json({ 
        onboardingCompleted: false,
        accountStatus: 'pending'
      });
    }

    // Check Stripe account status
    const account = await stripe.accounts.retrieve(counselor.stripeAccountId);
    
    const onboardingCompleted = account.details_submitted && account.charges_enabled;
    const accountStatus = account.charges_enabled ? 'active' : 'pending';

    // Update local database if status changed
    if (counselor.stripeOnboardingCompleted !== onboardingCompleted) {
      await Counselor.findByIdAndUpdate(counselor._id, {
        stripeOnboardingCompleted: onboardingCompleted,
        stripeAccountStatus: accountStatus
      });
    }

    return NextResponse.json({
      onboardingCompleted,
      accountStatus,
      accountId: counselor.stripeAccountId
    });

  } catch (error) {
    console.error('Onboarding status check error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
