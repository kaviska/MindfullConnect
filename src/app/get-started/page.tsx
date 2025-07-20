// ✅ Create src/app/get-started/page.tsx
"use client";
import React from 'react';
import Link from 'next/link';
import { ArrowRight, Heart, Shield, Users, CheckCircle, Star, MessageCircle, Calendar } from 'lucide-react';
import Footer from '@/components/home/Footer';

const GetStartedPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 relative overflow-hidden">
      {/* ✅ Soft Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-green-100 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-float-delayed"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse"></div>
      </div>

      <div className="relative z-10">
        {/* ✅ Hero Section */}
        <section className="container mx-auto px-4 py-20 text-center">
          <div className="max-w-4xl mx-auto">
            {/* Welcome Badge */}
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-blue-200 text-blue-700 px-6 py-3 rounded-full text-sm font-medium mb-8 shadow-lg">
              <Heart className="w-4 h-4 text-red-500" />
              Welcome to Your Mental Health Journey
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                Take the First Step
              </span>
              <br />
              <span className="text-gray-700">Towards Wellness</span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Connect with licensed therapists, join supportive communities, and begin your personalized path to mental wellness in a safe, confidential environment.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <Link
                href="/signup"
                className="group bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center gap-3 min-w-[200px] justify-center"
              >
                Create Account
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link
                href="/login"
                className="group bg-white/90 backdrop-blur-sm border-2 border-blue-200 hover:border-blue-300 text-blue-700 px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center gap-3 min-w-[200px] justify-center"
              >
                Sign In
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-500" />
                HIPAA Compliant
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Licensed Therapists
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-green-500" />
                50,000+ Users
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-500" />
                4.9/5 Rating
              </div>
            </div>
          </div>
        </section>

        {/* ✅ How It Works Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Simple Steps to Get Started</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Beginning your mental health journey is easy and confidential
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Step 1 */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 text-center group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Create Your Account</h3>
              <p className="text-gray-600 leading-relaxed">
                Sign up in minutes with our secure registration process. Your privacy and confidentiality are our top priorities.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 text-center group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 md:mt-8">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Match with a Therapist</h3>
              <p className="text-gray-600 leading-relaxed">
                Answer a few questions to help us match you with the perfect licensed therapist who understands your needs.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 text-center group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Start Your Sessions</h3>
              <p className="text-gray-600 leading-relaxed">
                Begin your therapy sessions through secure video calls, chat, or phone - whatever feels most comfortable for you.
              </p>
            </div>
          </div>
        </section>

        {/* ✅ Benefits Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">Why Choose MindfulConnect?</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                We're committed to making mental healthcare accessible, affordable, and effective
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: Shield,
                  title: "100% Confidential",
                  description: "Your privacy is protected with end-to-end encryption and HIPAA compliance.",
                  color: "blue"
                },
                {
                  icon: Users,
                  title: "Licensed Therapists",
                  description: "All our therapists are licensed, vetted, and experienced professionals.",
                  color: "green"
                },
                {
                  icon: Calendar,
                  title: "Flexible Scheduling",
                  description: "Book sessions that fit your schedule, including evenings and weekends.",
                  color: "purple"
                },
                {
                  icon: Heart,
                  title: "Personalized Care",
                  description: "Treatment plans tailored specifically to your unique needs and goals.",
                  color: "pink"
                }
              ].map((benefit, index) => (
                <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 text-center group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className={`w-12 h-12 bg-gradient-to-r from-${benefit.color}-500 to-${benefit.color}-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <benefit.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-800 mb-2">{benefit.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ✅ Testimonial Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl p-12 text-center text-white shadow-2xl">
              <div className="flex justify-center mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                ))}
              </div>
              <blockquote className="text-2xl font-medium mb-6 leading-relaxed">
                "MindfulConnect changed my life. The convenience of online therapy combined with truly caring professionals made all the difference in my mental health journey."
              </blockquote>
              <cite className="text-blue-100 font-medium">- Sarah M., Verified User</cite>
            </div>
          </div>
        </section>

        {/* ✅ Final CTA Section */}
        <section className="container mx-auto px-4 py-20 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">Ready to Begin Your Journey?</h2>
            <p className="text-xl text-gray-600 mb-10 leading-relaxed">
              Take the first step towards better mental health today. Your future self will thank you.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link
                href="/signup"
                className="group bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-10 py-5 rounded-2xl font-bold text-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center gap-3"
              >
                Start Free Today
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link
                href="/login"
                className="group text-blue-600 hover:text-blue-700 font-semibold text-lg flex items-center gap-2 transition-colors"
              >
                Already have an account? Sign in
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <p className="text-sm text-gray-500 mt-8">
              No credit card required • 7-day free trial • Cancel anytime
            </p>
          </div>
        </section>
      </div>

      {/* ✅ Footer */}
      <Footer />

      {/* ✅ Custom Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-3deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
};

export default GetStartedPage;