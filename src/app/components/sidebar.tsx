"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { 
  ChevronDown, 
  ChevronUp, 
  BookOpen, 
  FileText, 
  Edit3,
  LayoutDashboard,
  User,
  Calendar,
  MessageSquare,
  TrendingUp,
  Star,
  Users,
  Bell,
  Target,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import axios from "axios";

interface User {
  name: string;
  email: string;
  profilePic?: string;
}

interface SidebarProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen, toggleSidebar }) => {
  const [user, setUser] = useState<User | null>(null);
  const [blogDropdownOpen, setBlogDropdownOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const fetchUser = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) return;

      try {
        const res = await axios.get(`/api/users/${userId}`);
        setUser(res.data.user);
      } catch (err) {
        console.error("Failed to fetch user data", err);
      }
    };

    fetchUser();
  }, []);

  const navigationItems = [
    { href: "/counsellor", label: "Dashboard", icon: LayoutDashboard },
    { href: "/counsellor/goals", label: "Goals & Milestones", icon: Target },
    { href: "/counsellor/notifications", label: "Notifications", icon: Bell },
    { href: "#", label: "Manage Profile", icon: User },
    { href: "#", label: "Sessions", icon: Calendar },
    { href: "#", label: "Messages", icon: MessageSquare },
    { href: "#", label: "Progress Tracking", icon: TrendingUp },
    { href: "#", label: "Feedbacks", icon: Star },
    { href: "#", label: "Patient Details", icon: Users },
  ];

  const blogItems = [
    { href: "/blogMC", label: "Read Blogs", icon: BookOpen },
    { href: "/myBlogs", label: "My Blogs", icon: FileText },
    { href: "/write", label: "Write a Blog", icon: Edit3 },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Toggle Button - Desktop */}
      <button
        onClick={toggleSidebar}
        className="
          hidden lg:flex absolute -right-3 top-20 w-6 h-6 
          bg-white border border-gray-300 rounded-full 
          items-center justify-center shadow-md hover:shadow-lg
          transition-all duration-200 z-10
        "
      >
        {isSidebarOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
      </button>

      {/* User Profile Section */}
      {isSidebarOpen && (
        <div className="p-6 border-b border-gray-100">
          <div className="text-center">
            <div className="relative mx-auto w-16 h-16 mb-3">
              <img
                src={user?.profilePic || "/profile.jpg"}
                alt="Profile"
                className="w-full h-full rounded-full object-cover border-2 border-blue-100"
              />
              <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
            </div>
            <h3 className="font-semibold text-gray-800 text-sm truncate">
              {user?.name || "Loading..."}
            </h3>
            <p className="text-xs text-gray-500 truncate">{user?.email || ""}</p>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <div className="px-3 space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                  transition-all duration-200 group
                  ${isActive(item.href)
                    ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }
                `}
              >
                <Icon 
                  size={18} 
                  className={`flex-shrink-0 ${
                    isActive(item.href) ? "text-blue-700" : "text-gray-400 group-hover:text-gray-600"
                  }`} 
                />
                {isSidebarOpen && (
                  <span className="truncate">{item.label}</span>
                )}
              </Link>
            );
          })}

          {/* Blog Dropdown */}
          <div className="relative">
            <button
              onClick={() => setBlogDropdownOpen(!blogDropdownOpen)}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                transition-all duration-200 group
                ${blogDropdownOpen 
                  ? "bg-gray-50 text-gray-900" 
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }
              `}
            >
              <BookOpen size={18} className="flex-shrink-0 text-gray-400 group-hover:text-gray-600" />
              {isSidebarOpen && (
                <>
                  <span className="flex-1 text-left truncate">Manage Blog</span>
                  {blogDropdownOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </>
              )}
            </button>

            {blogDropdownOpen && isSidebarOpen && (
              <div className="mt-1 ml-6 space-y-1">
                {blogItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`
                        flex items-center gap-2 px-3 py-2 rounded-lg text-sm
                        transition-all duration-200 group
                        ${isActive(item.href)
                          ? "bg-blue-50 text-blue-700"
                          : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                        }
                      `}
                    >
                      <Icon size={16} className="flex-shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Footer */}
      {isSidebarOpen && (
        <div className="p-4 border-t border-gray-100">
          <div className="text-xs text-gray-400 text-center">
            MindfullConnect v1.0
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;

