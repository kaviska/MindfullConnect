"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import ZoomMeeting from "@/components/zoom/ZoomMeeting";

export default function ZoomMeetingPage({
  params,
}: {
  params: Promise<{ meetingID: string }>;
}) {
  const [meetingId, setMeetingId] = useState<string>("");
  const searchParams = useSearchParams();
  const signature = searchParams.get("signature") || "";
  const sdkKey =
    searchParams.get("sdkKey") || process.env.NEXT_PUBLIC_ZOOM_SDK_KEY || "";
  const password = searchParams.get("password") || "";
  const userName = searchParams.get("user") || "Guest";

  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params;
      setMeetingId(resolvedParams.meetingID);
    };
    getParams();
  }, [params]);

  useEffect(() => {
    if (meetingId) {
      console.log("Joining Zoom meeting:", meetingId);
    }
  }, [meetingId, signature, sdkKey, password, userName, searchParams]);

  if (!meetingId || !signature || !sdkKey) {
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
              Missing Parameters
            </h3>
          </div>
          <p className="text-red-600 mb-4">
            Error: Missing Zoom parameters. Please try again.
          </p>
          <p className="text-sm text-gray-600 mb-4">
            Missing:{" "}
            {[
              !meetingId && "Meeting ID",
              !signature && "Signature",
              !sdkKey && "SDK Key",
            ]
              .filter(Boolean)
              .join(", ")}
          </p>
          <button
            onClick={() => window.history.back()}
            className="w-full bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ZoomMeeting
        meetingId={meetingId}
        signature={signature}
        sdkKey={sdkKey}
        password={password}
        userName={userName}
      />
    </Suspense>
  );
}
