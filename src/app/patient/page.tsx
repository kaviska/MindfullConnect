"use client";

import React, { useState, useEffect } from 'react';
import {
  Heart,
  Calendar,
  MessageSquare, 
  TrendingUp, 
  Star, 
  Clock, 
  Users,
  Plus,
  MapPin,
  ArrowRight,
  Loader2
} from 'lucide-react';
import Link from 'next/link';

// Types
interface Counselor {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  imageUrl: string;
  specialty?: string;
  specialization?: string;
  yearsOfExperience?: number;
  rating?: number;
  reviews?: number;
  consultationFee?: number;
  bio?: string;
  qualifications?: string;
  status?: string;
  isActive?: boolean;
  therapeuticModalities?: string[];
  languagesSpoken?: string[];
  availabilityType?: string;
  description?: string;
}

interface ApiResponse {
  success?: boolean;
  users?: Counselor[];
  counselors?: Counselor[];
  total?: number;
  totalPages?: number;
}

const PatientDashboard = () => {
  const [counselors, setCounselors] = useState<Counselor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch counselors on component mount
  useEffect(() => {
    fetchCounselors();
  }, []);

  const fetchCounselors = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try to use the working API endpoint that shows counsellors
      const response = await fetch('/admind/api/counsellors/active?page=1&q=');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: ApiResponse = await response.json();
      
      if (data.users && Array.isArray(data.users)) {
        // Filter for counselors with role "counselor" or users that seem to be counselors
        const counselorData = data.users.filter(user => 
          user.email && user.firstname && user.lastname
        );
        setCounselors(counselorData);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('Error fetching counselors:', err);
      setError(err instanceof Error ? err.message : 'Failed to load counselors');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (fee?: number) => {
    return fee && fee > 0 ? `$${fee}/session` : 'Contact for pricing';
  };

  const getInitials = (firstname: string, lastname: string) => {
    return `${firstname?.[0] || ''}${lastname?.[0] || ''}`.toUpperCase();
  };

  const getFullName = (firstname: string, lastname: string) => {
    return `${firstname || ''} ${lastname || ''}`.trim();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Welcome to Your Mental Health Journey
        </h1>
        <p className="text-xl text-gray-600">
          Find the perfect counselor and start your path to wellness
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Available Counselors</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {loading ? '...' : counselors.length}
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-xl">
              <Users className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Average Rating</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {loading ? '...' : counselors.length > 0 ? 
                  (counselors.reduce((acc, c) => acc + (c.rating || 4.8), 0) / counselors.length).toFixed(1) : '4.8'}
              </p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-xl">
              <Star className="text-yellow-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Upcoming Sessions</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">0</p>
            </div>
            <div className="bg-green-100 p-3 rounded-xl">
              <Calendar className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Messages</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">0</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-xl">
              <MessageSquare className="text-purple-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Featured Counselors Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Featured Counselors</h2>
            <p className="text-gray-600 mt-2">Find the perfect mental health professional for your needs</p>
          </div>
          <button
            onClick={fetchCounselors}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Refresh
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading counselors...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={fetchCounselors}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Counselors Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {counselors.length > 0 ? (
              counselors.map((counselor) => (
                <div
                  key={counselor._id}
                  className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-blue-200"
                >
                  {/* Counselor Avatar */}
                  <div className="flex items-center mb-4">
                    <div className="relative">
                      {counselor.imageUrl && counselor.imageUrl !== "/default-avatar.png" ? (
                        <img
                          src={counselor.imageUrl}
                          alt={getFullName(counselor.firstname, counselor.lastname)}
                          className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                          <span className="text-xl font-bold text-white">
                            {getInitials(counselor.firstname, counselor.lastname)}
                          </span>
                        </div>
                      )}
                      {/* Status indicator */}
                      <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${
                        counselor.isActive ? 'bg-green-500' : 'bg-gray-400'
                      }`}></div>
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="text-xl font-bold text-gray-900">{getFullName(counselor.firstname, counselor.lastname)}</h3>
                      <p className="text-blue-600 font-medium">{counselor.specialization || counselor.specialty || 'General Counseling'}</p>
                    </div>
                  </div>

                  {/* Rating and Experience */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="ml-1 font-medium text-gray-900">{counselor.rating || 4.8}</span>
                      <span className="text-gray-500 text-sm ml-1">({counselor.reviews || 12} reviews)</span>
                    </div>
                    <span className="text-sm text-gray-600">{counselor.yearsOfExperience || 5}+ years</span>
                  </div>

                  {/* Bio */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {counselor.bio || counselor.qualifications || 'Experienced counselor ready to help you with your mental health journey.'}
                  </p>

                  {/* Availability and Languages */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      {counselor.availabilityType === 'online' ? 'Online Sessions' : 
                       counselor.availabilityType === 'in-person' ? 'In-Person' : 'Online & In-Person'}
                    </div>
                    {counselor.languagesSpoken && counselor.languagesSpoken.length > 0 && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="h-4 w-4 mr-2" />
                        Speaks: {counselor.languagesSpoken.slice(0, 2).join(', ')}
                      </div>
                    )}
                  </div>

                  {/* Price and Action */}
                  <div className="flex items-center justify-between">
                    <div className="text-lg font-bold text-gray-900">
                      {formatPrice(counselor.consultationFee)}
                    </div>
                    <Link
                      href="/session"
                      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      Book Session
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No counselors available at the moment</p>
                <p className="text-gray-400 text-sm">Please check back later or contact support</p>
              </div>
            )}
          </div>
        )}

        {/* View All Button */}
        {!loading && !error && counselors.length > 0 && (
          <div className="text-center mt-8">
            <Link
              href="/session"
              className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all font-semibold text-lg shadow-lg"
            >
              View All Counselors
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientDashboard;










