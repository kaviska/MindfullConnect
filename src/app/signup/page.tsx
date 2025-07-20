"use client";

import Toast from "@/components/main/Toast";
import { useToast } from "@/contexts/ToastContext";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Heart, Star, CheckCircle } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const { toast, setToast } = useToast();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({
    email: "",
    password: "",
    fullName: "",
    role: "User",
  });

  useEffect(() => {
    setButtonDisabled(!(user.email && user.password && user.fullName));
  }, [user]);

  const onSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post("/api/auth/register", user);
      console.log("Signup success", response.data);

      setToast({
        open: true,
        message: "Account created successfully! Please verify your email.",
        type: "success",
      });

      // Store token in localStorage if needed for client-side access
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }

      // Redirect based on role and verification status
      setTimeout(() => {
        if (response.data?.user?.role === "counselor") {
          router.push("/counsellor-register");
        } else {
          router.push(`/verify-otp?email=${user.email}`);
        }
      }, 1500);
    } catch (error: any) {
      // ...existing error handling...
      let errorMessage = "Signup failed";

      console.log("🔍 Error details:");
      console.log("  - Full error:", error);
      console.log("  - Response:", error.response);
      console.log("  - Response data:", error.response?.data);
      console.log("  - Response status:", error.response?.status);

      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
        console.log("✅ Using API error:", errorMessage);
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
        console.log("✅ Using API message:", errorMessage);
      } else if (error.message) {
        errorMessage = error.message;
        console.log("✅ Using axios error:", errorMessage);
      }

      console.log("📋 Setting toast with message:", errorMessage);

      setToast({
        open: true,
        message: errorMessage,
        type: "error",
      });

      setTimeout(() => {
        console.log("🍞 Toast should be showing with:", errorMessage);
      }, 100);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginRedirect = () => {
    setToast({
      open: false,
      message: "",
      type: "success",
    });
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex">
      <Toast open={toast.open} message={toast.message} type={toast.type} />

      {/* Left Panel - Features and Brand */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-purple-600 via-blue-600 to-blue-700 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-16 w-24 h-24 bg-white rounded-full animate-pulse"></div>
          <div className="absolute top-40 right-24 w-16 h-16 bg-white rounded-full animate-pulse delay-1000"></div>
          <div className="absolute bottom-32 left-24 w-20 h-20 bg-white rounded-full animate-pulse delay-2000"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center items-center text-white p-12 w-full">
          <div className="max-w-md text-center">
            <div className="mb-8">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Heart className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl font-bold mb-4">Join Our Community</h1>
              <p className="text-blue-100 text-lg leading-relaxed">
                Start your journey towards better mental health with professional support and a caring community.
              </p>
            </div>
            
            {/* Benefits */}
            <div className="space-y-4 text-left">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-300" />
                <span className="text-blue-100">Free initial consultation</span>
              </div>
              <div className="flex items-center space-x-3">
                <Star className="w-5 h-5 text-yellow-300" />
                <span className="text-blue-100">Licensed professionals</span>
              </div>
              <div className="flex items-center space-x-3">
                <Heart className="w-5 h-5 text-pink-300" />
                <span className="text-blue-100">Personalized care plans</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative Image */}
        <div 
          className="absolute inset-0 opacity-20 bg-cover bg-center"
          style={{ backgroundImage: 'url(/fa6bcf6b949547c06f42950b66bfe3af.jpg)' }}
        ></div>
      </div>

      {/* Right Panel - Signup Form */}
      <div className="w-full lg:w-1/2 flex flex-col bg-white">
        {/* Header */}
        <div className="flex justify-between items-center p-6">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            MindfulConnect
          </Link>
          <Link href="/">
            <button className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors">
              ← Back to Home
            </button>
          </Link>
        </div>

        {/* Signup Form */}
        <div className="flex-1 flex items-center justify-center px-6 py-8">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
              <p className="text-gray-600">Join us on your path to wellness and healing</p>
            </div>

            <form className="space-y-6" onSubmit={onSignup}>
              {/* Full Name Field */}
              <div className="space-y-2">
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="fullName"
                    value={user.fullName}
                    onChange={(e) => setUser({ ...user, fullName: e.target.value })}
                    placeholder="Enter your full name"
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    value={user.email}
                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                    placeholder="Enter your email"
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={passwordVisible ? "text" : "password"}
                    id="password"
                    value={user.password}
                    onChange={(e) => setUser({ ...user, password: e.target.value })}
                    placeholder="Create a strong password"
                    className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {passwordVisible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Role Selection */}
              <div className="space-y-2">
                <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                  I want to register as
                </label>
                <select
                  id="role"
                  value={user.role}
                  onChange={(e) => setUser({ ...user, role: e.target.value })}
                  className="block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="User">User (Seeking Support)</option>
                  <option value="counselor">Counselor (Providing Support)</option>
                </select>
                {user.role === "counselor" && (
                  <p className="text-xs text-blue-600 mt-1">
                    📋 Counselors will need to complete additional verification steps
                  </p>
                )}
              </div>

              {/* Terms Agreement */}
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                  required
                />
                <span className="text-sm text-gray-600 leading-relaxed">
                  I agree to the{' '}
                  <Link href="#" className="text-blue-600 hover:text-blue-500 font-medium">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="#" className="text-blue-600 hover:text-blue-500 font-medium">
                    Privacy Policy
                  </Link>
                </span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={buttonDisabled || loading}
                className={`w-full flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-lg text-white transition-all duration-200 ${
                  buttonDisabled || loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg transform hover:-translate-y-0.5"
                }`}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>
            </div>

            {/* Google Sign Up */}
            <div className="mt-6">
              <button className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-700 hover:bg-gray-50 hover:shadow-md transition-all duration-200">
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Sign up with Google
              </button>
            </div>

            {/* Login Link */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <button
                  onClick={handleLoginRedirect}
                  className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                >
                  Sign in here
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
