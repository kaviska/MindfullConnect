"use client";
import { useAuth } from "@/context/AuthContext"; // adjust path if needed
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardRedirect() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) return;

    // Optional: auto-redirect based on role
    // if (user.role === "counselor") router.push("/availability");
    // else router.push("/book");

    // OR Show options manually
  }, [user]);

  if (!user) return <p>Loading...</p>;

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-6 text-center">
      <h1 className="text-2xl font-semibold">Welcome, {user.fullName}!</h1>
      <p className="text-gray-500">Where would you like to go?</p>

      <div className="flex gap-4">
        <button
          className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
          onClick={() => router.push("/session")}
        >
          Go to Booking System
        </button>
        <button
          className="px-6 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700"
          onClick={() => router.push("/chatinterface")}
        >
          Go to Chat Interface
        </button>
      </div>
    </div>
  );
}
