'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react'

function VerifyOtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  useEffect(() => {
    if (!email) {
      setError("Email not found. Please go back to signup.");
    }
  }, [email]);

  const handleVerify = async () => {
    if (!otp) {
      setError('Please enter the OTP.');
      return;
    }

    setLoading(true);
    setError('');
    setInfo('');

    const res = await fetch('/api/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await res.json();

    if (res.ok) {
      setInfo('OTP verified successfully. Redirecting...');
      setTimeout(() => {
        router.push('/patient'); // Redirect to login or dashboard
      }, 1500);
    } else {
      setError(data.error || 'Invalid OTP');
    }

    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center text-blue-500">Verify Your Email</h2>
        <p className="text-sm mb-4 text-center">
          An OTP has been sent to <strong>{email || '[no email]'}</strong>.
        </p>

        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full border px-4 py-2 rounded-md mb-4"
        />

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        {info && <p className="text-green-600 text-sm mb-2">{info}</p>}

        <button
          onClick={handleVerify}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Verifying...' : 'Verify OTP'}
        </button>
      </div>
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyOtpContent />
    </Suspense>
  );
}