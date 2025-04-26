"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ChatMain } from "@/app/components/ChatMain";
import { ChatSidebar } from "@/app/components/ChatSidebar";
import { ProfileSidebar } from "@/app/components/ProfileSidebar";
import { useAuth } from "@/context/AuthContext";
import { Conversation } from "@/app/components/types";

export const ChatLayout: React.FC = () => {
  const { user, token, isLoading } = useAuth();
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);

  // Authentication redirect
  useEffect(() => {
    if (isLoading) {
      console.log("AuthContext is still loading, skipping redirect...");
      return;
    }

    if (!user || !token) {
      console.log("User or token is null, redirecting to login...");
      router.push("/login");
    }
  }, [user, token, isLoading, router]);

  // Fetch users (excluding the logged-in user)
  const fetchUsers = useCallback(async () => {
    if (isLoading || !user || !token) {
      console.log("Skipping fetchUsers: AuthContext is loading or user/token is null");
      return;
    }

    try {
      console.log("Fetching users with token:", token);
      const res = await fetch("/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Response status from /api/users:", res.status);
      const data = await res.json();
      console.log("Response from /api/users:", data);
      if (res.ok) {
        // Filter out the logged-in user
        const filteredUsers = data.users.filter((u: any) => u._id !== user._id);
        console.log("Setting users (excluding logged-in user):", filteredUsers);
        setUsers(filteredUsers);
      } else {
        console.error("Failed to fetch users:", data.error);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }, [user, token, isLoading]);

  // Fetch conversations
  const fetchConversations = useCallback(async () => {
    if (isLoading || !user || !token) {
      console.log("Skipping fetchConversations: AuthContext is loading or user/token is null");
      return;
    }

    try {
      console.log("Fetching conversations with token:", token);
      const res = await fetch("/api/conversations", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Response status from /api/conversations:", res.status);
      const data = await res.json();
      console.log("Response from /api/conversations:", data);
      if (res.ok) {
        console.log("Setting conversations:", data.conversations);
        setConversations(data.conversations);
      } else {
        console.error("Failed to fetch conversations:", data.error);
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
    }
  }, [user, token, isLoading]);

  useEffect(() => {
    fetchConversations();
    fetchUsers();
  }, [fetchConversations, fetchUsers]);

  // Log conversations state changes for debugging
  useEffect(() => {
    console.log("Conversations state updated:", conversations);
  }, [conversations]);

  // Log users state changes for debugging
  useEffect(() => {
    console.log("Users state updated:", users);
  }, [users]);

  // Define handleSelectConversation before it's used in JSX
  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversationId(conversationId);
    fetchConversations(); // Re-fetch conversations to include the new one
  };

  // Redirect UI while waiting for the redirect
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading authentication...</p>
      </div>
    );
  }

  if (!user || !token) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Redirecting to login...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col pt-5 max-md:pt-24 w-full">
      {/* Timeline */}
      <div className="flex justify-center items-center text-xs font-medium text-blue-900 gap-2 my-4">
        <div className="flex-1 h-px bg-indigo-100" />
        <time>Today</time>
        <div className="flex-1 h-px bg-indigo-100" />
      </div>

      {/* Main Layout Row */}
      <div className="flex w-full min-h-screen">
        <ChatSidebar
          onSelectConversation={handleSelectConversation}
          conversations={conversations}
          users={users} // Pass users to ChatSidebar
        />
        <ChatMain
          conversationId={selectedConversationId}
          user={user}
          token={token}
          conversation={conversations.find((conv) => conv._id === selectedConversationId)}
        />
        <ProfileSidebar />
      </div>
    </div>
  );
};

export default ChatLayout;