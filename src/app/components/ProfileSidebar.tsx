// ✅ Update ProfileSidebar.tsx - Make EVERYTHING scrollable together
"use client";

import { useAuth } from "@/context/AuthContext";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Mail,
  Settings,
  Shield,
  Star,
  User,
} from "lucide-react";
import React from "react";
import ClientList from "./ClientList";
import { Conversation } from "./types";

interface ProfileSidebarProps {
  className?: string;
  onBack?: () => void;
  conversation?: Conversation | null;
}

export const ProfileSidebar: React.FC<ProfileSidebarProps> = ({
  className,
  onBack,
  conversation,
}) => {
  const { user } = useAuth();

  // Get the other participant (not the current user)
  const otherParticipant = conversation?.participants.find(
    (participant) => participant._id !== user?._id
  );

  // If no conversation is selected, show empty state
  if (!conversation || !otherParticipant) {
    return (
      <aside
        className={`flex flex-col bg-white border-l border-blue-100 h-full ${className || ""}`}
      >
        <div className="flex flex-col items-center justify-center h-full text-center p-6">
          <User className="w-16 h-16 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-500 mb-2">
            No Conversation Selected
          </h3>
          <p className="text-gray-400 text-sm">
            Select a conversation to view contact details
          </p>
        </div>
      </aside>
    );
  }

  return (
    <aside
      className={`flex flex-col bg-white border-l border-blue-100 h-full ${className || ""}`}
    >
      {/* ✅ ENTIRE CONTENT SCROLLABLE - Everything scrolls together */}
      <div className="flex-1 overflow-y-auto">
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
            <h2 className="text-lg font-semibold text-gray-900">Contact Info</h2>
          </div>

          {/* Participant Profile */}
          <div className="text-center">
            <div className="relative inline-block mb-4">
              <div className="w-20 h-20 rounded-full overflow-hidden">
                {otherParticipant.profileImageUrl ? (
                  <img
                    src={otherParticipant.profileImageUrl}
                    alt={otherParticipant.fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-xl">
                    {otherParticipant.fullName
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("") || "U"}
                  </div>
                )}
              </div>
              {/* Online status indicator */}
              <div
                className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white ${
                  otherParticipant.isOnline ? "bg-green-500" : "bg-gray-400"
                }`}
              ></div>
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-1 line-clamp-2">
              {otherParticipant.fullName || "Unknown User"}
            </h3>
            <p className="text-sm text-gray-500 mb-2 capitalize">
              {otherParticipant.role || "User"}
            </p>

            {/* Participant role badge */}
            <div
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-4 ${
                otherParticipant.role === "counselor"
                  ? "bg-blue-100 text-blue-700"
                  : otherParticipant.role === "patient"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-700"
              }`}
            >
              <User className="w-3 h-3" />
              {otherParticipant.role === "counselor"
                ? "Counselor"
                : otherParticipant.role === "patient"
                  ? "Patient"
                  : "User"}
            </div>

            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2 text-sm text-gray-600 justify-center">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">
                  {otherParticipant.email || "No email available"}
                </span>
              </div>

              {/* Show specialty if counselor */}
              {otherParticipant.role === "counselor" && (
                <div className="flex items-center gap-2 text-sm text-gray-600 justify-center">
                  <Star className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">
                    {(otherParticipant as any).specialty || "General Therapy"}
                  </span>
                </div>
              )}

              {/* Show last seen */}
              <div className="flex items-center gap-2 text-sm text-gray-600 justify-center">
                <Clock className="w-4 h-4 flex-shrink-0" />
                <span>
                  {otherParticipant.isOnline
                    ? "Online now"
                    : "Last seen recently"}
                </span>
              </div>
            </div>

            {/* Online/Offline Status */}
            <div
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                otherParticipant.isOnline
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  otherParticipant.isOnline ? "bg-green-500" : "bg-gray-400"
                }`}
              ></div>
              {otherParticipant.isOnline ? "Online" : "Offline"}
            </div>

            {/* Report User Button */}
            <div className="mt-6 pt-4 border-t border-gray-100">
              <button
                onClick={() => console.log("Report user:", otherParticipant._id)}
                className="w-full bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 hover:border-red-300 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 group"
              >
                <svg
                  className="w-4 h-4 group-hover:scale-110 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
                Report User
              </button>
              <p className="text-xs text-gray-500 text-center mt-2">
                Report inappropriate behavior
              </p>
            </div>
          </div>
        </div>

        {/* Conversation Info */}
        <div className="p-4 border-b border-blue-100">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">
            Conversation Details
          </h4>
          <div className="space-y-3">
            {/* Encryption Status */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Shield className="w-4 h-4 flex-shrink-0" />
                <span>Encryption</span>
              </div>
              <span
                className={`text-sm font-medium ${
                  conversation.encryptionEnabled
                    ? "text-green-600"
                    : "text-gray-500"
                }`}
              >
                {conversation.encryptionEnabled ? "Enabled" : "Disabled"}
              </span>
            </div>

            {/* Created Date */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4 flex-shrink-0" />
                <span>Started</span>
              </div>
              <span className="text-sm font-medium text-gray-900">
                {conversation.createdAt
                  ? new Date(conversation.createdAt).toLocaleDateString()
                  : "Unknown"}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="p-4 border-b border-blue-100">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">
            Quick Actions
          </h4>
          <div className="space-y-2">
            {/* View Profile (if counselor) */}
            {/* {otherParticipant.role === "counselor" && (
              // <button className="w-full flex items-center gap-3 p-3 text-left text-gray-700 hover:bg-blue-50 rounded-lg transition-colors">
              //   <User className="w-5 h-5 flex-shrink-0" />
              //   <span className="truncate">View Counselor Profile</span>
              // </button>
            )} */}

            {/* Schedule Session (if counselor) */}
            {otherParticipant.role === "counselor" && (
              <button className="w-full flex items-center gap-3 p-3 text-left text-gray-700 hover:bg-blue-50 rounded-lg transition-colors">
                <Calendar className="w-5 h-5 flex-shrink-0" />
                <span className="truncate">Schedule Session</span>
              </button>
            )}

            {/* Conversation Settings */}
            
          </div>
        </div>

        {/* Counselor Info / Recent Activity */}
        <div className="p-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">
            {otherParticipant.role === "counselor"
              ? "Counselor Info"
              : "Recent Activity"}
          </h4>

          {otherParticipant.role === "counselor" ? (
            // Counselor info
            <div className="space-y-3 text-sm">
              <div className="bg-blue-50 rounded-lg p-3">
                <p className="text-blue-900 font-medium mb-1">
                  Professional Background
                </p>
                <p className="text-blue-700 text-xs leading-relaxed">
                  Licensed therapist specializing in cognitive behavioral
                  therapy and anxiety disorders. Over 10 years of experience
                  helping clients overcome mental health challenges.
                </p>
              </div>


              <div className="bg-purple-50 rounded-lg p-3">
                <p className="text-purple-900 font-medium mb-1">
                  Specializations
                </p>
                <p className="text-purple-700 text-xs leading-relaxed">
                  • Anxiety and Depression
                  <br />
                  • Relationship Counseling
                  <br />
                  • Stress Management
                  <br />
                  • Cognitive Behavioral Therapy
                </p>
              </div>

              <div className="bg-orange-50 rounded-lg p-3">
                <p className="text-orange-900 font-medium mb-1">
                  Contact Preferences
                </p>
                <p className="text-orange-700 text-xs">
                  Prefers chat messages during business hours. Emergency
                  support available 24/7.
                </p>
              </div>

              

              <div className="bg-pink-50 rounded-lg p-3">
                <p className="text-pink-900 font-medium mb-1">
                  Treatment Approach
                </p>
                <p className="text-pink-700 text-xs leading-relaxed">
                  Uses evidence-based approaches including CBT, mindfulness, and solution-focused therapy. 
                  Believes in creating a safe, non-judgmental space for healing and growth.
                </p>
              </div>

            ]

              <div className="bg-teal-50 rounded-lg p-3">
                <p className="text-teal-900 font-medium mb-1">
                  Office Hours & Policies
                </p>
                <p className="text-teal-700 text-xs leading-relaxed">
                  • Sessions available Monday-Friday 9 AM - 6 PM<br />
                  • Emergency support: 24/7 crisis line available<br />
                  • Cancellation policy: 24-hour notice required<br />
                  • Session duration: 50 minutes standard<br />
                  • Follow-up: Homework assignments and progress tracking
                </p>
              </div>
            </div>
          ) : (
            <ClientList />
          )}
        </div>
      </div>
    </aside>
  );
};

export default ProfileSidebar;