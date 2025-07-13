'use client';

import { useRouter } from 'next/navigation';
import { Clock, Mail, Home } from 'lucide-react';

export default function PendingApproval() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            <Clock className="mx-auto h-12 w-12 text-yellow-500" />
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Account Pending Approval
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Your counselor account is currently under review
            </p>
          </div>

          <div className="mt-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <div className="flex">
                <Mail className="h-5 w-5 text-yellow-400" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">
                    Review in Progress
                  </h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>
                      We're reviewing your counselor application. This typically takes 1-3 business days.
                      You'll receive an email once your account is approved.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <button
              onClick={() => router.push('/')}
              className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              <Home className="h-4 w-4 mr-2" />
              Return to Home
            </button>
            
            <button
              onClick={handleLogout}
              className="w-full flex justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
