"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type JoinWithSDKButtonProps = {
  meetingId: string;
  sdkKey?: string;
  password?: string;
  userName?: string;
};

export function JoinWithSDKButton({
  meetingId = "85733644491",
  sdkKey = "dhyhywQQlm1AqxTlNBpiw",
  password = "",
  userName = "Guest",
}: JoinWithSDKButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleJoin = async () => {
    console.log("Joining with SDK:", { meetingId, sdkKey, password, userName });
    console.log("Environment SDK Key:", process.env.NEXT_PUBLIC_ZOOM_SDK_KEY);

    if (!meetingId) {
      alert("Meeting ID is required");
      console.error("Missing meetingId:", meetingId);
      return;
    }

    if (!sdkKey) {
      alert("SDK Key is required");
      console.error("Missing sdkKey:", sdkKey);
      return;
    }

    setIsLoading(true);

    try {
      console.log("Making API call to fetch signature...", {
        url: "/api/zoom/sdkSignature",
        meetingId,
        currentOrigin: window.location.origin,
      });

      const res = await fetch("/api/zoom/sdkSignature", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ meetingNumber: meetingId, role: 0 }),
      });

      console.log("API response received:", {
        status: res.status,
        ok: res.ok,
        url: res.url,
      });

      const data = await res.json();
      console.log("API response data:", data);

      if (!res.ok) {
        const errorMsg =
          data.error || `Failed to get Zoom signature: ${res.status}`;
        alert(errorMsg);
        console.error("Signature API error:", data);
        return;
      }

      console.log("Signature response:", data);

      // Use the SDK key from the response to ensure consistency
      const effectiveSDKKey = data.sdkKey || sdkKey;

      //Redirect to Zoom meeting page
      router.push(
        `/zoom/${encodeURIComponent(meetingId)}?signature=${encodeURIComponent(data.signature)}&sdkKey=${encodeURIComponent(effectiveSDKKey)}&password=${encodeURIComponent(password)}&user=${encodeURIComponent(userName)}`
      );
    } catch (error) {
      const errorMsg = `Network error while fetching signature: ${error instanceof Error ? error.message : "Unknown error"}`;
      alert(errorMsg);
      console.error("Detailed error:", {
        error,
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : "No stack trace",
        currentURL: window.location.href,
        targetAPI: "/api/zoom/sdkSignature",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleJoin}
      className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
      disabled={isLoading}
    >
      {isLoading ? "Joining..." : "Join via SDK"}
    </button>
  );
}
