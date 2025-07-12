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
          hidden lg:flex absolute -right-4 top-28 w-8 h-8 
          bg-white border border-gray-300 rounded-full 
          items-center justify-center shadow-md hover:shadow-lg
          transition-all duration-200 z-10
        "
      >
        {isSidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
      </button>

      {/* User Profile Section */}
      {isSidebarOpen && (
        <div className="p-8 border-b border-gray-100">
          <div className="text-center">
            <div className="relative mx-auto w-24 h-24 mb-5">
              <img
                src={user?.profilePic || "/profile.jpg"}
                alt="Profile"
                className="w-full h-full rounded-full object-cover border-3 border-blue-100 shadow-md"
              />
              <div className="absolute bottom-1 right-1 w-6 h-6 bg-green-400 rounded-full border-3 border-white"></div>
            </div>
            <h3 className="font-semibold text-gray-800 text-lg mb-2 truncate">
              {user?.name || "Loading..."}
            </h3>
            <p className="text-base text-gray-500 truncate">{user?.email || ""}</p>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-8">
        <div className="px-6 space-y-3">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center gap-5 px-5 py-4 rounded-xl text-lg font-medium
                  transition-all duration-200 group
                  ${isActive(item.href)
                    ? "bg-blue-50 text-blue-700 border-r-4 border-blue-700 shadow-sm"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  }
                `}
              >
                <Icon 
                  size={22} 
                  className={`flex-shrink-0 ${
                    isActive(item.href) ? "text-blue-700" : "text-gray-500 group-hover:text-gray-700"
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
                w-full flex items-center gap-5 px-5 py-4 rounded-xl text-lg font-medium
                transition-all duration-200 group
                ${blogDropdownOpen 
                  ? "bg-gray-50 text-gray-900" 
                  : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                }
              `}
            >
              <BookOpen size={22} className="flex-shrink-0 text-gray-500 group-hover:text-gray-700" />
              {isSidebarOpen && (
                <>
                  <span className="flex-1 text-left truncate">Manage Blog</span>
                  {blogDropdownOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </>
              )}
            </button>

            {blogDropdownOpen && isSidebarOpen && (
              <div className="mt-3 ml-10 space-y-2">
                {blogItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`
                        flex items-center gap-4 px-5 py-3.5 rounded-lg text-base font-medium
                        transition-all duration-200 group
                        ${isActive(item.href)
                          ? "bg-blue-50 text-blue-700"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                        }
                      `}
                    >
                      <Icon size={20} className="flex-shrink-0" />
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
        <div className="p-8 border-t border-gray-100">
          <div className="text-base text-gray-500 text-center font-medium">
            MindfullConnect v1.0
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;

