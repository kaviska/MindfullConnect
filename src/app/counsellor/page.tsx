'use client';

import React from 'react';
import { Users, Calendar, MessageCircle, TrendingUp, Clock, Star, Phone, Video, FileText, Heart, CreditCard, DollarSign, ExternalLink, Settings } from "lucide-react";

export default function Home() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
          <div className="mb-6 lg:mb-0">
            <h1 className="text-3xl lg:text-4xl font-bold mb-3">
              Welcome to Your Counsellor Dashboard
            </h1>
            <p className="text-blue-100 text-lg leading-relaxed max-w-2xl">
              Empowering mental wellness through professional counselling services. 
              Connect with clients, manage sessions, and make a meaningful impact on mental health.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
            <div className="text-3xl font-bold">24/7</div>
            <div className="text-blue-100">Support Available</div>
          </div>
        </div>
      </div>

      {/* Payment Management Section */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-green-100 p-3 rounded-xl">
            <CreditCard className="text-green-600" size={24} />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900">Payment Management</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <DollarSign className="text-green-600" size={24} />
              </div>
              <span className="text-green-600 text-sm font-medium">This Month</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">$2,450</div>
            <p className="text-green-600 text-sm">Total Earnings</p>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <TrendingUp className="text-blue-600" size={24} />
              </div>
              <span className="text-blue-600 text-sm font-medium">Growth</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">+18%</div>
            <p className="text-blue-600 text-sm">vs Last Month</p>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-200">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <Calendar className="text-purple-600" size={24} />
              </div>
              <span className="text-purple-600 text-sm font-medium">Pending</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">$890</div>
            <p className="text-purple-600 text-sm">To be Paid</p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-4">
          <PaymentDashboardButton />
          <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm">
            <FileText size={18} />
            View Transactions
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors">
            <Settings size={18} />
            Payment Settings
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Clients</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">127</p>
              <p className="text-green-600 text-sm mt-2 flex items-center">
                <TrendingUp size={16} className="mr-1" />
                +12% this month
              </p>
            </div>
            <div className="bg-blue-100 p-4 rounded-xl">
              <Users className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">This Week Sessions</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">28</p>
              <p className="text-blue-600 text-sm mt-2 flex items-center">
                <Calendar size={16} className="mr-1" />
                5 upcoming today
              </p>
            </div>
            <div className="bg-green-100 p-4 rounded-xl">
              <Calendar className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Average Rating</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">4.8</p>
              <p className="text-yellow-600 text-sm mt-2 flex items-center">
                <Star size={16} className="mr-1" />
                Based on 89 reviews
              </p>
            </div>
            <div className="bg-yellow-100 p-4 rounded-xl">
              <Star className="text-yellow-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Active Sessions</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">3</p>
              <p className="text-purple-600 text-sm mt-2 flex items-center">
                <Clock size={16} className="mr-1" />
                2 hours remaining
              </p>
            </div>
            <div className="bg-purple-100 p-4 rounded-xl">
              <Clock className="text-purple-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Services Overview */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Counselling Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="bg-blue-100 p-4 rounded-xl w-fit mb-4">
              <Video className="text-blue-600" size={28} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Video Counselling</h3>
            <p className="text-gray-600 leading-relaxed">
              Secure, face-to-face video sessions providing personalized mental health support from the comfort of your space.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="bg-green-100 p-4 rounded-xl w-fit mb-4">
              <MessageCircle className="text-green-600" size={28} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Chat Therapy</h3>
            <p className="text-gray-600 leading-relaxed">
              Real-time messaging support for continuous guidance and immediate assistance during challenging moments.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="bg-purple-100 p-4 rounded-xl w-fit mb-4">
              <Phone className="text-purple-600" size={28} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Voice Sessions</h3>
            <p className="text-gray-600 leading-relaxed">
              Professional audio counselling sessions offering privacy and comfort for those who prefer voice-only communication.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="bg-yellow-100 p-4 rounded-xl w-fit mb-4">
              <FileText className="text-yellow-600" size={28} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Session Notes</h3>
            <p className="text-gray-600 leading-relaxed">
              Comprehensive session documentation and progress tracking to ensure effective treatment continuity.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="bg-red-100 p-4 rounded-xl w-fit mb-4">
              <Heart className="text-red-600" size={28} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Crisis Support</h3>
            <p className="text-gray-600 leading-relaxed">
              Immediate emergency support and intervention services for clients experiencing mental health crises.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="bg-indigo-100 p-4 rounded-xl w-fit mb-4">
              <TrendingUp className="text-indigo-600" size={28} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Progress Tracking</h3>
            <p className="text-gray-600 leading-relaxed">
              Advanced analytics and reporting tools to monitor client progress and treatment effectiveness over time.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl p-6 text-left transition-colors shadow-lg">
            <Calendar className="mb-3" size={24} />
            <div className="font-semibold">Schedule Session</div>
            <div className="text-blue-100 text-sm">Book new appointment</div>
          </button>
          
          <button className="bg-green-600 hover:bg-green-700 text-white rounded-xl p-6 text-left transition-colors shadow-lg">
            <MessageCircle className="mb-3" size={24} />
            <div className="font-semibold">Start Chat</div>
            <div className="text-green-100 text-sm">Begin new conversation</div>
          </button>
          
          <button className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl p-6 text-left transition-colors shadow-lg">
            <FileText className="mb-3" size={24} />
            <div className="font-semibold">View Reports</div>
            <div className="text-purple-100 text-sm">Check session notes</div>
          </button>
          
          <button className="bg-orange-600 hover:bg-orange-700 text-white rounded-xl p-6 text-left transition-colors shadow-lg">
            <Users className="mb-3" size={24} />
            <div className="font-semibold">Client List</div>
            <div className="text-orange-100 text-sm">Manage clients</div>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h3>
        <div className="space-y-4">
          <div className="flex items-center p-4 bg-gray-50 rounded-lg">
            <div className="bg-blue-100 p-2 rounded-lg mr-4">
              <Video className="text-blue-600" size={20} />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">Video session completed with Sarah Johnson</p>
              <p className="text-gray-600 text-sm">2 hours ago</p>
            </div>
          </div>
          
          <div className="flex items-center p-4 bg-gray-50 rounded-lg">
            <div className="bg-green-100 p-2 rounded-lg mr-4">
              <MessageCircle className="text-green-600" size={20} />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">New message from Michael Chen</p>
              <p className="text-gray-600 text-sm">4 hours ago</p>
            </div>
          </div>
          
          <div className="flex items-center p-4 bg-gray-50 rounded-lg">
            <div className="bg-purple-100 p-2 rounded-lg mr-4">
              <Calendar className="text-purple-600" size={20} />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">Session scheduled with Emma Davis</p>
              <p className="text-gray-600 text-sm">6 hours ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Payment Dashboard Button Component
function PaymentDashboardButton() {
  const [loading, setLoading] = React.useState(false);
  const [onboardingStatus, setOnboardingStatus] = React.useState(null);

  React.useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const response = await fetch('/api/payment/onboarding-status');
      if (response.ok) {
        const data = await response.json();
        setOnboardingStatus(data);
      }
    } catch (error) {
      console.error('Error checking onboarding status:', error);
    }
  };

  const handlePaymentDashboard = async () => {
    setLoading(true);
    try {
      if (!onboardingStatus?.onboardingCompleted) {
        // Redirect to onboarding if not completed
        alert('Please complete your payment setup first.');
        return;
      }

      const response = await fetch('/api/payment/dashboard-link');
      if (response.ok) {
        const data = await response.json();
        window.open(data.url, '_blank');
      } else {
        throw new Error('Failed to get dashboard link');
      }
    } catch (error) {
      console.error('Error opening payment dashboard:', error);
      alert('Error opening payment dashboard. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getButtonContent = () => {
    if (!onboardingStatus) {
      return { text: 'Loading...', color: 'bg-gray-400', disabled: true };
    }
    
    if (!onboardingStatus.onboardingCompleted) {
      return { text: 'Complete Payment Setup', color: 'bg-orange-600 hover:bg-orange-700', disabled: false };
    }
    
    return { text: 'Payment Dashboard', color: 'bg-green-600 hover:bg-green-700', disabled: false };
  };

  const buttonContent = getButtonContent();

  return (
    <button
      onClick={handlePaymentDashboard}
      disabled={loading || buttonContent.disabled}
      className={`flex items-center gap-2 px-6 py-3 text-white rounded-lg transition-colors shadow-sm ${buttonContent.color} ${
        loading || buttonContent.disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      <ExternalLink size={18} />
      {loading ? 'Loading...' : buttonContent.text}
    </button>
  );
}