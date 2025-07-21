"use client";

import { useEffect } from "react";
import { useZoomSDK } from "@/hooks/useZoomSDK";
import { useSearchParams } from "next/navigation";

interface ZoomMeetingProps {
  meetingId: string;
  signature: string;
  sdkKey: string;
  password?: string;
  userName?: string;
}

export default function ZoomMeeting({
  meetingId,
  signature,
  sdkKey,
  password = "",
  userName = "Guest",
}: ZoomMeetingProps) {
  const { status, error, joinMeeting, leaveMeeting } = useZoomSDK({
    onJoined: () => {
      console.log("Successfully joined the meeting");
    },
    onLeft: () => {
      console.log("Left the meeting");
      // Optionally redirect back
      window.history.back();
    },
    onError: (error) => {
      console.error("Meeting error:", error);
    },
  });

  // Auto-join when component mounts and SDK is ready
  useEffect(() => {
    if (status === "ready" && meetingId && signature && sdkKey) {
      console.log("Starting auto-join with parameters:", {
        meetingId,
        signature: signature.substring(0, 30) + "...",
        sdkKey,
        password: password ? "[REDACTED]" : "[EMPTY]",
        userName,
      });

      joinMeeting({
        meetingId,
        signature,
        sdkKey,
        password,
        userName,
      }).catch((error) => {
        console.error("Failed to join meeting:", error);
      });
    } else {
      console.log("Auto-join conditions not met:", {
        status,
        hasMeetingId: !!meetingId,
        hasSignature: !!signature,
        hasSDKKey: !!sdkKey,
      });
    }
  }, [status, meetingId, signature, sdkKey, password, userName, joinMeeting]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-red-50 p-8">
        <div className="bg-white p-6 rounded-lg shadow-lg border border-red-200 max-w-md w-full">
          <div className="flex items-center mb-4">
            <svg
              className="w-6 h-6 text-red-500 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="text-lg font-semibold text-red-800">
              Meeting Join Failed
            </h3>
          </div>
          <p className="text-red-600 mb-4">{error}</p>
          <div className="flex gap-2">
            <button
              onClick={() => window.location.reload()}
              className="flex-1 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
            >
              Retry
            </button>
            <button
              onClick={() => window.history.back()}
              className="flex-1 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (status === "joined") {
    return (
      <div className="relative w-full h-screen">
        {/* Leave button overlay */}
        <div className="absolute top-4 right-4 z-50">
          <button
            onClick={leaveMeeting}
            className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-red-600 transition-colors flex items-center gap-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Leave Meeting
          </button>
        </div>

        {/* Meeting container - Zoom SDK will render here */}
        <div id="zmmtg-root" className="w-full h-full"></div>
      </div>
    );
  }

  // Loading states
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-blue-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
      <p className="text-blue-600 font-medium">
        {status === "loading"
          ? "Loading Zoom SDK..."
          : status === "ready"
            ? "Preparing to join meeting..."
            : status === "joining"
              ? "Joining meeting..."
              : "Initializing..."}
      </p>
      <p className="mt-2 text-sm text-gray-500">Meeting ID: {meetingId}</p>
    </div>
  );
}
