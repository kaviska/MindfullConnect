// src/app/patient/page.tsx
"use client";
import AllSessionsModal from "@/app/components/sessions/AllSessionsModal";
import SessionDetailsModal from "@/app/components/sessions/SessionDetailsModal"; // ✅ Add this import
import { BookedSession, Counselor } from "@/app/components/types";
import { useAuth } from "@/context/AuthContext";
import {
  BookOpen,
  Brain,
  Calendar,
  Heart,
  MessageSquare,
  Plus,
  Shield,
  Star,
  TrendingUp,
  User,
  Video,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // ✅ Add this import
import { useEffect, useState } from "react";

export default function PatientPage() {
  const { user } = useAuth();
  const router = useRouter(); // ✅ Add router
  
  // ✅ Add state for dynamic sessions
  const [upcomingSessions, setUpcomingSessions] = useState<BookedSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // ✅ Add state for featured counselors
  const [featuredCounselors, setFeaturedCounselors] = useState<Counselor[]>([]);
  const [counselorsLoading, setCounselorsLoading] = useState(true);
  
  // ✅ Add state for modals
  const [isAllSessionsModalOpen, setIsAllSessionsModalOpen] = useState(false);
  const [isSessionDetailsModalOpen, setIsSessionDetailsModalOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<BookedSession | null>(null);

  // ✅ Add handlers for session actions
  const handleChatClick = (counselorId: string) => {
    router.push(`/chatinterface?counselorId=${counselorId}`);
  };

  const handleViewDetails = (session: BookedSession) => {
    setSelectedSession(session);
    setIsSessionDetailsModalOpen(true);
  };

  // ✅ Fetch sessions on component mount
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await fetch("/api/sessions/my", {
          credentials: "include",
        });

        const data = await res.json();
        if (res.ok) {
          // ✅ Filter for upcoming sessions only
          const now = new Date();
          const upcoming = data.sessions.filter((session: BookedSession) => {
            const sessionDateTime = new Date(`${session.date}T${session.time}`);
            return sessionDateTime > now && (session.status === 'pending' || session.status === 'confirmed');
          });
          
          setUpcomingSessions(upcoming);
        } else {
          console.error("❌ Error loading sessions:", data.error);
        }
      } catch (err) {
        console.error("❌ Network error loading sessions:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessions();
  }, []);

  // ✅ Fetch featured counselors using your existing API
  useEffect(() => {
    const fetchFeaturedCounselors = async () => {
      try {
        const res = await fetch("/api/counselors/featured");

        const data = await res.json();
        if (res.ok && data.success) {
          setFeaturedCounselors(data.counselors);
          console.log("✅ Fetched featured counselors:", data.counselors);
        } else {
          console.error("❌ Error loading counselors:", data.error);
        }
      } catch (err) {
        console.error("❌ Network error loading counselors:", err);
      } finally {
        setCounselorsLoading(false);
      }
    };

    fetchFeaturedCounselors();
  }, []);

  const quickActions = [
    {
      title: "Progress Tracking",
      icon: TrendingUp,
      href: "/patient/progress",
      color: "bg-gradient-to-br from-[#10b981] to-[#059669]",
      description: "Monitor your wellness journey",
    },
    {
      title: "My Goals",
      icon: Brain,
      href: "/patient/my-goals",
      color: "bg-gradient-to-br from-[#8b5cf6] to-[#7c3aed]",
      description: "Guided Goals With Milstone",
    },
    {
      title: "My Quiz",
      icon: BookOpen,
      href: "/patient/my-quizzes",
      color: "bg-gradient-to-br from-[#f59e0b] to-[#d97706]",
      description: "Take personalized wellness quizzes",
    },
    {
      title: "Profile",
      icon: User,
      href: "/patient/profile",
      color: "bg-gradient-to-br from-[#6b7280] to-[#4b5563]",
      description: "Manage your account settings",
    },
  ];

  // ✅ Calculate dynamic wellness stats
  const calculateWellnessStats = () => {
    const completedSessions = upcomingSessions.filter(
      (s) => s.status === "completed"
    ).length;
    const totalSessions = upcomingSessions.length;

    return [
      {
        label: "Sessions Completed",
        value: completedSessions.toString(),
        icon: Calendar,
        color: "text-blue-600",
      },
      {
        label: "Wellness Score",
        value: "8.5",
        icon: Star,
        color: "text-yellow-600",
      },
      {
        label: "Total Sessions",
        value: totalSessions.toString(),
        icon: TrendingUp,
        color: "text-green-600",
      },
      {
        label: "Goals Achieved",
        value: "5",
        icon: Shield,
        color: "text-purple-600",
      },
    ];
  };

  const wellnessStats = calculateWellnessStats();

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
                <h1 className="text-3xl font-bold">
                  Welcome back, {user?.fullName || "Friend"}!
                </h1>
                <p className="text-blue-100 text-lg">
                  Continue your mindful journey to better mental wellness
                </p>
              </div>
            </div>
            <div className="bg-white bg-opacity-10 rounded-xl p-4 mt-6">
              <p className="text-sm text-blue-100 mb-2">
                Today's Mindful Moment
              </p>
              <p className="text-white font-medium">
                "Progress, not perfection. Every step forward is a victory worth
                celebrating."
              </p>
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
                <h2 className="text-2xl font-bold text-gray-900">
                  My Sessions
                </h2>
              </div>
            </div>

            {upcomingSessions.length > 0 ? (
              <div className="space-y-4">
                {/* ✅ Updated session cards with proper handlers */}
                {upcomingSessions.slice(0, 2).map((session) => (
                  <div
                    key={session.id}
                    className="border border-gray-100 rounded-xl p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                        <div className="font-semibold text-gray-900">
                          {session.counselor.name}
                        </div>
                        <Video className="h-4 w-4 text-blue-500" />
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="text-sm text-blue-600 font-semibold">
                          {new Date(session.date).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-gray-500">
                          {session.time}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 mb-3">
                      {session.counselor.specialty}
                    </div>

                    {/* ✅ Updated action buttons with proper handlers */}
                    <div className="flex justify-between items-center">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          session.status === "confirmed"
                            ? "bg-green-100 text-green-700"
                            : session.status === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                        }`}
                      >
                        {session.status === "confirmed"
                          ? "✓ Confirmed"
                          : session.status === "pending"
                            ? "⏳ Pending"
                            : "❌ Cancelled"}
                      </span>

                      <div className="flex gap-2">
                        {/* ✅ Chat button with proper handler */}
                        <button
                          onClick={() => handleChatClick(session.counselor.id)}
                          className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-green-700 transition-colors flex items-center gap-1"
                        >
                          <MessageSquare className="h-3 w-3" />
                          Chat
                        </button>

                        {/* ✅ View Details button with proper handler */}
                        <button
                          onClick={() => handleViewDetails(session)}
                          className="bg-gray-600 text-white px-4 py-1.5 rounded-lg text-xs font-medium hover:bg-gray-700 transition-colors"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  onClick={() => setIsAllSessionsModalOpen(true)}
                  className="block w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all text-center"
                >
                  View All Sessions
                </button>
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-2 text-lg font-medium">
                  No upcoming sessions
                </p>
                <p className="text-gray-400 text-sm mb-6">
                  Schedule your first therapy session today
                </p>
                <Link
                  href="/session"
                  className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl text-sm font-medium hover:from-blue-700 hover:to-purple-700 transition-all"
                >
                  Book Your First Session
                </Link>
              </div>
            )}
          </div>

          {/* ✅ Updated Find Counselors section */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-[#06b6d4] to-[#0891b2] p-3 rounded-xl">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Top Rated Counselors
                </h2>
              </div>
            </div>

            {counselorsLoading ? (
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="border border-gray-100 rounded-xl p-4 animate-pulse"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-2/3 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : featuredCounselors.length > 0 ? (
              <div className="space-y-4">
                {/* ✅ Fix property references in the counselor card section */}
                {featuredCounselors.slice(0, 2).map((counselor) => (
                  <div
                    key={counselor._id}
                    className="border border-gray-100 rounded-xl p-4 hover:shadow-md transition-all cursor-pointer"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full overflow-hidden">
                        {counselor.avatar &&
                        counselor.avatar !== "/default-avatar.png" ? (
                          <img
                            src={counselor.avatar}
                            alt={counselor.name}
                            className="w-12 h-12 object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold">
                            {counselor.name
                              ? counselor.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                              : "C"}
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-gray-900">
                            {counselor.name}
                          </h3>
                          <div className="text-right">
                            <div className="text-sm font-semibold text-gray-900">
                              ${counselor.consultationFee || 75}/session
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 text-yellow-400 fill-current" />
                              <span className="text-xs text-gray-600">
                                {counselor.rating.toFixed(1)} (
                                {counselor.reviews})
                              </span>
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          {counselor.specialty}
                        </p>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-green-600 font-medium">
                              {counselor.yearsOfExperience}+ years exp
                            </span>
                            <span className="text-xs text-blue-600">
                              {counselor.availabilityType}
                            </span>
                          </div>
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
                <Link
                  href="/session"
                  className="block w-full bg-gradient-to-r from-teal-600 to-blue-600 text-white py-3 rounded-xl font-medium hover:from-teal-700 hover:to-blue-700 transition-all text-center"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Plus className="h-4 w-4" />
                    Find More Counselors
                  </div>
                </Link>
              </div>
            ) : (
              <div className="text-center py-8">
                <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-2 text-lg font-medium">
                  No counselors available
                </p>
                <p className="text-gray-400 text-sm">Please check back later</p>
              </div>
            )}
          </div>
        </div>

        {/* Wellness Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {wellnessStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center"
              >
                <Icon className={`h-8 w-8 ${stat.color} mx-auto mb-3`} />
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Quick Access Tools */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">
            Additional Wellness Tools
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Link href={action.href} key={index}>
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-all duration-300 cursor-pointer group hover:-translate-y-1">
                    <div className="text-center">
                      <div
                        className={`${action.color} p-3 rounded-xl group-hover:scale-105 transition-transform duration-200 shadow-lg mx-auto w-fit mb-3`}
                      >
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <h3 className="font-semibold text-gray-900 text-sm mb-2">
                        {action.title}
                      </h3>
                      <p className="text-gray-600 text-xs leading-relaxed">
                        {action.description}
                      </p>
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
              <h3 className="font-semibold text-gray-900 mb-1">
                Need immediate support?
              </h3>
              <p className="text-gray-600 text-sm">
                If you're experiencing a mental health crisis, help is available
                24/7.
              </p>
            </div>
            <button className="bg-red-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-red-600 transition-colors">
              Get Help Now
            </button>
          </div>
        </div>
      </div>
      
      {/* ✅ Add both modals */}
      <AllSessionsModal
        isOpen={isAllSessionsModalOpen}
        onClose={() => setIsAllSessionsModalOpen(false)}
      />
      
      <SessionDetailsModal
        isOpen={isSessionDetailsModalOpen}
        onClose={() => setIsSessionDetailsModalOpen(false)}
        session={selectedSession}
      />
    </div>
  );
}