"use client";

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function PaymentSuccess() {
  const router = useRouter();

  useEffect(() => {
    // Clear the stored amount from localStorage since payment is successful
    localStorage.removeItem("amount");
  }, []);

  const handleGoToDashboard = () => {
    router.push('/patient');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center px-4">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8 text-center">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        {/* Success Message */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Successful!</h1>
        <p className="text-gray-600 mb-2">
          Your payment has been processed successfully.
        </p>
        <p className="text-gray-600 mb-8">
          Your session has been confirmed and you will receive a confirmation email shortly.
        </p>

        {/* Success Details */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
          <div className="flex items-center justify-center">
            <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-green-800 font-medium">Session Booking Confirmed</p>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleGoToDashboard}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-100 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          Go to Patient Dashboard
        </button>

        {/* Additional Info */}
        <div className="mt-6 pt-6 border-t border-gray-100">
          <p className="text-sm text-gray-500">
            You can view your upcoming sessions and manage your appointments in your dashboard.
          </p>
        </div>
      </div>
    </div>
  );
}
