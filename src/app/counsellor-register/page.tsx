'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useToast } from '@/contexts/ToastContext';
import Toast from '@/components/main/Toast';
import { Plus, X, Clock, User, Award, Languages, Calendar, DollarSign, FileText } from 'lucide-react';

export default function CounselorRegisterPage() {
  const router = useRouter();
  const { toast, setToast } = useToast();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    // Professional Details
    specialty: '',
    licenseNumber: '',
    yearsOfExperience: '',
    highestQualification: '',
    university: '',
    languagesSpoken: [''],
    availabilityType: 'online',
    availableTimeSlots: [{ day: 'monday', startTime: '09:00', endTime: '17:00' }],
    consultationFee: '',
    
    // Counseling Approach
    bio: '',
    therapeuticModalities: [''],
    sessionDuration: '60'
  });

  const specialties = [
    'Anxiety & Stress Management', 'Depression', 'Trauma & PTSD', 'Relationship Counseling',
    'Family Therapy', 'Addiction Recovery', 'Grief & Loss', 'LGBTQ+ Support',
    'Teen & Adolescent Counseling', 'Career Counseling', 'Eating Disorders', 'Other'
  ];

  const modalities = [
    'Cognitive Behavioral Therapy (CBT)', 'Dialectical Behavior Therapy (DBT)',
    'Eye Movement Desensitization and Reprocessing (EMDR)', 'Psychodynamic Therapy',
    'Humanistic Therapy', 'Solution-Focused Brief Therapy', 'Mindfulness-Based Therapy',
    'Acceptance and Commitment Therapy (ACT)', 'Family Systems Therapy'
  ];

  const languages = ['English', 'Sinhala', 'Tamil', 'Hindi', 'Other'];
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addArrayField = (field: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field as keyof typeof prev] as string[], '']
    }));
  };

  const removeArrayField = (field: string, index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field as keyof typeof prev] as string[]).filter((_, i) => i !== index)
    }));
  };

  const updateArrayField = (field: string, index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field as keyof typeof prev] as string[]).map((item, i) => i === index ? value : item)
    }));
  };

  const addTimeSlot = () => {
    setFormData(prev => ({
      ...prev,
      availableTimeSlots: [...prev.availableTimeSlots, { day: 'monday', startTime: '09:00', endTime: '17:00' }]
    }));
  };

  const removeTimeSlot = (index: number) => {
    setFormData(prev => ({
      ...prev,
      availableTimeSlots: prev.availableTimeSlots.filter((_, i) => i !== index)
    }));
  };

  const updateTimeSlot = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      availableTimeSlots: prev.availableTimeSlots.map((slot, i) => 
        i === index ? { ...slot, [field]: value } : slot
      )
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      // Filter out empty strings from arrays
      const cleanedData = {
        ...formData,
        languagesSpoken: formData.languagesSpoken.filter(lang => lang.trim() !== ''),
        therapeuticModalities: formData.therapeuticModalities.filter(mod => mod.trim() !== ''),
        yearsOfExperience: parseInt(formData.yearsOfExperience),
        consultationFee: parseFloat(formData.consultationFee) || 0,
        sessionDuration: parseInt(formData.sessionDuration)
      };

      const response = await axios.post('/api/counselor/profile', cleanedData);
      
      setToast({
        open: true,
        message: 'Profile completed successfully! Setting up payment processing...',
        type: 'success'
      });

      // If Stripe onboarding URL is provided, redirect to it
      if (response.data.stripeOnboardingUrl) {
        setTimeout(() => {
          window.location.href = response.data.stripeOnboardingUrl;
        }, 1500);
      } else {
        setTimeout(() => {
          router.push('/counsellor');
        }, 2000);
      }
    } catch (error: any) {
      console.error('Profile creation failed:', error);
      setToast({
        open: true,
        message: error.response?.data?.error || 'Failed to complete profile',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <Toast
        open={toast.open}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, open: false })}
      />

      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
            <h1 className="text-3xl font-bold text-white mb-2">Complete Your Counselor Profile</h1>
            <p className="text-blue-100">Help us understand your expertise to connect you with the right clients</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Professional Details Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <User className="text-blue-600" size={24} />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900">Professional Details</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Specialty *</label>
                  <select
                    value={formData.specialty}
                    onChange={(e) => handleInputChange('specialty', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select your specialty</option>
                    {specialties.map(specialty => (
                      <option key={specialty} value={specialty}>{specialty}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">License/Registration Number</label>
                  <input
                    type="text"
                    value={formData.licenseNumber}
                    onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
                    placeholder="Enter your license number"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Years of Experience *</label>
                  <input
                    type="number"
                    value={formData.yearsOfExperience}
                    onChange={(e) => handleInputChange('yearsOfExperience', e.target.value)}
                    placeholder="e.g., 5"
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Highest Qualification *</label>
                  <input
                    type="text"
                    value={formData.highestQualification}
                    onChange={(e) => handleInputChange('highestQualification', e.target.value)}
                    placeholder="e.g., MSc in Psychology"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">University/Institution</label>
                  <input
                    type="text"
                    value={formData.university}
                    onChange={(e) => handleInputChange('university', e.target.value)}
                    placeholder="University or institution name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Languages */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Languages Spoken</label>
                {formData.languagesSpoken.map((language, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <select
                      value={language}
                      onChange={(e) => updateArrayField('languagesSpoken', index, e.target.value)}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select language</option>
                      {languages.map(lang => (
                        <option key={lang} value={lang}>{lang}</option>
                      ))}
                    </select>
                    {formData.languagesSpoken.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayField('languagesSpoken', index)}
                        className="px-3 py-3 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                      >
                        <X size={20} />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayField('languagesSpoken')}
                  className="flex items-center gap-2 px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50"
                >
                  <Plus size={16} />
                  Add Language
                </button>
              </div>

              {/* Availability Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Availability Type *</label>
                <div className="flex gap-4">
                  {['online', 'in-person', 'both'].map(type => (
                    <label key={type} className="flex items-center">
                      <input
                        type="radio"
                        name="availabilityType"
                        value={type}
                        checked={formData.availabilityType === type}
                        onChange={(e) => handleInputChange('availabilityType', e.target.value)}
                        className="mr-2"
                      />
                      {type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}
                    </label>
                  ))}
                </div>
              </div>

              {/* Time Slots */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Available Time Slots</label>
                {formData.availableTimeSlots.map((slot, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-2">
                    <select
                      value={slot.day}
                      onChange={(e) => updateTimeSlot(index, 'day', e.target.value)}
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {days.map(day => (
                        <option key={day} value={day}>{day.charAt(0).toUpperCase() + day.slice(1)}</option>
                      ))}
                    </select>
                    <input
                      type="time"
                      value={slot.startTime}
                      onChange={(e) => updateTimeSlot(index, 'startTime', e.target.value)}
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                      type="time"
                      value={slot.endTime}
                      onChange={(e) => updateTimeSlot(index, 'endTime', e.target.value)}
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {formData.availableTimeSlots.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTimeSlot(index)}
                        className="px-3 py-3 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                      >
                        <X size={20} />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addTimeSlot}
                  className="flex items-center gap-2 px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50"
                >
                  <Plus size={16} />
                  Add Time Slot
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Consultation Fee (per session)</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="number"
                    value={formData.consultationFee}
                    onChange={(e) => handleInputChange('consultationFee', e.target.value)}
                    placeholder="0 for free consultation"
                    min="0"
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Counseling Approach Section */}
            <div className="space-y-6 border-t pt-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <FileText className="text-purple-600" size={24} />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900">Counseling Approach</h2>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">About Me / Bio</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  placeholder="Describe your counseling approach, experience, and what clients can expect..."
                  rows={5}
                  maxLength={1000}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="text-sm text-gray-500 mt-1">{formData.bio.length}/1000 characters</div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Therapeutic Modalities Used</label>
                {formData.therapeuticModalities.map((modality, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <select
                      value={modality}
                      onChange={(e) => updateArrayField('therapeuticModalities', index, e.target.value)}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select therapeutic modality</option>
                      {modalities.map(mod => (
                        <option key={mod} value={mod}>{mod}</option>
                      ))}
                    </select>
                    {formData.therapeuticModalities.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayField('therapeuticModalities', index)}
                        className="px-3 py-3 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                      >
                        <X size={20} />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayField('therapeuticModalities')}
                  className="flex items-center gap-2 px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50"
                >
                  <Plus size={16} />
                  Add Modality
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Session Duration (minutes)</label>
                <select
                  value={formData.sessionDuration}
                  onChange={(e) => handleInputChange('sessionDuration', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="30">30 minutes</option>
                  <option value="45">45 minutes</option>
                  <option value="60">60 minutes</option>
                  <option value="90">90 minutes</option>
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 px-6 rounded-xl text-white font-semibold text-lg ${
                  loading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all'
                } shadow-lg`}
              >
                {loading ? 'Completing Profile...' : 'Complete Profile & Get Started'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
