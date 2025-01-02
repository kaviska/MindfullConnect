'use client';

import Image from 'next/image';
import React, { useState } from 'react';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

export default function LoginPage() {
  const [passwordVisible, setPasswordVisible] = useState(false);

  //password visibility
  const togglePasswordVisibility = () => {
    setPasswordVisible(prevState => !prevState);
  };

  return (
    <div className="flex h-screen">

      {/* Login page image box */}
      <div
        className="w-1/2 bg-blue-100 flex items-center justify-center"
        style={{ backgroundImage: 'url(/fa6bcf6b949547c06f42950b66bfe3af.jpg)', backgroundSize: 'cover', width: '850px'}}
      >
      </div>

      {/* credentials section */}
      <div className="w-1/2 flex flex-col justify-center items-center bg-white text-slate-500">
        <div className='flex justify-end'>
          <button
            type="submit"
            className="w-full ml-80 mt-4 py-2 px-6 bg-blue-600 text-white rounded-3xl shadow-sm bg hover:bg-blue-700"
          >
            Back
          </button>
        </div>
        <div className="w-full max-w-md px-6 py-12">
        <h1 className="text-4xl font-semibold mb-14 mt-6 text-blue-500">MindfulConnect</h1>
          <h2 className="text-xl font-semibold mb-6 text-slate-700">Nice to see you again!</h2>

          <form className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Login
              </label>
              <input
                type="email"
                id="email"
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
                  type={passwordVisible ? "text" : "password"} //password to text
                  id="password"
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
                    <VisibilityOffIcon className="w-5 h-5" />
                  ) : (
                    <VisibilityIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center text-sm text-gray-600">
                <input type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500" />
                <span className="ml-2">Remember me</span>
              </label>
              <a href="#" className="text-sm text-blue-500 hover:underline">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-3xl shadow-sm bg hover:bg-blue-800"
            >
              Sign in
            </button>
          </form>

          <hr className="border-t-2 border-gray-300 my-4 mt-8" />

          <div className="mt-8">
            <button className="w-full py-2 px-4 bg-gray-100 text-gray-700 rounded-3xl shadow-sm flex items-center justify-center hover:bg-gray-200">
              <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="35" height="20" viewBox="0 0 48 48">
                <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
              </svg>
              Sign in with Google
            </button>
          </div>

          <div className="mt-14 text-center text-sm text-black">
            Don’t have an account? <a href="/register" className="text-blue-500 hover:underline">Sign up now</a>
          </div>
        </div>
      </div>
    </div>
  );
}
