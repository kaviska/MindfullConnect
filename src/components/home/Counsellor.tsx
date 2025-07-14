"use client";

import { useState } from "react";
import { Star, MapPin, Calendar, ArrowRight, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Counsellor() {
  const [activeTab, setActiveTab] = useState("all");

  const counselors = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      specialty: "Anxiety & Depression",
      category: "anxiety",
      experience: "8+ years",
      rating: 4.9,
      reviews: 127,
      location: "Licensed Therapist",
      image: "/counselor1.jpg",
      nextAvailable: "Today 2:00 PM",
      price: "$120/session",
    },
    {
      id: 2,
      name: "Dr. Michael Chen",
      specialty: "Relationship Counseling",
      category: "relationships",
      experience: "12+ years",
      rating: 4.8,
      reviews: 89,
      location: "Marriage Therapist",
      image: "/counselor2.jpg",
      nextAvailable: "Tomorrow 10:00 AM",
      price: "$150/session",
    },
    {
      id: 3,
      name: "Dr. Emily Rodriguez",
      specialty: "Trauma & PTSD",
      category: "trauma",
      experience: "10+ years",
      rating: 5.0,
      reviews: 156,
      location: "Trauma Specialist",
      image: "/counselor3.jpg",
      nextAvailable: "Today 4:30 PM",
      price: "$140/session",
    },
  ];

  const categories = [
    { id: "all", label: "All Specialists" },
    { id: "anxiety", label: "Anxiety & Depression" },
    { id: "relationships", label: "Relationships" },
    { id: "trauma", label: "Trauma & PTSD" },
  ];

  const filteredCounselors =
    activeTab === "all"
      ? counselors
      : counselors.filter((c) => c.category === activeTab);

  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4">
            <Users className="h-4 w-4 mr-2" />
            Meet Our Experts
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
            Professional Counselors
            <span className="text-blue-600 block">Ready to Help You</span>
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Our licensed mental health professionals are here to support you
            through every step of your wellness journey with personalized care and
            expertise.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveTab(category.id)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                activeTab === category.id
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-white text-slate-700 border border-slate-200 hover:border-blue-300 hover:text-blue-600"
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Counselors Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {filteredCounselors.map((counselor, index) => (
            <div
              key={counselor.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group transform hover:-translate-y-1"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Counselor Image */}
              <div className="relative h-64 bg-gradient-to-br from-blue-100 to-indigo-100">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">
                      {counselor.name.split(" ").map((n) => n[0]).join("")}
                    </span>
                  </div>
                </div>

                {/* Availability Badge */}
                <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Available
                </div>

                {/* Price Badge */}
                <div className="absolute top-4 right-4 bg-white text-slate-900 px-3 py-1 rounded-full text-sm font-bold">
                  {counselor.price}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Header */}
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-slate-900 mb-1">
                    {counselor.name}
                  </h3>
                  <p className="text-blue-600 font-medium">
                    {counselor.specialty}
                  </p>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="font-medium text-slate-900">
                      {counselor.rating}
                    </span>
                    <span className="text-slate-500 text-sm">
                      ({counselor.reviews})
                    </span>
                  </div>
                  <span className="text-slate-600 text-sm">
                    {counselor.experience}
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-slate-600 text-sm">
                    <MapPin className="h-4 w-4 mr-2" />
                    {counselor.location}
                  </div>
                  <div className="flex items-center text-slate-600 text-sm">
                    <Calendar className="h-4 w-4 mr-2" />
                    Next: {counselor.nextAvailable}
                  </div>
                </div>

                {/* Action Button */}
                <Link
                  href="/session"
                  className="w-full flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium group"
                >
                  Book Session
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            href="/session"
            className="inline-flex items-center px-8 py-4 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors font-semibold text-lg"
          >
            View All Counselors
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
