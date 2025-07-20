"use client";
import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Clock, DollarSign, BookOpen, Save, Upload } from 'lucide-react';

interface CounselorProfile {
  userId: string;
  name: string;
  specialty: string;
  licenseNumber: string;
  yearsOfExperience: number;
  highestQualification: string;
  university: string;
  languagesSpoken: string[];
  availabilityType: string;
  consultationFee: number;
  bio: string;
  therapeuticModalities: string[];
  sessionDuration: number;
  avatar: string;
  rating: number;
  reviews: number;
}

export default function CounselorProfilePage() {
  const [profile, setProfile] = useState<CounselorProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/counselor/profile', {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setProfile(data.counselor);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    if (!profile) return;
    setProfile({ ...profile, [field]: value });
  };

  const handleArrayChange = (field: string, value: string) => {
    if (!profile) return;
    const array = value.split(',').map(item => item.trim()).filter(item => item);
    setProfile({ ...profile, [field]: array });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    setIsSaving(true);
    try {
      const response = await fetch('/api/counselor/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(profile),
      });

      if (response.ok) {
        setMessage('Profile updated successfully!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Error updating profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage('Error updating profile');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No profile found. Please contact support.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <User className="text-blue-600" size={24} />
            Counselor Profile
          </h1>
          <p className="text-gray-600 mt-1">Update your professional information</p>
        </div>

        {message && (
          <div className={`p-4 m-6 rounded-lg ${message.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Specialty
              </label>
              <input
                type="text"
                value={profile.specialty || ''}
                onChange={(e) => handleInputChange('specialty', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Clinical Psychology, Marriage Counseling"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                License Number
              </label>
              <input
                type="text"
                value={profile.licenseNumber || ''}
                onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Years of Experience
              </label>
              <input
                type="number"
                value={profile.yearsOfExperience || 0}
                onChange={(e) => handleInputChange('yearsOfExperience', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Highest Qualification
              </label>
              <input
                type="text"
                value={profile.highestQualification || ''}
                onChange={(e) => handleInputChange('highestQualification', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Ph.D. in Psychology"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                University
              </label>
              <input
                type="text"
                value={profile.university || ''}
                onChange={(e) => handleInputChange('university', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Consultation Fee (per session)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="number"
                  value={profile.consultationFee || 0}
                  onChange={(e) => handleInputChange('consultationFee', parseFloat(e.target.value))}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Session Duration (minutes)
              </label>
              <input
                type="number"
                value={profile.sessionDuration || 60}
                onChange={(e) => handleInputChange('sessionDuration', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="15"
                step="15"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Availability Type
              </label>
              <select
                value={profile.availabilityType || 'online'}
                onChange={(e) => handleInputChange('availabilityType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="online">Online</option>
                <option value="in-person">In-Person</option>
                <option value="both">Both</option>
              </select>
            </div>
          </div>

          {/* Languages and Modalities */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Languages Spoken (comma-separated)
              </label>
              <input
                type="text"
                value={profile.languagesSpoken?.join(', ') || ''}
                onChange={(e) => handleArrayChange('languagesSpoken', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="English, Spanish, French"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Therapeutic Modalities (comma-separated)
              </label>
              <input
                type="text"
                value={profile.therapeuticModalities?.join(', ') || ''}
                onChange={(e) => handleArrayChange('therapeuticModalities', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="CBT, DBT, EMDR"
              />
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Professional Bio
            </label>
            <textarea
              value={profile.bio || ''}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              rows={4}
              maxLength={1000}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Tell us about your experience, approach, and what makes you unique..."
            />
            <p className="text-sm text-gray-500 mt-1">
              {(profile.bio || '').length}/1000 characters
            </p>
          </div>

          {/* Profile Stats (Read-only) */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Profile Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{profile.rating.toFixed(1)}</p>
                <p className="text-sm text-gray-600">Rating</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{profile.reviews}</p>
                <p className="text-sm text-gray-600">Reviews</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">{profile.yearsOfExperience || 0}</p>
                <p className="text-sm text-gray-600">Years Experience</p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Save Profile
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
