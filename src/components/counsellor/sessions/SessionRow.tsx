"use client";

import { Pencil, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-600",
  confirmed: "bg-blue-100 text-blue-600",
  completed: "bg-green-100 text-green-600",
  cancelled: "bg-red-100 text-red-600",
  "counselor requested reschedule": "bg-orange-100 text-orange-600",
  overdue: "bg-red-200 text-red-700",
};

interface SessionProps {
  _id: string;
  patientId: {
    _id: string;
    fullName: string;
    email: string;
  };
  counselorId: string;
  date: string; // Format: "YYYY-MM-DD"
  time: string; // Format: "HH:mm"
  duration: number;
  status: string;
  zoomLink?: string;
  zoomMeetingId?: string;
  createdAt: string;
  onDeleteAction?: (sessionId: string) => void;
}

export default function SessionRow({
  _id,
  patientId,
  date,
  time,
  duration,
  status,
  zoomLink,
  zoomMeetingId,
  onDeleteAction,
}: SessionProps) {
  const [formattedDateTime, setFormattedDateTime] = useState<string>("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [effectiveStatus, setEffectiveStatus] = useState<string>(status);

  // Function to extract meeting ID from Zoom link if zoomMeetingId is not available
  const extractMeetingIdFromLink = (zoomLink: string): string | null => {
    if (!zoomLink) return null;

    // Common Zoom link patterns:
    // https://zoom.us/j/1234567890
    // https://us02web.zoom.us/j/1234567890
    // https://zoom.us/j/1234567890?pwd=...
    const patterns = [
      /\/j\/(\d+)/, // /j/123456789
      /meeting_number=(\d+)/, // meeting_number=123456789
      /meetingNumber=(\d+)/, // meetingNumber=123456789
    ];

    for (const pattern of patterns) {
      const match = zoomLink.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }

    return null;
  };

  // Get effective meeting ID
  const effectiveMeetingId =
    zoomMeetingId || extractMeetingIdFromLink(zoomLink || "");

  // Debug logging for Zoom data
  useEffect(() => {
    console.log("SessionRow Zoom data:", {
      sessionId: _id,
      zoomLink,
      zoomMeetingId,
      effectiveMeetingId,
      hasZoomLink: !!zoomLink,
      hasZoomMeetingId: !!zoomMeetingId,
      hasEffectiveMeetingId: !!effectiveMeetingId,
    });
  }, [_id, zoomLink, zoomMeetingId, effectiveMeetingId]);

  // Function to determine if session is overdue
  const isSessionOverdue = () => {
    try {
      const sessionDateTime = new Date(`${date}T${time}`);
      const now = new Date();
      return (
        sessionDateTime < now && !["completed", "cancelled"].includes(status)
      );
    } catch (error) {
      return false;
    }
  };

  useEffect(() => {
    // Update effective status based on whether session is overdue
    const updateStatus = () => {
      if (isSessionOverdue()) {
        setEffectiveStatus("overdue");
      } else {
        setEffectiveStatus(status);
      }
    };

    // Initial update
    updateStatus();

    // Set up interval to check every minute for real-time updates
    const interval = setInterval(updateStatus, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [date, time, status]);

  useEffect(() => {
    // Combine date and time to create a proper datetime
    try {
      const dateTime = new Date(`${date}T${time}`);
      if (!isNaN(dateTime.getTime())) {
        setFormattedDateTime(dateTime.toLocaleString());
      } else {
        setFormattedDateTime(`${date} at ${time}`);
      }
    } catch (error) {
      setFormattedDateTime(`${date} at ${time}`);
    }
  }, [date, time]);

  const handleDelete = async () => {
    if (isDeleting) return;

    const confirmDelete = window.confirm(
      "Are you sure you want to cancel this session? This will update the status to cancelled and remove the Zoom link."
    );

    if (!confirmDelete) return;

    setIsDeleting(true);
    try {
      // Call the delete/cancel API
      const response = await fetch(`/api/sessions/${_id}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to cancel session");
      }
//newline
      // Call the parent's onDeleteAction callback to refresh the data
      if (onDeleteAction) {
        onDeleteAction(_id);
      }
    } catch (error: any) {
      console.error("Error cancelling session:", error);
      alert(`Failed to cancel session: ${error.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = async () => {
    if (isEditing) return;

    const confirmReschedule = window.confirm(
      "Request a reschedule for this session? This will change the status to 'counselor requested reschedule' and notify the patient."
    );

    if (!confirmReschedule) return;

    setIsEditing(true);
    try {
      // Call the API to update session status
      const response = await fetch(`/api/sessions/${_id}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "counselor requested reschedule",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to request reschedule");
      }

      // Call the parent's onDeleteAction callback to refresh the data
      if (onDeleteAction) {
        onDeleteAction(_id);
      }

      // Show success message
      alert(
        "Reschedule request sent successfully! The patient will be notified."
      );
    } catch (error: any) {
      console.error("Error requesting reschedule:", error);
      alert(`Failed to request reschedule: ${error.message}`);
    } finally {
      setIsEditing(false);
    }
  };

  const isSessionCancelled = status === "cancelled";
  const isSessionRescheduleRequested =
    status === "counselor requested reschedule";
  const shouldDisableJoin =
    isSessionCancelled ||
    !zoomLink ||
    effectiveStatus === "pending" ||
    effectiveStatus === "overdue";

  return (
    <tr className="hover:bg-blue-50/50 transition-all duration-200 group">
      <td className="px-6 py-4">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm mr-3">
            {patientId?.fullName?.charAt(0) || "?"}
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900">
              {patientId?.fullName || "Unknown Patient"}
            </div>
            {patientId?.email && (
              <div className="text-xs text-gray-500">{patientId.email}</div>
            )}
          </div>
        </div>
      </td>

      <td className="px-6 py-4">
        <div className="text-sm text-gray-900 font-medium">
          {formattedDateTime || "-"}
        </div>
      </td>

      <td className="px-6 py-4">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {duration} min
        </span>
      </td>

      <td className="px-6 py-4">
        {zoomLink && !shouldDisableJoin ? (
          <a
            href={zoomLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs font-medium rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <svg
              className="w-3 h-3 mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                clipRule="evenodd"
              />
            </svg>
            Join
          </a>
        ) : (
          <span
            className={`inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-lg ${
              isSessionCancelled
                ? "bg-red-100 text-red-500"
                : effectiveStatus === "pending"
                  ? "bg-yellow-100 text-yellow-600"
                  : effectiveStatus === "overdue"
                    ? "bg-red-100 text-red-600"
                    : "bg-gray-100 text-gray-500"
            }`}
          >
            <svg
              className="w-3 h-3 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {isSessionCancelled
              ? "Cancelled"
              : effectiveStatus === "pending"
                ? "Pending"
                : effectiveStatus === "overdue"
                  ? "Overdue"
                  : "No link"}
          </span>
        )}
      </td>

      <td className="px-6 py-4">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
            statusColors[effectiveStatus] || "bg-gray-200 text-gray-600"
          }`}
        >
          <div
            className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
              effectiveStatus === "pending"
                ? "bg-yellow-400"
                : effectiveStatus === "confirmed"
                  ? "bg-blue-400"
                  : effectiveStatus === "completed"
                    ? "bg-green-400"
                    : effectiveStatus === "cancelled"
                      ? "bg-red-400"
                      : effectiveStatus === "counselor requested reschedule"
                        ? "bg-orange-400"
                        : effectiveStatus === "overdue"
                          ? "bg-red-600"
                          : "bg-gray-400"
            }`}
          ></div>
          {effectiveStatus}
        </span>
      </td>

      <td className="px-6 py-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={handleEdit}
            disabled={
              isEditing || isSessionCancelled || isSessionRescheduleRequested
            }
            className={`p-2 rounded-lg transition-all duration-200 ${
              isSessionCancelled || isSessionRescheduleRequested
                ? "text-gray-400 cursor-not-allowed"
                : isEditing
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-purple-600 hover:text-purple-800 hover:bg-purple-50"
            }`}
            title={
              isSessionRescheduleRequested
                ? "Reschedule already requested"
                : isSessionCancelled
                  ? "Session cancelled"
                  : "Request reschedule"
            }
          >
            {isEditing ? (
              <div className="w-4 h-4 border-2 border-gray-300 border-t-purple-600 rounded-full animate-spin"></div>
            ) : (
              <Pencil className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting || isSessionCancelled}
            className={`p-2 rounded-lg transition-all duration-200 ${
              isSessionCancelled
                ? "text-gray-400 cursor-not-allowed"
                : isDeleting
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-red-500 hover:text-red-700 hover:bg-red-50"
            }`}
          >
            {isDeleting ? (
              <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
          </button>
        </div>
      </td>
    </tr>
  );
}
