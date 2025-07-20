// ✅ Create src/app/about/page.tsx
"use client";
import React from 'react';
import Link from 'next/link';
import { Heart, Shield, Users, Award, CheckCircle, Star, ArrowRight, Target, Globe, Lightbulb } from 'lucide-react';
import Footer from '@/components/home/Footer';
import Image from 'next/image';

const AboutPage = () => {
  const teamMembers = [
    {
      name: "Dr. Sarah Johnson",
      role: "Founder & Chief Clinical Officer",
      image: "/team/sarah.jpg", // You'll need to add actual images
      bio: "Licensed Clinical Psychologist with 15+ years of experience in digital mental health.",
      credentials: "PhD, Licensed Clinical Psychologist"
    },
    {
      name: "Michael Chen",
      role: "CEO & Co-Founder",
      image: "/team/michael.jpg",
      bio: "Former healthcare executive passionate about making mental health accessible to everyone.",
      credentials: "MBA, Former Healthcare Executive"
    },
    {
      name: "Dr. Emily Rodriguez",
      role: "Head of Clinical Excellence",
      image: "/team/emily.jpg",
      bio: "Specializes in anxiety disorders and has trained over 200 therapists in digital platforms.",
      credentials: "PhD, LCSW, Anxiety Specialist"
    },
    {
      name: "David Park",
      role: "Chief Technology Officer",
      image: "/team/david.jpg",
      bio: "Security expert ensuring your data remains private and protected with cutting-edge encryption.",
      credentials: "MS Computer Science, Security Expert"
    }
  ];

  const stats = [
    { number: "50,000+", label: "Lives Touched", icon: Heart },
    { number: "500+", label: "Licensed Therapists", icon: Users },
    { number: "98%", label: "User Satisfaction", icon: Star },
    { number: "24/7", label: "Support Available", icon: Shield }
  ];

  const values = [
    {
      icon: Heart,
      title: "Compassionate Care",
      description: "We believe everyone deserves access to mental health support with dignity and understanding."
    },
    {
      icon: Shield,
      title: "Privacy First",
      description: "Your trust is sacred. We protect your data with military-grade encryption and HIPAA compliance."
    },
    {
      icon: Users,
      title: "Community Driven",
      description: "Building supportive communities where individuals can heal and grow together."
    },
    {
      icon: Target,
      title: "Evidence-Based",
      description: "All our treatments are grounded in scientific research and proven therapeutic methods."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
      {/* ✅ Soft Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-float-delayed"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse"></div>
      </div>

      <div className="relative z-10">
        {/* ✅ Hero Section */}
        <section className="container mx-auto px-4 py-20 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-blue-200 text-blue-700 px-6 py-3 rounded-full text-sm font-medium mb-8 shadow-lg">
              <Heart className="w-4 h-4 text-red-500" />
              Our Story & Mission
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-8 leading-tight">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                Revolutionizing
              </span>
              <br />
              <span className="text-gray-700">Mental Healthcare</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              We're on a mission to make quality mental health care accessible, affordable, and stigma-free for everyone, everywhere.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                  <stat.icon className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                  <div className="text-3xl font-bold text-gray-800 mb-1">{stat.number}</div>
                  <div className="text-gray-600 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ✅ Our Story Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold text-gray-800 mb-6">Our Story</h2>
                <div className="space-y-6 text-gray-600 leading-relaxed">
                  <p className="text-lg">
                    MindfulConnect was born from a simple yet powerful realization: traditional mental healthcare was failing too many people. Long wait times, high costs, and stigma were preventing millions from getting the help they deserved.
                  </p>
                  <p>
                    In 2020, our founders - a clinical psychologist and a healthcare technology expert - came together with a shared vision: to create a platform that would democratize access to quality mental health care.
                  </p>
                  <p>
                    Today, we're proud to have helped over 50,000 individuals on their mental health journey, connecting them with licensed therapists through our secure, user-friendly platform.
                  </p>
                </div>
              </div>
              <div className="relative">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl p-8 text-white shadow-2xl">
                  <div className="text-center">
                    <Globe className="w-16 h-16 mx-auto mb-6 opacity-80" />
                    <h3 className="text-2xl font-bold mb-4">Global Impact</h3>
                    <p className="text-blue-100 leading-relaxed">
                      From our headquarters to users worldwide, we're building a global community focused on mental wellness and support.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ✅ Our Values Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Core Values</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                These principles guide everything we do and every decision we make
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <div key={index} className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 text-center group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <value.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ✅ Team Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">Meet Our Leadership Team</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Passionate experts dedicated to transforming mental healthcare
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map((member, index) => (
                <div key={index} className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20 text-center group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="w-24 h-24 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white font-bold text-2xl">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-1">{member.name}</h3>
                  <p className="text-blue-600 font-medium text-sm mb-2">{member.role}</p>
                  <p className="text-gray-600 text-sm mb-3 leading-relaxed">{member.bio}</p>
                  <p className="text-xs text-gray-500 font-medium">{member.credentials}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ✅ Mission & Vision Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Mission */}
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-3xl p-10 text-white shadow-2xl">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <Target className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold">Our Mission</h3>
                </div>
                <p className="text-blue-100 leading-relaxed text-lg">
                  To democratize access to quality mental healthcare by connecting individuals with licensed therapists through secure, convenient, and affordable online platforms that prioritize privacy and effectiveness.
                </p>
              </div>

              {/* Vision */}
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-3xl p-10 text-white shadow-2xl">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <Lightbulb className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold">Our Vision</h3>
                </div>
                <p className="text-purple-100 leading-relaxed text-lg">
                  A world where mental health support is as accessible as physical healthcare, where stigma is eliminated, and where everyone has the tools and support they need to thrive mentally and emotionally.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ✅ Recognition Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">Recognition & Awards</h2>
              <p className="text-xl text-gray-600">Honored to be recognized for our commitment to mental health</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  award: "Best Digital Health Platform 2023",
                  organization: "Healthcare Innovation Awards",
                  year: "2023"
                },
                {
                  award: "Top Mental Health App",
                  organization: "App Store Awards",
                  year: "2023"
                },
                {
                  award: "Excellence in Patient Care",
                  organization: "National Healthcare Association",
                  year: "2022"
                }
              ].map((recognition, index) => (
                <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 text-center">
                  <Award className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                  <h3 className="font-bold text-gray-800 mb-2">{recognition.award}</h3>
                  <p className="text-gray-600 text-sm mb-1">{recognition.organization}</p>
                  <p className="text-blue-600 font-medium">{recognition.year}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ✅ CTA Section */}
        <section className="container mx-auto px-4 py-20 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">Join Our Mission</h2>
            <p className="text-xl text-gray-600 mb-10 leading-relaxed">
              Whether you're seeking support or want to provide it, you can be part of the mental health revolution.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link
                href="/get-started"
                className="group bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center gap-3"
              >
                Get Started Today
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link
                href="/counsellor"
                className="group bg-white/90 backdrop-blur-sm border-2 border-blue-200 hover:border-blue-300 text-blue-700 px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center gap-3"
              >
                Join as Therapist
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
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

export default AboutPage;