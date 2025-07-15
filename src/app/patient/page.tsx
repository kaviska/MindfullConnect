// src/app/patient/page.tsx
'use client';
import { 
  User, 
  Calendar, 
  MessageSquare, 
  TrendingUp, 
  Heart, 
  BookOpen, 
  Clock,
  Star,
  Brain,
  Shield
} from "lucide-react";
import { useAuth } from '@/context/AuthContext';

export default function PatientPage() {
  const { user } = useAuth();

  const quickActions = [
    { 
      title: "My Sessions", 
      icon: Calendar, 
      href: "/session", 
      color: "bg-gradient-to-br from-[#4f46e5] to-[#7c3aed]",
      description: "View upcoming therapy sessions"
    },
    { 
      title: "Find Counselors", 
      icon: Heart, 
      href: "/session", 
      color: "bg-gradient-to-br from-[#06b6d4] to-[#0891b2]",
      description: "Connect with mental health professionals"
    },
    { 
      title: "Progress Tracking", 
      icon: TrendingUp, 
      href: "/patient/progress", 
      color: "bg-gradient-to-br from-[#10b981] to-[#059669]",
      description: "Monitor your wellness journey"
    },
    { 
      title: "Mindfulness", 
      icon: Brain, 
      href: "/patient/mindfulness", 
      color: "bg-gradient-to-br from-[#8b5cf6] to-[#7c3aed]",
      description: "Guided meditation & exercises"
    },
    { 
      title: "Resources", 
      icon: BookOpen, 
      href: "/patient/resources", 
      color: "bg-gradient-to-br from-[#f59e0b] to-[#d97706]",
      description: "Self-help tools and articles"
    },
    { 
      title: "Profile", 
      icon: User, 
      href: "/patient/profile", 
      color: "bg-gradient-to-br from-[#6b7280] to-[#4b5563]",
      description: "Manage your account settings"
    },
  ];

  const upcomingSessions = [
    { date: "Today", time: "2:00 PM", counselor: "Dr. Sarah Johnson", type: "Individual Therapy" },
    { date: "Tomorrow", time: "10:00 AM", counselor: "Dr. Michael Chen", type: "Cognitive Behavioral" },
  ];

  const wellnessStats = [
    { label: "Sessions Completed", value: "12", icon: Calendar, color: "text-blue-600" },
    { label: "Wellness Score", value: "8.5", icon: Star, color: "text-yellow-600" },
    { label: "Days Active", value: "28", icon: TrendingUp, color: "text-green-600" },
    { label: "Goals Achieved", value: "5", icon: Shield, color: "text-purple-600" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fcff] to-[#e3f2fd] p-4 lg:p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-[#4f46e5] via-[#7c3aed] to-[#06b6d4] rounded-2xl shadow-xl text-white p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-10"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-white bg-opacity-20 p-3 rounded-full">
                <Heart className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Welcome back, {user?.fullName || 'Friend'}!</h1>
                <p className="text-blue-100 text-lg">Continue your mindful journey to better mental wellness</p>
              </div>
            </div>
            <div className="bg-white bg-opacity-10 rounded-xl p-4 mt-6">
              <p className="text-sm text-blue-100 mb-2">Today's Mindful Moment</p>
              <p className="text-white font-medium">"Progress, not perfection. Every step forward is a victory worth celebrating."</p>
            </div>
          </div>
        </div>

        {/* Wellness Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {wellnessStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
                <Icon className={`h-8 w-8 ${stat.color} mx-auto mb-3`} />
                <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions Grid */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Your Wellness Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group hover:-translate-y-1"
                >
                  <div className="flex items-start gap-4">
                    <div className={`${action.color} p-4 rounded-xl group-hover:scale-105 transition-transform duration-200 shadow-lg`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-lg mb-2">{action.title}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{action.description}</p>
                      <div className="mt-4">
                        <span className="text-blue-600 text-sm font-medium group-hover:text-blue-700">
                          Explore →
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming Sessions & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upcoming Sessions */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-lg">
                <Clock className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Upcoming Sessions</h2>
            </div>
            
            {upcomingSessions.length > 0 ? (
              <div className="space-y-4">
                {upcomingSessions.map((session, index) => (
                  <div key={index} className="border border-gray-100 rounded-xl p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-medium text-gray-900">{session.counselor}</div>
                      <div className="text-sm text-blue-600 font-medium">{session.date}</div>
                    </div>
                    <div className="text-sm text-gray-600 mb-1">{session.type}</div>
                    <div className="text-sm text-gray-500">{session.time}</div>
                  </div>
                ))}
                <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all">
                  View All Sessions
                </button>
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-2">No upcoming sessions</p>
                <p className="text-gray-400 text-sm mb-4">Schedule your next therapy session</p>
                <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:from-blue-700 hover:to-purple-700 transition-all">
                  Book Session
                </button>
              </div>
            )}
          </div>

          {/* Mental Wellness Tips */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-br from-green-500 to-teal-600 p-2 rounded-lg">
                <Brain className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Wellness Tips</h2>
            </div>
            
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-green-50 to-teal-50 border border-green-100 rounded-xl p-4">
                <h3 className="font-medium text-gray-900 mb-2">🌱 Practice Gratitude</h3>
                <p className="text-sm text-gray-600">Take a moment to write down three things you're grateful for today.</p>
              </div>
              
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 rounded-xl p-4">
                <h3 className="font-medium text-gray-900 mb-2">🧘 Mindful Breathing</h3>
                <p className="text-sm text-gray-600">Try the 4-7-8 breathing technique to reduce stress and anxiety.</p>
              </div>
              
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-100 rounded-xl p-4">
                <h3 className="font-medium text-gray-900 mb-2">☀️ Morning Routine</h3>
                <p className="text-sm text-gray-600">Start your day with intention and positive affirmations.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Support */}
        <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-2xl p-6">
          <div className="flex items-center gap-4">
            <div className="bg-red-500 p-3 rounded-full">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">Need immediate support?</h3>
              <p className="text-gray-600 text-sm">If you're experiencing a mental health crisis, help is available 24/7.</p>
            </div>
            <button className="bg-red-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-red-600 transition-colors">
              Get Help Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}