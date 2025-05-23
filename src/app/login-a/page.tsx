'use client';

import Image from 'next/image';
import React, { useState,useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';
export default function LoginPage() {
  const router = useRouter();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const onLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission
    try {
      setLoading(true);
      const response = await axios.post("/api/users/login", user);
      console.log("Login success", response.data);
      toast.success("Login successful!");

      const userId = response.data?.user?.id;
        if (userId) {
        localStorage.setItem("userId", userId);
        }

      router.push("/profile");
    } catch (error: any) {
      console.error("Login failed", error);
      const errorMessage = error.response?.data?.error || error.message;
      toast.error(errorMessage || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setButtonDisabled(!(user.email && user.password));
  }, [user]);
  
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

          <form className="space-y-6" onSubmit={onLogin}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={user.email}
                onChange={(e)=>setUser({...user,email:e.target.value})}
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
                  value={user.password}
                  onChange={(e)=>setUser({...user,password:e.target.value})}
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
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-3xl shadow-sm bg hover:bg-blue-700"
            >
              Login
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