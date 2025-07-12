import { User, Calendar, MessageSquare, TrendingUp, Heart, BookOpen } from "lucide-react";

export default function PatientPage() {
  const quickActions = [
    { title: "My Sessions", icon: Calendar, href: "#", color: "bg-blue-500" },
    { title: "Messages", icon: MessageSquare, href: "#", color: "bg-green-500" },
    { title: "Progress", icon: TrendingUp, href: "#", color: "bg-purple-500" },
    { title: "Wellness", icon: Heart, href: "#", color: "bg-red-500" },
    { title: "Resources", icon: BookOpen, href: "#", color: "bg-orange-500" },
    { title: "Profile", icon: User, href: "#", color: "bg-gray-500" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg text-white p-8">
          <h1 className="text-3xl font-bold mb-2">Welcome to Your Wellness Journey</h1>
          <p className="text-blue-100 text-lg">Track your progress, connect with your counsellor, and access resources</p>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200 cursor-pointer group"
              >
                <div className="flex items-center gap-4">
                  <div className={`${action.color} p-3 rounded-lg group-hover:scale-105 transition-transform duration-200`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">{action.title}</h3>
                    <p className="text-gray-500 text-sm">Access your {action.title.toLowerCase()}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="text-center py-8">
            <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No recent activity</p>
            <p className="text-gray-400 text-sm">Your activity will appear here once you start using the platform</p>
          </div>
        </div>
      </div>
    </div>
  );
}