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
  Shield,
  Plus,
  Video,
  Phone,
  ArrowRight
} from "lucide-react";
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function PatientPage() {
  const { user } = useAuth();

  const quickActions = [
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
    { 
      id: 1,
      date: "Today", 
      time: "2:00 PM", 
      counselor: "Dr. Sarah Johnson", 
      type: "Individual Therapy",
      status: "confirmed",
      sessionType: "video",
      counselorId: "counselor_1"
    },
    { 
      id: 2,
      date: "Tomorrow", 
      time: "10:00 AM", 
      counselor: "Dr. Michael Chen", 
      type: "Cognitive Behavioral",
      status: "confirmed",
      sessionType: "phone",
      counselorId: "counselor_2"
    },
    { 
      id: 3,
      date: "July 18", 
      time: "3:30 PM", 
      counselor: "Dr. Emily Rodriguez", 
      type: "Anxiety Management",
      status: "pending",
      sessionType: "video",
      counselorId: "counselor_3"
    },
  ];

  const featuredCounselors = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      specialization: "Anxiety & Depression",
      rating: 4.9,
      reviews: 127,
      price: "$80/session",
      availability: "Available today",
      image: "/counselor1.jpg"
    },
    {
      id: 2,
      name: "Dr. Michael Chen",
      specialization: "Relationship Therapy",
      rating: 4.8,
      reviews: 95,
      price: "$75/session",
      availability: "Next available: Tomorrow",
      image: "/counselor2.jpg"
    },
    {
      id: 3,
      name: "Dr. Emily Rodriguez",
      specialization: "Trauma & PTSD",
      rating: 4.9,
      reviews: 156,
      price: "$90/session",
      availability: "Available this week",
      image: "/counselor3.jpg"
    },
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

        {/* Main Action Cards - Sessions & Find Counselors */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upcoming Sessions - PRIORITY 1 */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-xl">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">My Sessions</h2>
              </div>
              <Link href="/patient/sessions" className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                View All
              </Link>
            </div>
            
            {upcomingSessions.length > 0 ? (
              <div className="space-y-4">
                {/* ✅ Show maximum 2 sessions */}
                {upcomingSessions.slice(0, 2).map((session) => (
                  <div key={session.id} className="border border-gray-100 rounded-xl p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                        <div className="font-semibold text-gray-900">{session.counselor}</div>
                        {session.sessionType === 'video' ? 
                          <Video className="h-4 w-4 text-blue-500" /> : 
                          <Phone className="h-4 w-4 text-green-500" />
                        }
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="text-sm text-blue-600 font-semibold">{session.date}</div>
                        <div className="text-sm text-gray-500">{session.time}</div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 mb-3">{session.type}</div>
                    
                    {/* ✅ Enhanced action buttons with chat */}
                    <div className="flex justify-between items-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        session.status === 'confirmed' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {session.status === 'confirmed' ? '✓ Confirmed' : '⏳ Pending'}
                      </span>
                      
                      <div className="flex gap-2">
                        {/* ✅ Chat button for booked sessions */}
                        <Link href={`/chat/${session.counselorId}`}>
                          <button className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-green-700 transition-colors flex items-center gap-1">
                            <MessageSquare className="h-3 w-3" />
                            Chat
                          </button>
                        </Link>
                        
                        {/* ✅ Join/View button */}
                        {session.date === 'Today' ? (
                          <button className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors">
                            Join Now
                          </button>
                        ) : (
                          <button className="bg-gray-600 text-white px-4 py-1.5 rounded-lg text-xs font-medium hover:bg-gray-700 transition-colors">
                            View Details
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                <Link href="/patient/sessions" className="block w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all text-center">
                  Manage All Sessions
                </Link>
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-2 text-lg font-medium">No upcoming sessions</p>
                <p className="text-gray-400 text-sm mb-6">Schedule your first therapy session today</p>
                <Link href="/session" className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl text-sm font-medium hover:from-blue-700 hover:to-purple-700 transition-all">
                  Book Your First Session
                </Link>
              </div>
            )}
          </div>

          {/* Find Counselors - PRIORITY 2 */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-[#06b6d4] to-[#0891b2] p-3 rounded-xl">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Find Counselors</h2>
              </div>
              <Link href="/session" className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                View All
              </Link>
            </div>
            
            <div className="space-y-4">
              {featuredCounselors.slice(0, 2).map((counselor) => (
                <div key={counselor.id} className="border border-gray-100 rounded-xl p-4 hover:shadow-md transition-all cursor-pointer">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {counselor.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-900">{counselor.name}</h3>
                        <div className="text-right">
                          <div className="text-sm font-semibold text-gray-900">{counselor.price}</div>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 text-yellow-400 fill-current" />
                            <span className="text-xs text-gray-600">{counselor.rating} ({counselor.reviews})</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{counselor.specialization}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-green-600 font-medium">{counselor.availability}</span>
                        <Link href="/session">
                          <button className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors">
                            Book Session
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              <Link href="/session" className="block w-full bg-gradient-to-r from-teal-600 to-blue-600 text-white py-3 rounded-xl font-medium hover:from-teal-700 hover:to-blue-700 transition-all text-center">
                <div className="flex items-center justify-center gap-2">
                  <Plus className="h-4 w-4" />
                  Find More Counselors
                </div>
              </Link>
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

        {/* Quick Access Tools */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Additional Wellness Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Link href={action.href} key={index}>
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-all duration-300 cursor-pointer group hover:-translate-y-1">
                    <div className="text-center">
                      <div className={`${action.color} p-3 rounded-xl group-hover:scale-105 transition-transform duration-200 shadow-lg mx-auto w-fit mb-3`}>
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <h3 className="font-semibold text-gray-900 text-sm mb-2">{action.title}</h3>
                      <p className="text-gray-600 text-xs leading-relaxed">{action.description}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
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