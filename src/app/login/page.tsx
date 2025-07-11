'use client';

import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';
import { GoogleLogin } from '@react-oauth/google';

export default function LoginPage() {
  const router = useRouter();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({
    email: '',
    password: '',
  });

  const onLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post('/api/users/login', user);
      console.log('Login success', response.data);
      toast.success('Login successful!');
      setTimeout(() => router.push(`/profile/${response.data.user.id}`), 1000);
    } catch (error: any) {
      console.error('Login failed', error);
      const errorMessage = error.response?.data?.error || error.message;
      toast.error(errorMessage || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const onGoogleSuccess = async (credentialResponse: any) => {
    try {
      setLoading(true);
      const response = await axios.post('/api/users/google-auth', {
        idToken: credentialResponse.credential,
      });
      console.log('Google login success', response.data);
      toast.success('Login successful!');
      setTimeout(() => router.push(`/profile/${response.data.user.id}`), 1000);
    } catch (error: any) {
      console.error('Google login failed', error);
      const errorMessage = error.response?.data?.error || 'Google login failed. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const onGoogleError = () => {
    console.error('Google login failed');
    toast.error('Google login failed. Please try again.');
  };

  useEffect(() => {
    setButtonDisabled(!(user.email && user.password));
  }, [user]);

  const togglePasswordVisibility = () => {
    setPasswordVisible((prevState) => !prevState);
  };

  return (
    <div className="flex h-screen">
      <div
        className="w-1/2 bg-blue-100 flex items-center justify-center"
        style={{
          backgroundImage: 'url(/fa6bcf6b949547c06f42950b66bfe3af.jpg)',
          backgroundSize: 'cover',
          width: '850px',
        }}
      ></div>

      <div className="w-1/2 flex flex-col justify-center items-center bg-white text-slate-500">
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => router.push('/')}
            className="w-full ml-80 mt-4 py-2 px-6 bg-blue-600 text-white rounded-3xl shadow-sm hover:bg-blue-700"
          >
            Back
          </button>
        </div>
        <div className="w-full max-w-md px-6 py-12">
          <h1 className="text-4xl font-semibold mb-14 mt-6 text-blue-500">MindfulConnect</h1>
          <h2 className="text-xl font-semibold mb-6 text-slate-700">Nice to see you again!</h2>

          <form className="space-y-6" onSubmit={onLogin}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                placeholder="Email or phone number"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  type={passwordVisible ? 'text' : 'password'}
                  id="password"
                  value={user.password}
                  onChange={(e) => setUser({ ...user, password: e.target.value })}
                  placeholder="Enter password"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 px-3 py-2 text-sm text-gray-500 focus:outline-none"
                >
                  {passwordVisible ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.98 8.223a12.042 12.042 0 0116.042 0m-1.26 5.914a3.5 3.5 0 10-4.924-4.924m2.477 3.885a6.5 6.5 0 01-10.254-.847M4.493 13.128a12.042 12.042 0 0115.015 0"
                      />
                      <line x1="3" y1="21" x2="21" y2="3" stroke="currentColor" strokeWidth={1.5} />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 4.5c7.732 0 11.19 5.965 11.19 5.965S19.732 16.5 12 16.5 0.81 10.465 0.81 10.465 4.268 4.5 12 4.5z"
                      />
                      <circle cx="12" cy="10.5" r="3" fill="currentColor" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center text-sm text-gray-600">
                <input type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500" />
                <span className="ml-2">Remember me</span>
              </label>
              <a href="#" className="text-sm text-blue-600 hover:underline">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={buttonDisabled || loading}
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-3xl shadow-sm hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <hr className="border-t-2 border-gray-300 my-4 mt-8" />

          <div className="mt-8">
            <GoogleLogin
              onSuccess={onGoogleSuccess}
              onError={onGoogleError}
              text="signin_with"
              theme="filled_blue"
              shape="pill"
              disabled={loading}
            />
          </div>

          <div className="mt-14 text-center text-sm text-black">
            Don’t have an account?{' '}
            <a href="/signup" className="text-blue-500 hover:underline">
              Sign up now
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}