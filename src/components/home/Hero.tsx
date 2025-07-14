"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Shield, Clock, Users, Star } from "lucide-react";

export default function Hero() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    { text: "Life-changing therapy sessions", author: "Sarah M.", rating: 5 },
    { text: "Professional and caring counselors", author: "John D.", rating: 5 },
    { text: "Convenient online sessions", author: "Emily R.", rating: 5 },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const stats = [
    { icon: Users, value: "1000+", label: "Happy Clients" },
    { icon: Shield, value: "100%", label: "Confidential" },
    { icon: Clock, value: "24/7", label: "Support" },
  ];

  return (
    <section className="relative min-h-screen flex items-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 pt-20">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-5" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse" />
              Trusted Mental Health Platform
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight mb-6">
              Your Mental
              <span className="text-blue-600 block">Wellness Journey</span>
              Starts Here
            </h1>

            {/* Description */}
            <p className="text-lg sm:text-xl text-slate-600 mb-8 max-w-xl mx-auto lg:mx-0">
              Connect with certified mental health professionals. Get personalized 
              counseling sessions designed to help you thrive and overcome life's challenges.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link
                href="/session"
                className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-300 font-semibold text-lg group transform hover:scale-105"
              >
                Book Your Session
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-slate-300 text-slate-700 rounded-xl hover:border-blue-600 hover:text-blue-600 transition-all duration-300 font-semibold text-lg"
              >
                Learn More
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 max-w-md mx-auto lg:mx-0">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="flex justify-center mb-2">
                    <stat.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                  <div className="text-sm text-slate-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Visual Content */}
          <div className="relative">
            {/* Main Image Container */}
            <div className="relative bg-gradient-to-br from-blue-100 to-indigo-100 rounded-3xl p-8 lg:p-12">
              {/* Floating Cards */}
              <div className="absolute -top-6 -left-6 bg-white rounded-2xl shadow-lg p-4 transform rotate-3 hover:rotate-0 transition-transform">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                  <span className="text-sm font-medium">Online Session</span>
                </div>
              </div>

              <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-lg p-4 transform -rotate-3 hover:rotate-0 transition-transform">
                <div className="flex items-center space-x-2">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-medium">5.0 Rating</span>
                </div>
              </div>

              {/* Center Content */}
              <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                <div className="w-20 h-20 bg-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  Professional Counselors
                </h3>
                <p className="text-slate-600 mb-4">
                  Licensed therapists ready to help
                </p>
                
                {/* Testimonial Carousel */}
                <div className="bg-slate-50 rounded-lg p-4">
                  <div className="flex justify-center mb-2">
                    {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-500 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm text-slate-700 italic mb-2">
                    "{testimonials[currentTestimonial].text}"
                  </p>
                  <p className="text-xs text-slate-500">
                    - {testimonials[currentTestimonial].author}
                  </p>
                </div>
              </div>
            </div>

            {/* Background Decorations */}
            <div className="absolute -z-10 top-10 right-10 w-32 h-32 bg-blue-200 rounded-full opacity-20 animate-pulse" />
            <div className="absolute -z-10 bottom-10 left-10 w-24 h-24 bg-indigo-200 rounded-full opacity-20 animate-pulse delay-1000" />
          </div>
        </div>
      </div>
    </section>
  );
}