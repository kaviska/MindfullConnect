// ✅ Create src/app/components/sessions/SessionDetailsModal.tsx
"use client";

import React from "react";
import { BookedSession } from "../types";
import { X, Calendar, Clock, User, Video, MapPin } from "lucide-react";

interface SessionDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: BookedSession | null;
}

export const SessionDetailsModal: React.FC<SessionDetailsModalProps> = ({
  isOpen,
  onClose,
  session,
}) => {
  if (!isOpen || !session) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-700 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-200";
      case "completed":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "counselor requested reschedule":
        return "bg-orange-100 text-orange-700 border-orange-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Session Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status Badge */}
          <div className="flex justify-center">
            <span
              className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(
                session.status
              )}`}
            >
              {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
            </span>
          </div>

          {/* Session Info */}
          <div className="space-y-4">
            {/* Session ID */}
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <User className="w-5 h-5 text-gray-600" />
              <div>
                <p className="text-sm text-gray-600">Session ID</p>
                <p className="font-medium text-gray-900">#{session.id}</p>
              </div>
            </div>

            {/* Date */}
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Calendar className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Date</p>
                <p className="font-medium text-gray-900">{formatDate(session.date)}</p>
              </div>
            </div>

            {/* Time */}
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Clock className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Time</p>
                <p className="font-medium text-gray-900">{formatTime(session.time)}</p>
              </div>
            </div>

            {/* Duration */}
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Video className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Duration</p>
                <p className="font-medium text-gray-900">{session.duration} minutes</p>
              </div>
            </div>

            {/* Counselor */}
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Counselor</p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold">
                  {session.counselor?.name
                    ?.split(' ')
                    .map(n => n[0])
                    .join('') || 'C'}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{session.counselor?.name}</p>
                  <p className="text-sm text-gray-600">{session.counselor?.specialty}</p>
                </div>
              </div>
            </div>

            {/* Zoom Link */}
            {session.zoomLink && (
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <MapPin className="w-5 h-5 text-green-600" />
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Meeting Link</p>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-900 text-sm font-mono truncate">
                      {session.zoomLink}
                    </p>
                    <button
                      onClick={() => navigator.clipboard.writeText(session.zoomLink!)}
                      className="bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700 transition-colors"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Created At */}
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Calendar className="w-5 h-5 text-gray-600" />
              <div>
                <p className="text-sm text-gray-600">Booked On</p>
                <p className="font-medium text-gray-900">
                  {new Date(session.createdAt).toLocaleDateString()} at{' '}
                  {new Date(session.createdAt).toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6">
          <button
            onClick={onClose}
            className="w-full bg-gray-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionDetailsModal;