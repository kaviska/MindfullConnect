'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, CreditCard, ArrowRight } from 'lucide-react';

export default function OnboardedPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verify onboarding completion
    const verifyOnboarding = async () => {
      try {
        const response = await fetch('/api/payment/onboarding-status');
        if (response.ok) {
          const data = await response.json();
          if (data.onboardingCompleted) {
            setLoading(false);
          } else {
            // Redirect back if not completed
            router.push('/counsellor');
          }
        }
      } catch (error) {
        console.error('Error verifying onboarding:', error);
        router.push('/counsellor');
      }
    };

    verifyOnboarding();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying your setup...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="text-green-600" size={40} />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Payment Setup Complete!
        </h1>

        <p className="text-gray-600 mb-8 leading-relaxed">
          Congratulations! Your payment processing is now set up. You can start accepting payments from clients and manage your earnings through your dashboard.
        </p>

        <div className="space-y-4">
          <button
            onClick={() => router.push('/counsellor')}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-6 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg"
          >
            Go to Dashboard
            <ArrowRight size={20} />
          </button>

          <button
            onClick={async () => {
              try {
                const response = await fetch('/api/payment/dashboard-link');
                if (response.ok) {
                  const data = await response.json();
                  window.open(data.url, '_blank');
                }
              } catch (error) {
                console.error('Error opening payment dashboard:', error);
              }
            }}
            className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-xl font-semibold transition-all"
          >
            <CreditCard size={20} />
            View Payment Dashboard
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            You can access your payment dashboard anytime from your counselor dashboard.
          </p>
        </div>
      </div>
    </div>
  );
}
