"use client";

import { useState, useEffect } from "react";
import { Star, MapPin, Calendar, ArrowRight, Users, Loader2 } from "lucide-react";
import Link from "next/link";

interface CounselorData {
  _id: string;
  name: string;
  specialty: string;
  yearsOfExperience: number;
  rating: number;
  reviews: number;
  consultationFee: number;
  bio: string;
  avatar: string;
  status: string;
  therapeuticModalities: string[];
  languagesSpoken: string[];
  availabilityType: string;
}

export default function Counsellor() {
  const [activeTab, setActiveTab] = useState("all");
  const [counselors, setCounselors] = useState<CounselorData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const categories = [
    { id: "all", label: "All Specialists" },
    { id: "anxiety", label: "Anxiety & Depression" },
    { id: "relationships", label: "Relationship Counseling" },
    { id: "trauma", label: "Trauma & PTSD" },
    { id: "addiction", label: "Addiction Recovery" },
    { id: "family", label: "Family Therapy" },
  ];

  useEffect(() => {
    fetchCounselors();
  }, []);

  const fetchCounselors = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/counselors/featured');
      
      if (!response.ok) {
        throw new Error('Failed to fetch counselors');
      }
      
      const data = await response.json();
      setCounselors(data.counselors || []);
    } catch (err) {
      console.error('Error fetching counselors:', err);
      setError('Failed to load counselors');
    } finally {
      setLoading(false);
    }
  };

  const filteredCounselors = activeTab === "all" 
    ? counselors 
    : counselors.filter(c => 
        c.specialty?.toLowerCase().includes(activeTab.toLowerCase()) ||
        c.therapeuticModalities?.some(mod => 
          mod.toLowerCase().includes(activeTab.toLowerCase())
        )
      );

  const formatPrice = (fee: number) => {
    return fee > 0 ? `$${fee}/session` : 'Contact for pricing';
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (loading) {
    return (
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-slate-600">Loading our amazing counselors...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={fetchCounselors}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4">
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
        {filteredCounselors.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-600 text-lg">No counselors found for this category.</p>
            <button 
              onClick={() => setActiveTab("all")}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              View All Counselors
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {filteredCounselors.slice(0, 6).map((counselor, index) => (
              <div
                key={counselor._id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group transform hover:-translate-y-1"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Counselor Image */}
                <div className="relative h-64 bg-gradient-to-br from-blue-100 to-indigo-100">
                  <div className="absolute inset-0 flex items-center justify-center">
                    {counselor.avatar && counselor.avatar !== "/default-avatar.png" ? (
                      <img 
                        src={counselor.avatar} 
                        alt={counselor.name}
                        className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                      />
                    ) : (
                      <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                        <span className="text-2xl font-bold text-white">
                          {getInitials(counselor.name)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Status Badge */}
                  <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-medium ${
                    counselor.status === 'active' 
                      ? 'bg-green-500 text-white' 
                      : 'bg-yellow-500 text-white'
                  }`}>
                    {counselor.status === 'active' ? 'Available' : 'Busy'}
                  </div>

                  {/* Price Badge */}
                  <div className="absolute top-4 right-4 bg-white text-slate-900 px-3 py-1 rounded-full text-sm font-bold">
                    {formatPrice(counselor.consultationFee)}
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
                      {counselor.specialty || 'General Counseling'}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="font-medium text-slate-900">
                        {counselor.rating || 4.8}
                      </span>
                      <span className="text-slate-500 text-sm">
                        ({counselor.reviews || 0})
                      </span>
                    </div>
                    <span className="text-slate-600 text-sm">
                      {counselor.yearsOfExperience || 5}+ years
                    </span>
                  </div>

                  {/* Details */}
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center text-slate-600 text-sm">
                      <MapPin className="h-4 w-4 mr-2" />
                      {counselor.availabilityType === 'online' ? 'Online Sessions' : 
                       counselor.availabilityType === 'in-person' ? 'In-Person' : 'Online & In-Person'}
                    </div>
                    {counselor.languagesSpoken && counselor.languagesSpoken.length > 0 && (
                      <div className="flex items-center text-slate-600 text-sm">
                        <Calendar className="h-4 w-4 mr-2" />
                        Speaks: {counselor.languagesSpoken.slice(0, 2).join(', ')}
                      </div>
                    )}
                  </div>

                  {/* Bio Preview */}
                  {counselor.bio && (
                    <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                      {counselor.bio.length > 100 
                        ? `${counselor.bio.substring(0, 100)}...` 
                        : counselor.bio}
                    </p>
                  )}

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
        )}

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
