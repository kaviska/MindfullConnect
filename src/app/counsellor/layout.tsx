"use client";
import * as React from "react";
import Sidebar from "../components/sidebar";
import { Menu, X, Bell, Search, Settings } from "lucide-react";
import { ToastProvider } from "@/contexts/ToastContext";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

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
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">MC</span>
              </div>
              <h1 className="text-lg font-semibold text-gray-900">
                MindfullConnect
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <Link
              href="/counsellor/notifications"
              className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors group"
            >
              <Bell size={20} className="text-gray-600 group-hover:text-gray-900" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                3
              </span>
            </Link>

            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <Settings size={20} className="text-gray-600 hover:text-gray-900" />
            </button>

            <div className="text-sm text-gray-600 border-l pl-4">
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
              ? "translate-x-0 w-64"
              : "-translate-x-full w-0 lg:translate-x-0 lg:w-16"
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
          <div className="flex-1 p-4 lg:p-6 bg-gray-50 overflow-auto">
            <ToastProvider>
              <div className="max-w-7xl mx-auto">{children}</div>
            </ToastProvider>
          </div>
        </main>
      </div>
    </div>
  );
}