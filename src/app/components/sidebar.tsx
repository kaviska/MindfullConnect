"use client";
import React, { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, BookOpen, FileText, Edit3 } from "lucide-react";
import axios from "axios";

interface User {
  name: string;
  email: string;
  profilePic?: string;
}

const Sidebar: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [blogDropdownOpen, setBlogDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) return;

      try {
        const res = await axios.get(`/api/users/${userId}`);
        setUser(res.data.user); // Adjust based on your actual API response
      } catch (err) {
        console.error("Failed to fetch user data", err);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="bg-gradient-to-b from-blue-100 to-blue-200 w-64 p-6 h-screen fixed shadow-xl">
      <div className="text-center mb-8">
        <img
          src={user?.profilePic || "/profile.jpg"}
          alt=""
          className="rounded-full w-24 h-24 mx-auto mb-3 border-4 border-white shadow"
        />
        <h3 className="text-xl font-semibold text-gray-800">{user?.name || "Loading..."}</h3>
        <p className="text-sm text-gray-600">{user?.email || ""}</p>
      </div>

      <nav className="space-y-3">
        <a href="#" className="block px-4 py-2 rounded hover:bg-blue-300 font-medium">Dashboard</a>
        <a href="#" className="block px-4 py-2 rounded hover:bg-blue-300">Manage Profile</a>
        <a href="#" className="block px-4 py-2 rounded hover:bg-blue-300">Sessions</a>
        <a href="#" className="block px-4 py-2 rounded hover:bg-blue-300">Messages</a>
        <a href="#" className="block px-4 py-2 rounded hover:bg-blue-300">Progress Tracking</a>
        <a href="#" className="block px-4 py-2 rounded hover:bg-blue-300">Feedbacks</a>
        <a href="#" className="block px-4 py-2 rounded hover:bg-blue-300">Patient Details</a>

        <div className="relative">
          <button
            onClick={() => setBlogDropdownOpen(!blogDropdownOpen)}
            className="w-full flex items-center justify-between px-4 py-2 rounded hover:bg-blue-300 font-medium"
          >
            <span>Manage Blog</span>
            {blogDropdownOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>

          {blogDropdownOpen && (
            <div className="mt-2 ml-2 space-y-2 animate-fade-in-down">
              <a href="/blogMC" className="flex items-center gap-2 px-4 py-1 rounded hover:bg-blue-200 text-sm">
                <BookOpen size={16} /> Read Blogs
              </a>
              <a href="/myBlogs" className="flex items-center gap-2 px-4 py-1 rounded hover:bg-blue-200 text-sm">
                <FileText size={16} /> My Blogs
              </a>
              <a href="/write" className="flex items-center gap-2 px-4 py-1 rounded hover:bg-blue-200 text-sm">
                <Edit3 size={16} /> Write a Blog
              </a>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
