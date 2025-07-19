"use client";

import { JoinWithSDKButton } from "@/components/ui/JoinWithSDKButton";
import { Pencil, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-600",
  confirmed: "bg-blue-100 text-blue-600",
  completed: "bg-green-100 text-green-600",
  cancelled: "bg-red-100 text-red-600",
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
  onDeleteAction,
}: SessionProps) {
  const [formattedDateTime, setFormattedDateTime] = useState<string>("");
  const [isDeleting, setIsDeleting] = useState(false);

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

  const isSessionCancelled = status === "cancelled";
  const shouldDisableJoin = isSessionCancelled || !zoomLink;

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
        {zoomLink && !isSessionCancelled ? (
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
            {isSessionCancelled ? "Cancelled" : "No link"}
          </span>
        )}
      </td>

      <td className="px-6 py-4">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
            statusColors[status] || "bg-gray-200 text-gray-600"
          }`}
        >
          <div
            className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
              status === "pending"
                ? "bg-yellow-400"
                : status === "confirmed"
                  ? "bg-blue-400"
                  : status === "completed"
                    ? "bg-green-400"
                    : status === "cancelled"
                      ? "bg-red-400"
                      : "bg-gray-400"
            }`}
          ></div>
          {status}
        </span>
      </td>

      <td className="px-6 py-4">
        <div className="flex items-center space-x-2">
          {zoomLink && !isSessionCancelled ? (
            <JoinWithSDKButton
              meetingId={_id}
              sdkKey={process.env.ZOOM_SDK_KEY}
            />
          ) : zoomLink && isSessionCancelled ? (
            <div className="opacity-50 cursor-not-allowed">
              <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-500 text-xs font-medium rounded-lg">
                SDK Join Disabled
              </span>
            </div>
          ) : null}
          <button
            className={`p-2 rounded-lg transition-all duration-200 ${
              isSessionCancelled
                ? "text-gray-400 cursor-not-allowed"
                : "text-purple-600 hover:text-purple-800 hover:bg-purple-50"
            }`}
            disabled={isSessionCancelled}
          >
            <Pencil className="w-4 h-4" />
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
