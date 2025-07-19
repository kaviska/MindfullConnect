"use client";

import React from "react";
import ClientList from "./ClientList";
import { useAuth } from "@/context/AuthContext";
import { ArrowLeft, User, Settings, LogOut, Mail, Phone } from "lucide-react";

interface ProfileSidebarProps {
  className?: string;
  onBack?: () => void;
}

export const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ className, onBack }) => {
  const { user, logout } = useAuth();

  return (
    <aside className={`flex flex-col bg-white border-l border-blue-100 h-full ${className || ""}`}>
      {/* Header */}
      <div className="p-6 border-b border-blue-100">
        <div className="flex items-center justify-between mb-6">
          {onBack && (
            <button 
              onClick={onBack} 
              className="sm:hidden p-2 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
          )}
          <h2 className="text-lg font-semibold text-gray-900">Profile</h2>
        </div>

        {/* User Profile */}
        <div className="text-center">
          <div className="relative inline-block mb-4">
            <div className="w-20 h-20 rounded-full overflow-hidden">
              {user?.profileImageUrl ? (
                <img
                  src={user.profileImageUrl}
                  alt={user.fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-xl">
                  {user?.fullName?.split(' ').map(n => n[0]).join('') || 'U'}
                </div>
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          
          <h3 className="text-xl font-bold text-gray-900 mb-1">{user?.fullName || 'User'}</h3>
          <p className="text-sm text-gray-500 mb-4 capitalize">{user?.role || 'User'}</p>
          
          {/* Contact Info */}
          <div className="space-y-2 mb-6">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Mail className="w-4 h-4" />
              <span>{user?.email || 'No email'}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Phone className="w-4 h-4" />
              <span>+1 (555) 123-4567</span>
            </div>
          </div>

          {/* Status */}
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            Online
          </div>
        </div>
      </div>

      {/* Menu Options */}
      <div className="p-4 space-y-2">
        <button className="w-full flex items-center gap-3 p-3 text-left text-gray-700 hover:bg-blue-50 rounded-lg transition-colors">
          <User className="w-5 h-5" />
          <span>View Profile</span>
        </button>
        
        <button className="w-full flex items-center gap-3 p-3 text-left text-gray-700 hover:bg-blue-50 rounded-lg transition-colors">
          <Settings className="w-5 h-5" />
          <span>Settings</span>
        </button>
        
        <hr className="my-4 border-blue-100" />
        
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 p-3 text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>

      {/* Client List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Recent Contacts</h4>
          <ClientList />
        </div>
      </div>
    </aside>
  );
};

export default ProfileSidebar;