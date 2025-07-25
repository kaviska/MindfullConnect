"use client";

import React from "react";
import {
  Users,
  Calendar,
  MessageCircle,
  TrendingUp,
  Clock,
  Star,
  Phone,
  Video,
  FileText,
  Heart,
  ExternalLink,
  AlertTriangle,
} from "lucide-react";

export default function Home() {
  const [counselorData, setCounselorData] = React.useState(null);
  const [recentSessions, setRecentSessions] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [sessionsLoading, setSessionsLoading] = React.useState(true);

  React.useEffect(() => {
    fetchCounselorData();
    fetchRecentSessions();
  }, []);

  const fetchCounselorData = async () => {
    try {
      const response = await fetch("/api/counselor/profile");
      if (response.ok) {
        const data = await response.json();
        setCounselorData(data.counselor);
      }
    } catch (error) {
      console.error("Error fetching counselor data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentSessions = async () => {
    try {
      const response = await fetch("/api/counselor/recent-sessions");
      if (response.ok) {
        const data = await response.json();
        setRecentSessions(data.recentSessions || []);
      }
    } catch (error) {
      console.error("Error fetching recent sessions:", error);
    } finally {
      setSessionsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Payment Setup Warning Banner */}
      {counselorData && !counselorData.stripeOnboardingCompleted && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-start">
            <AlertTriangle className="text-yellow-600 mt-1 mr-3" size={24} />
            <div className="flex-1">
              <h3 className="font-semibold text-yellow-800 mb-2">
                Payment Setup Required
              </h3>
              <p className="text-yellow-700 mb-4">
                Complete your bank account setup to start accepting paid
                counseling sessions. You can browse the dashboard but won't be
                able to conduct paid sessions until payment verification is
                complete.
              </p>
              <PaymentSetupButton />
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
          <div className="mb-6 lg:mb-0">
            <h1 className="text-3xl lg:text-4xl font-bold mb-3">
              Welcome{" "}
              {counselorData?.name
                ? `Dr. ${counselorData.name}`
                : "to Your Counsellor Dashboard"}
            </h1>
            <p className="text-blue-100 text-lg leading-relaxed max-w-2xl">
              Empowering mental wellness through professional counselling
              services. Connect with clients, manage sessions, and make a
              meaningful impact on mental health.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
            <div className="text-3xl font-bold">24/7</div>
            <div className="text-blue-100">Support Available</div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Clients</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {counselorData?.patients_ids?.length || 0}
              </p>
              <p className="text-green-600 text-sm mt-2 flex items-center">
                <TrendingUp size={16} className="mr-1" />
                Active clients
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
              <p className="text-gray-600 text-sm font-medium">
                Session Duration
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {counselorData?.sessionDuration || 60}
              </p>
              <p className="text-blue-600 text-sm mt-2 flex items-center">
                <Clock size={16} className="mr-1" />
                minutes per session
              </p>
            </div>
            <div className="bg-green-100 p-4 rounded-xl">
              <Clock className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">
                Average Rating
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {counselorData?.rating || 0}
              </p>
              <p className="text-yellow-600 text-sm mt-2 flex items-center">
                <Star size={16} className="mr-1" />
                Based on {counselorData?.reviews || 0} reviews
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
              <p className="text-gray-600 text-sm font-medium">Experience</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {counselorData?.yearsOfExperience || 0}
              </p>
              <p className="text-purple-600 text-sm mt-2 flex items-center">
                <TrendingUp size={16} className="mr-1" />
                years of practice
              </p>
            </div>
            <div className="bg-purple-100 p-4 rounded-xl">
              <TrendingUp className="text-purple-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Services Overview */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Our Counselling Services
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="bg-blue-100 p-4 rounded-xl w-fit mb-4">
              <Video className="text-blue-600" size={28} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Video Counselling
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Secure, face-to-face video sessions providing personalized mental
              health support from the comfort of your space.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="bg-green-100 p-4 rounded-xl w-fit mb-4">
              <MessageCircle className="text-green-600" size={28} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Chat Therapy
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Real-time messaging support for continuous guidance and immediate
              assistance during challenging moments.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="bg-purple-100 p-4 rounded-xl w-fit mb-4">
              <Phone className="text-purple-600" size={28} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Voice Sessions
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Professional audio counselling sessions offering privacy and
              comfort for those who prefer voice-only communication.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="bg-yellow-100 p-4 rounded-xl w-fit mb-4">
              <FileText className="text-yellow-600" size={28} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Session Notes
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Comprehensive session documentation and progress tracking to
              ensure effective treatment continuity.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="bg-red-100 p-4 rounded-xl w-fit mb-4">
              <Heart className="text-red-600" size={28} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Crisis Support
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Immediate emergency support and intervention services for clients
              experiencing mental health crises.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="bg-indigo-100 p-4 rounded-xl w-fit mb-4">
              <TrendingUp className="text-indigo-600" size={28} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Progress Tracking
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Advanced analytics and reporting tools to monitor client progress
              and treatment effectiveness over time.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <a
            href="/counsellor/sessions"
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl p-6 text-left transition-colors shadow-lg flex flex-col"
            >
            <Calendar className="mb-3" size={24} />
            <div className="font-semibold">Schedule Session</div>
            <div className="text-blue-100 text-sm"> New appointment</div>
            </a>
          
            <a
            href="/chatinterface"
            className="bg-green-600 hover:bg-green-700 text-white rounded-xl p-6 text-left transition-colors shadow-lg flex flex-col"
            >
            <MessageCircle className="mb-3" size={24} />
            <div className="font-semibold">Start Chat</div>
            <div className="text-green-100 text-sm">Begin new conversation</div>
            </a>
          
           
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
          
       

          <PaymentDashboardButton counselorData={counselorData} />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">
          Recent Sessions
        </h3>
        {sessionsLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="relative">
              <div className="w-8 h-8 border-4 border-blue-200 rounded-full animate-spin"></div>
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
            </div>
            <span className="ml-3 text-gray-600">
              Loading recent sessions...
            </span>
          </div>
        ) : recentSessions.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-600">No recent sessions found</p>
            <p className="text-gray-500 text-sm mt-1">
              Your recent session activity will appear here
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentSessions.map((session: any) => (
              <div
                key={session.id}
                className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div
                  className={`p-2 rounded-lg mr-4 ${getIconBackground(session.activityColor)}`}
                >
                  {getActivityIcon(session.activityType, session.activityColor)}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">
                    {session.description}
                  </p>
                  <div className="flex items-center space-x-4 mt-1">
                    <p className="text-gray-600 text-sm">{session.timeAgo}</p>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(session.status)}`}
                    >
                      {formatStatus(session.status)}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">{session.date}</p>
                  <p className="text-sm text-gray-500">{session.time}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Helper functions for the Recent Sessions UI
function getActivityIcon(activityType: string, activityColor: string) {
  const iconColor = getIconColor(activityColor);
  const size = 20;

  switch (activityType) {
    case "video":
      return <Video className={iconColor} size={size} />;
    case "calendar":
      return <Calendar className={iconColor} size={size} />;
    case "message":
      return <MessageCircle className={iconColor} size={size} />;
    default:
      return <Video className={iconColor} size={size} />;
  }
}

function getIconColor(color: string): string {
  switch (color) {
    case "blue":
      return "text-blue-600";
    case "green":
      return "text-green-600";
    case "purple":
      return "text-purple-600";
    case "yellow":
      return "text-yellow-600";
    case "red":
      return "text-red-600";
    default:
      return "text-blue-600";
  }
}

function getIconBackground(color: string): string {
  switch (color) {
    case "blue":
      return "bg-blue-100";
    case "green":
      return "bg-green-100";
    case "purple":
      return "bg-purple-100";
    case "yellow":
      return "bg-yellow-100";
    case "red":
      return "bg-red-100";
    default:
      return "bg-blue-100";
  }
}

function getStatusBadge(status: string): string {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800";
    case "confirmed":
      return "bg-blue-100 text-blue-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    case "counselor requested reschedule":
      return "bg-orange-100 text-orange-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

function formatStatus(status: string): string {
  switch (status) {
    case "completed":
      return "Completed";
    case "confirmed":
      return "Confirmed";
    case "pending":
      return "Pending";
    case "cancelled":
      return "Cancelled";
    case "counselor requested reschedule":
      return "Reschedule Requested";
    default:
      return "Unknown";
  }
}

// Enhanced Payment Dashboard Button Component
function PaymentDashboardButton({ counselorData }: { counselorData: any }) {
  const [loading, setLoading] = React.useState(false);

  const handlePaymentAction = async () => {
    setLoading(true);
    try {
      // If onboarding is completed, open dashboard
      if (
        counselorData?.stripeAccountId &&
        counselorData?.stripeOnboardingCompleted
      ) {
        const response = await fetch("/api/payment/dashboard-link");
        if (response.ok) {
          const data = await response.json();
          window.open(data.url, "_blank");
        } else {
          throw new Error("Failed to get dashboard link");
        }
      } else {
        // If not completed or no account, create/get onboarding link
        const response = await fetch("/api/payment/create-onboarding-link", {
          method: "POST",
        });

        if (response.ok) {
          const data = await response.json();
          window.location.href = data.url; // Redirect to onboarding
        } else {
          throw new Error("Failed to create onboarding link");
        }
      }
    } catch (error) {
      console.error("Error with payment action:", error);
      alert("Error processing request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getButtonStatus = () => {
    if (!counselorData)
      return {
        text: "Loading...",
        color: "bg-gray-500",
        disabled: true,
        subtitle: "Fetching data...",
      };

    // Check if account exists and onboarding is completed
    if (
      counselorData.stripeAccountId &&
      counselorData.stripeOnboardingCompleted
    ) {
      return {
        text: "Payment Dashboard",
        color: "bg-emerald-600 hover:bg-emerald-700",
        disabled: false,
        subtitle: "View earnings & payouts",
      };
    }

    // Account exists but onboarding not completed OR no account
    return {
      text: counselorData.stripeAccountId ? "Complete Setup" : "Setup Payment",
      color: "bg-yellow-600 hover:bg-yellow-700",
      disabled: false,
      subtitle: counselorData.stripeAccountId
        ? "Finish onboarding process"
        : "Start payment setup",
    };
  };

  const buttonStatus = getButtonStatus();

  return (
    <button
      onClick={handlePaymentAction}
      disabled={loading || buttonStatus.disabled}
      className={`${buttonStatus.color} text-white rounded-xl p-6 text-left transition-colors shadow-lg ${
        loading || buttonStatus.disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      <ExternalLink className="mb-3" size={24} />
      <div className="font-semibold">
        {loading ? "Processing..." : buttonStatus.text}
      </div>
      <div className="text-white text-opacity-80 text-sm">
        {buttonStatus.subtitle}
      </div>
      {counselorData?.stripeAccountId &&
        !counselorData?.stripeOnboardingCompleted && (
          <div className="text-yellow-200 text-xs mt-1 flex items-center">
            <div className="w-2 h-2 bg-yellow-200 rounded-full mr-1 animate-pulse"></div>
            Account pending verification
          </div>
        )}
    </button>
  );
}

// Add Payment Setup Button Component
function PaymentSetupButton() {
  const [loading, setLoading] = React.useState(false);

  const handleSetupPayment = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/payment/create-onboarding-link", {
        method: "POST",
      });

      if (response.ok) {
        const data = await response.json();
        window.location.href = data.url;
      } else {
        throw new Error("Failed to create onboarding link");
      }
    } catch (error) {
      console.error("Error creating onboarding link:", error);
      alert("Error setting up payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleSetupPayment}
      disabled={loading}
      className={`px-4 py-2 rounded-lg text-white font-medium ${
        loading
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-yellow-600 hover:bg-yellow-700"
      } transition-colors`}
    >
      {loading ? "Setting up..." : "Setup Payment Details"}
    </button>
  );
}
