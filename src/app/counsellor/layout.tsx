"use client";
import * as React from "react";
import Sidebar from "../components/sidebar";
import { Menu, X, Bell, Search, Settings } from "lucide-react";
import { ToastProvider } from "@/contexts/ToastContext";
import Link from "next/link";
import Pusher from "pusher-js";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [user, setUser] = React.useState<any>(null);
  const [unreadCount, setUnreadCount] = React.useState<number>(0);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Get current user
  React.useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const userData = await response.json();
          setUser(userData.user);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      }
    };

    fetchCurrentUser();
  }, []);

  // Fetch unread notifications count
  React.useEffect(() => {
    if (!user?.id) return;

    const fetchUnreadCount = async () => {
      try {
        const response = await fetch(`/api/notification-temp?user_id=${user.id}`, {
          credentials: 'include',
        });
        if (response.ok) {
          const notifications = await response.json();
          const unreadNotifications = notifications.filter((n: any) => !n.is_read);
          setUnreadCount(unreadNotifications.length);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchUnreadCount();
  }, [user]);

  // Real-time notification updates with Pusher
  React.useEffect(() => {
    if (!user?.id) return;

    const pusher = new Pusher("26d23c8825bb9eac01f6", {
      cluster: "ap2",
    });

    const channel = pusher.subscribe("notifications");

    // Listen for new notifications
    channel.bind("new-notification", function (data: any) {
      if (data.user_id === user.id && !data.is_read) {
        setUnreadCount(prev => prev + 1);
      }
    });

    // Listen for notification read events
    channel.bind("notification-read", function (data: any) {
      if (data.user_id === user.id) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
      pusher.disconnect();
    };
  }, [user]);

  // Close sidebar on mobile when clicking outside
  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <div className="w-full bg-white shadow-sm border-b border-gray-200 z-30">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-3 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-lg">MC</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900 hidden sm:block">
                MindfullConnect
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-6">
            
            <Link
              href="/counsellor/notifications"
              className="relative p-3 rounded-xl hover:bg-gray-100 transition-colors group"
            >
              <Bell size={22} className="text-gray-600 group-hover:text-gray-900" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-medium">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </Link>

          

            <div className="text-base font-medium text-gray-700 border-l pl-6 hidden lg:block">
              Counsellor Dashboard
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-1 relative">
        {/* Mobile Overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`
          ${
            isSidebarOpen
              ? "translate-x-0 w-72"
              : "-translate-x-full w-0 lg:translate-x-0 lg:w-20"
          } 
          fixed lg:relative top-0 left-0 h-full
          bg-white border-r border-gray-200 shadow-lg lg:shadow-none
          transition-all duration-300 ease-in-out z-30
          lg:flex lg:flex-col
        `}
        >
          <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 p-6 lg:p-8 bg-gray-50 overflow-auto">
            <ToastProvider>
                <div className="max-w-8xl mx-auto">{children}</div>
            </ToastProvider>
          </div>
        </main>
      </div>
    </div>
  );
}