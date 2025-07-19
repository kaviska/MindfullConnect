"use client";

import { ChatMain } from "@/app/components/ChatMain";
import { ChatSidebar } from "@/app/components/ChatSidebar";
import { ProfileSidebar } from "@/app/components/ProfileSidebar";
import { Conversation } from "@/app/components/types";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";

export default function Page() {
  const { user, token, isLoading } = useAuth();
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [isProfileSidebarVisible, setIsProfileSidebarVisible] = useState(false);
  const [showProfileSidebar, setShowProfileSidebar] = useState(false);
  const [layoutHeight, setLayoutHeight] = useState<number>(0);
  const [showChatMain, setShowChatMain] = useState(false);

  useEffect(() => {
    const updateLayoutHeight = () => {
      const navbarHeight = 64;
      const windowHeight = window.innerHeight;
      const calculatedHeight = windowHeight - navbarHeight;
      setLayoutHeight(calculatedHeight);
    };

    updateLayoutHeight();
    window.addEventListener("resize", updateLayoutHeight);
    return () => window.removeEventListener("resize", updateLayoutHeight);
  }, []);

  useEffect(() => {
    if (isLoading) return;
    if (!user || !token) {
      router.push("/login");
    }
  }, [user, token, isLoading, router]);

  const fetchUsers = useCallback(async () => {
    if (isLoading || !user) return;

    try {
      const res = await fetch("/api/users", {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (res.ok) {
        const filtered = data.users.filter((u: any) => u._id !== user._id);
        setUsers(filtered);
      } else {
        console.error("Failed to fetch users:", data.error);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  }, [user, isLoading]);

  const fetchConversations = useCallback(async () => {
    if (isLoading || !user) return;

    try {
      const res = await fetch("/api/conversations", {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (res.ok) {
        setConversations(data.conversations);
      } else {
        console.error("Failed to fetch conversations:", data.error);
      }
    } catch (err) {
      console.error("Error fetching conversations:", err);
    }
  }, [user, isLoading]);

  useEffect(() => {
    fetchConversations();
    fetchUsers();
  }, [fetchConversations, fetchUsers]);

  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversationId(conversationId);
    setShowChatMain(true);
    fetchConversations();
  };

  const handleBack = () => {
    setShowChatMain(false);
    setSelectedConversationId(null);
    setShowProfileSidebar(false);
    setIsProfileSidebarVisible(false);
  };

  const toggleProfileSidebar = () => {
    if (showChatMain && !isProfileSidebarVisible) {
      setShowProfileSidebar((prev) => !prev);
    } else {
      setIsProfileSidebarVisible((prev) => !prev);
      setShowProfileSidebar(false);
    }
  };

  const handleProfileBack = () => {
    setShowProfileSidebar(false);
    setIsProfileSidebarVisible(false);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-[#f8fcff] to-[#e3f2fd]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-blue-600 font-medium">Loading authentication...</p>
        </div>
      </div>
    );
  }

  if (!user || !token) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-[#f8fcff] to-[#e3f2fd]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-blue-600 font-medium">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fcff] to-[#e3f2fd] p-4">
      <div
        className="flex flex-col w-full max-w-7xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden"
        style={{ height: `${layoutHeight - 32}px` }}
      >
        <div className="flex w-full h-full">
          <div className="flex w-full sm:flex sm:w-full sm:h-full">
            <div className={`${showChatMain ? "hidden sm:flex" : "flex"} w-full sm:w-auto`}>
              <div className="w-full sm:w-[320px] md:w-[320px] max-md:w-full">
                <ChatSidebar
                  onSelectConversation={handleSelectConversation}
                  conversations={conversations}
                  users={users}
                  className="w-full h-full"
                />
              </div>
            </div>

            <div className={`${showChatMain ? "flex" : "hidden sm:flex"} w-full sm:w-auto flex-1`}>
              <div className={`${showProfileSidebar ? "hidden sm:flex" : "flex"} w-full sm:w-auto flex-1`}>
                <ChatMain
                  conversationId={selectedConversationId}
                  user={user}
                  token={token}
                  conversation={conversations.find((conv) => conv._id === selectedConversationId)}
                  onToggleProfileSidebar={toggleProfileSidebar}
                  fetchConversations={fetchConversations}
                  onBack={handleBack}
                  className="w-full h-full"
                />
              </div>

              {(isProfileSidebarVisible || showProfileSidebar) && (
                <div className={`${showProfileSidebar ? "flex" : "hidden sm:flex"} w-full sm:w-auto`}>
                  <ProfileSidebar
                    onBack={handleProfileBack}
                    className="w-full sm:w-[320px] md:w-[320px] h-full"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
