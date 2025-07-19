"use client";
import { useEffect, useState } from "react";

import ZoomLoader from "@/components/zoom/ZoomLoader";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

export default function ZoomMeetingPage({
  params,
}: {
  params: Promise<{ meetingId: string }>;
}) {
  const [meetingId, setMeetingId] = useState<string>("");
  const searchParams = useSearchParams();
  const signature = searchParams.get("signature") || "";
  const sdkKey = process.env.ZOOM_SDK_KEY || "";
  const password = searchParams.get("password") || "";
  const userName = searchParams.get("user") || "Guest";

  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params;
      setMeetingId(resolvedParams.meetingId);
    };
    getParams();
  }, [params]);

  useEffect(() => {
    if (meetingId) {
      console.log("ZoomMeetingPage params:", {
        meetingId,
        signature,
        sdkKey,
        password,
        userName,
      });
    }
  }, [meetingId, signature, sdkKey, password, userName]);

  if (!meetingId || !signature || !sdkKey) {
    return (
      <div className="p-4 text-red-500">Error: Missing Zoom parameters</div>
    );
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ZoomLoader
        meetingNumber={meetingId}
        sdkKey={sdkKey}
        signature={signature}
        password={password}
        userName={userName}
      />
    </Suspense>
  );
}
