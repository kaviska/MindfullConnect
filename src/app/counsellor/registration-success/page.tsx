'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, CreditCard, ArrowRight, AlertTriangle, Home } from 'lucide-react';

export default function RegistrationSuccessPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSetupPayment = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/payment/create-onboarding-link', {
        method: 'POST'
      });
      
      if (response.ok) {
        const data = await response.json();
        window.location.href = data.url;
      } else {
        throw new Error('Failed to create onboarding link');
      }
    } catch (error) {
      console.error('Error creating onboarding link:', error);
      alert('Error setting up payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleContinueToDashboard = () => {
    router.push('/counsellor');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 py-8">
      <div className="max-w-2xl mx-auto px-6">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="bg-green-100 p-4 rounded-full">
              <CheckCircle className="text-green-600" size={64} />
            </div>
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Profile Created Successfully! 🎉
          </h1>
          <p className="text-gray-600 text-lg mb-8">
            Welcome to MindfullConnect! Your counselor profile has been created and is ready to help clients.
          </p>

          {/* Important Notice */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
            <div className="flex items-start">
              <AlertTriangle className="text-yellow-600 mt-1 mr-3" size={24} />
              <div className="text-left">
                <h3 className="font-semibold text-yellow-800 mb-2">Important Notice</h3>
                <p className="text-yellow-700 text-sm">
                  To start accepting paid counseling sessions, you need to complete your bank account setup. 
                  You can browse the dashboard but won't be able to conduct paid sessions until payment details are verified.
                </p>
              </div>
            </div>
          </div>

          {/* Action Options */}
          <div className="space-y-4">
            <button
              onClick={handleSetupPayment}
              disabled={loading}
              className={`w-full py-4 px-6 rounded-xl text-white font-semibold text-lg ${
                loading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 transform hover:scale-105 transition-all'
              } shadow-lg flex items-center justify-center`}
            >
              <CreditCard className="mr-3" size={24} />
              {loading ? 'Setting up...' : 'Setup Bank Account & Payment Details'}
              <ArrowRight className="ml-3" size={20} />
            </button>

            <button
              onClick={handleContinueToDashboard}
              className="w-full py-4 px-6 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold text-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
            >
              <Home className="mr-3" size={24} />
              Continue to Dashboard
              <span className="ml-2 text-sm text-gray-500">(Setup payment later)</span>
            </button>
          </div>

          {/* Additional Info */}
          <div className="mt-8 text-sm text-gray-500">
            <p>You can always setup payment details later from your dashboard.</p>
            <p className="mt-2">Need help? Contact our support team anytime.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
