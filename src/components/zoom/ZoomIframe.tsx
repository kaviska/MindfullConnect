"use client";

import { useEffect, useRef, useState } from "react";

type ZoomIframeProps = {
  meetingId: string;
  signature: string;
  sdkKey: string;
  password: string;
  userName: string;
  onJoinedAction?: () => void;
  onErrorAction?: (error: string) => void;
  onLeaveAction?: () => void;
};

export default function ZoomIframe({
  meetingId,
  signature,
  sdkKey,
  password,
  userName,
  onJoinedAction,
  onErrorAction,
  onLeaveAction,
}: ZoomIframeProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [status, setStatus] = useState<
    "loading" | "ready" | "joined" | "error"
  >("loading");
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Security: Only accept messages from our own origin
      if (event.origin !== window.location.origin) {
        return;
      }

      const { type, error, meetingId: eventMeetingId } = event.data;

      switch (type) {
        case "ZOOM_SDK_READY":
          console.log("Zoom SDK is ready");
          setStatus("ready");
          break;

        case "ZOOM_JOINED":
          console.log("Successfully joined Zoom meeting:", eventMeetingId);
          setStatus("joined");
          onJoinedAction?.();
          break;

        case "ZOOM_ERROR":
          console.error("Zoom error:", error);
          setStatus("error");
          setErrorMessage(error);
          onErrorAction?.(error);
          break;

        default:
          console.log("Unknown message type:", type);
      }
    };

    window.addEventListener("message", handleMessage);

    // Add timeout to detect if iframe is not responding
    const timeout = setTimeout(() => {
      if (status === "loading") {
        console.error("Iframe initialization timeout");
        setStatus("error");
        setErrorMessage("Meeting initialization timed out. Please try again.");
      }
    }, 30000); // 30 second timeout

    return () => {
      window.removeEventListener("message", handleMessage);
      clearTimeout(timeout);
    };
  }, [onJoinedAction, onErrorAction, status]);

  const leaveMeeting = () => {
    if (iframeRef.current) {
      iframeRef.current.contentWindow?.postMessage(
        { type: "LEAVE_MEETING" },
        "*"
      );
      onLeaveAction?.();
    }
  };

  const iframeUrl = `/zoom-iframe.html?meetingId=${encodeURIComponent(meetingId)}&signature=${encodeURIComponent(signature)}&sdkKey=${encodeURIComponent(sdkKey)}&password=${encodeURIComponent(password)}&userName=${encodeURIComponent(userName)}`;

  // Debug logging
  useEffect(() => {
    console.log("ZoomIframe parameters:", {
      meetingId,
      signature,
      sdkKey,
      password,
      userName,
      iframeUrl,
    });
  }, [meetingId, signature, sdkKey, password, userName, iframeUrl]);

  if (status === "error") {
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
          <p className="text-red-600 mb-4">{errorMessage}</p>
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

  return (
    <div className="relative w-full h-screen">
      {status === "loading" && (
        <div className="absolute inset-0 bg-blue-50 flex flex-col items-center justify-center z-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-blue-600 font-medium">
            Loading Zoom Meeting...
          </p>
          <p className="mt-2 text-sm text-gray-500">Meeting ID: {meetingId}</p>
        </div>
      )}

      {status === "joined" && (
        <div className="absolute top-4 right-4 z-20">
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
      )}

      <iframe
        ref={iframeRef}
        src={iframeUrl}
        className="w-full h-full border-0"
        title="Zoom Meeting"
        allow="camera; microphone; fullscreen; speaker; display-capture"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-orientation-lock allow-presentation"
        onLoad={() => {
          console.log("Iframe loaded successfully");
        }}
        onError={(e) => {
          console.error("Iframe load error:", e);
          setStatus("error");
          setErrorMessage("Failed to load meeting interface");
        }}
      />
    </div>
  );
}
