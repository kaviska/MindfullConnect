// ✅ Updated ChatSidebar.tsx with conversation ID logging
"use client";

import { useAuth } from "@/context/AuthContext";
import {
  Filter,
  MessageSquare,
  Plus,
  Search,
  Shield,
  Users,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import ChatUserItemWithActions from "./ChatUserItemWithActions";
import ReportModal from '@/components/ReportModal';
import { ChatUser, Conversation, User } from "./types";
interface ChatSidebarProps {
  onSelectConversation: (conversationId: string) => void;
  conversations: Conversation[];
  users: User[];
  className?: string;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  onSelectConversation,
  conversations,
  users,
  className,
}) => {
  const { user, token } = useAuth();
  const [otherUsers, setOtherUsers] = useState<User[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(conversations[0]?._id || null);
  const [activeTab, setActiveTab] = useState<"all" | "teams" | "unread">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [reportModal, setReportModal] = useState<{
    isOpen: boolean;
    reporteeId: string;
    reporteeName: string;
    chatReferenceId?: string;
  }>({
    isOpen: false,
    reporteeId: "",
    reporteeName: "",
    chatReferenceId: undefined,
  });

  // ✅ Update the handleReportUser function in ChatSidebar.tsx
const handleReportUser = (chatUser: ChatUser, conversationId?: string) => {
  console.log("[ChatSidebar] Opening report modal for user:", {
    userId: chatUser._id,
    userName: chatUser.fullName,
    userRole: chatUser.role,
    conversationId,
  });

  // Validate required data before opening modal
  if (!chatUser._id || !chatUser.fullName) {
    console.error('[ChatSidebar] Invalid user data for reporting:', chatUser);
    alert('Unable to report this user. Please try again.');
    return;
  }

  setReportModal({
    isOpen: true,
    reporteeId: chatUser._id,
    reporteeName: chatUser.fullName,
    chatReferenceId: conversationId,
  });
};

  // ✅ Log initial selected conversation
  useEffect(() => {
    if (selectedConversationId) {
      console.log(
        "[ChatSidebar] Initial selected conversation ID:",
        selectedConversationId
      );
    }
  }, []);

  // ✅ Log whenever selected conversation changes
  useEffect(() => {
    console.log(
      "[ChatSidebar] Selected conversation ID changed to:",
      selectedConversationId
    );
  }, [selectedConversationId]);

  useEffect(() => {
    if (!users) {
      setIsLoadingUsers(false);
      return;
    }

    const conversationParticipantIds = conversations
      .flatMap((conv) => conv.participants)
      .map((p) => p._id)
      .filter((id) => id !== user?._id);

    const filteredUsers = users.filter(
      (u) => u._id !== user?._id && !conversationParticipantIds.includes(u._id)
    );

    setOtherUsers(filteredUsers);
    setIsLoadingUsers(false);
  }, [users, user, conversations]);

  // ✅ Fixed mapping function with all required properties
  const mapConversationToChatUser = (conv: Conversation): ChatUser => {
    const otherParticipant = conv.participants.find((p) => p._id !== user?._id);

    return {
      _id: otherParticipant?._id || "unknown",
      name: otherParticipant?.fullName || "Unknown",
      fullName: otherParticipant?.fullName || "Unknown",
      role: otherParticipant?.role || "user",
      status: "offline",
      avatar: otherParticipant?.profileImageUrl || undefined,
      profileImageUrl: otherParticipant?.profileImageUrl || undefined,
      isTyping: false,
      lastMessage: conv.lastMessage?.isEncrypted
        ? "[Encrypted Message]"
        : conv.lastMessage?.content || "",
      lastMessageTime: conv.lastMessage?.timestamp
        ? new Date(conv.lastMessage.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        : "Unknown",
      unreadCount:
        conv.unreadCounts?.find((uc) =>
          typeof uc.participant === "string"
            ? uc.participant === user?._id
            : uc.participant._id === user?._id
        )?.count || 0,
      encryptionEnabled: conv.encryptionEnabled || false,
      conversationType: conv.conversationType || "general",
    };
  };

  const mapUserToChatUser = (u: User): ChatUser => ({
    _id: u._id,
    name: u.fullName,
    fullName: u.fullName,
    role: u.role || "user",
    status: u.isOnline ? "online" : "offline",
    avatar: u.profileImageUrl || undefined,
    profileImageUrl: u.profileImageUrl || undefined,
    isTyping: false,
    lastMessage: "",
    lastMessageTime: "",
    unreadCount: 0,
    encryptionEnabled: u.encryptionPreference || true,
    conversationType: "general",
  });

  const conversationUsers: ChatUser[] = conversations.map(
    mapConversationToChatUser
  );
  const otherChatUsers: ChatUser[] = otherUsers.map(mapUserToChatUser);

  const filteredConversationUsers = conversationUsers.filter((chatUser) => {
    const matchesSearch =
      searchTerm === "" ||
      chatUser.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chatUser.lastMessage?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "unread" && (chatUser.unreadCount || 0) > 0) ||
      (activeTab === "teams" && chatUser.conversationType === "admin");

    return matchesSearch && matchesTab;
  });

  const filteredOtherUsers = otherChatUsers.filter(
    (chatUser) =>
      searchTerm === "" ||
      chatUser.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ✅ Enhanced handleStartConversation with detailed logging
  const handleStartConversation = async (participantId: string) => {
    console.log(
      "[ChatSidebar] Starting new conversation with participant ID:",
      participantId
    );

    if (!token) {
      console.warn(
        "[ChatSidebar] No token available for starting conversation"
      );
      return;
    }

    try {
      const res = await fetch("/api/conversations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({ participantId }),
      });

      const data = await res.json();
      if (res.ok) {
        console.log("[ChatSidebar] New conversation created successfully:", {
          conversationId: data.conversation._id,
          participantId: participantId,
          participants: data.conversation.participants?.map(
            (p: any) => p._id || p
          ),
        });

        setSelectedConversationId(data.conversation._id);
        onSelectConversation(data.conversation._id);

        console.log(
          "[ChatSidebar] Selected conversation updated to:",
          data.conversation._id
        );
      } else {
        console.error(
          "[ChatSidebar] Failed to start conversation:",
          data.error
        );
      }
    } catch (error) {
      console.error("[ChatSidebar] Error starting conversation:", error);
    }
  };

  // ✅ Enhanced handleSelectConversation with detailed logging
  const handleSelectConversation = (conversationId: string) => {
    console.log("[ChatSidebar] Selecting existing conversation:", {
      conversationId: conversationId,
      previousSelection: selectedConversationId,
      timestamp: new Date().toISOString(),
    });

    // Find conversation details for logging
    const selectedConversation = conversations.find(
      (conv) => conv._id === conversationId
    );
    if (selectedConversation) {
      console.log("[ChatSidebar] Conversation details:", {
        id: selectedConversation._id,
        participants: selectedConversation.participants?.map((p) => ({
          id: p._id,
          name: p.fullName,
          role: p.role,
        })),
        lastMessage: selectedConversation.lastMessage?.content || "No messages",
        encryptionEnabled: selectedConversation.encryptionEnabled,
        createdAt: selectedConversation.createdAt,
      });
    }

    setSelectedConversationId(conversationId);
    onSelectConversation(conversationId);
  };

  return (
    <aside
      className={`flex flex-col bg-white border-r border-blue-100 h-full ${className}`}
    >
      {/* Header */}
      <header className="p-6 border-b border-blue-50">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Messages</h1>
              {/* ✅ Show encryption status */}
              <div className="flex items-center gap-1 text-xs text-green-600">
                <Shield className="w-3 h-3" />
                <span>End-to-end encrypted</span>
              </div>
            </div>
          </div>
          <button className="w-10 h-10 bg-blue-50 hover:bg-blue-100 rounded-lg flex items-center justify-center transition-colors">
            <Plus className="w-5 h-5 text-blue-600" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1 p-1 bg-blue-50 rounded-xl mb-4">
          {[
            { key: "all", label: "All", icon: MessageSquare },
            { key: "teams", label: "Teams", icon: Users },
            { key: "unread", label: "Unread", icon: Filter },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => {
                console.log("[ChatSidebar] Tab changed to:", key);
                setActiveTab(key as any);
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === key
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
              {key === "unread" &&
                filteredConversationUsers.filter(
                  (u) => (u.unreadCount || 0) > 0
                ).length > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {
                      filteredConversationUsers.filter(
                        (u) => (u.unreadCount || 0) > 0
                      ).length
                    }
                  </span>
                )}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => {
              console.log(
                "[ChatSidebar] Search term changed to:",
                e.target.value
              );
              setSearchTerm(e.target.value);
            }}
            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </header>

      {/* Conversations List */}
      <section className="flex-1 overflow-y-auto">
        {filteredConversationUsers.length > 0 && (
          <div className="p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Recent Conversations
              {activeTab === "unread" && " (Unread)"}
              {activeTab === "teams" && " (Teams)"}
            </h3>
            <div className="space-y-2">
              {filteredConversationUsers.map((chatUser, index) => {
                const originalIndex = conversationUsers.findIndex(
                  (cu) => cu._id === chatUser._id
                );
                const conversationId = conversations[originalIndex]._id;

                return (
                  <ChatUserItemWithActions
                    key={conversationId}
                    user={chatUser}
                    isActive={selectedConversationId === conversationId}
                    conversationId={conversationId}
                    onReport={() => handleReportUser(chatUser, conversationId)}
                    onSelect={() => {
                      console.log("[ChatSidebar] Conversation clicked:", {
                        conversationId: conversationId,
                        chatUserName: chatUser.fullName,
                        index: originalIndex,
                      });
                      handleSelectConversation(conversationId);
                    }}
                  />
                );
              })}
            </div>
          </div>
        )}

        {filteredConversationUsers.length === 0 &&
          conversationUsers.length > 0 && (
            <div className="p-4 text-center py-8">
              <Filter className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">
                No conversations match your current filter
              </p>
            </div>
          )}

        {/* Start New Conversation */}
        <div className="p-4 border-t border-blue-50">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Start New Conversation
          </h3>
          {isLoadingUsers ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-6 h-6 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
          ) : filteredOtherUsers.length > 0 ? (
            <div className="space-y-2">
              {filteredOtherUsers.map((chatUser, index) => {
                const originalIndex = otherChatUsers.findIndex(
                  (cu) => cu._id === chatUser._id
                );
                const userId = otherUsers[originalIndex]._id;

                return (
                  <ChatUserItemWithActions
                    key={userId}
                    user={chatUser}
                    isActive={false}
                    onReport={() => handleReportUser(chatUser)}
                    onSelect={() => {
                      console.log(
                        "[ChatSidebar] New conversation clicked with user:",
                        {
                          userId: userId,
                          userName: chatUser.fullName,
                          userRole: chatUser.role,
                        }
                      );
                      handleStartConversation(userId);
                    }}
                  />
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">
                {searchTerm
                  ? "No users found matching your search"
                  : "No new users to chat with"}
              </p>
            </div>
          )}
        </div>
        
      </section>
      <ReportModal
        isOpen={reportModal.isOpen}
        onClose={() => setReportModal({ 
          isOpen: false, 
          reporteeId: '', 
          reporteeName: '', 
          chatReferenceId: undefined 
        })}
        reporteeId={reportModal.reporteeId}
        reporteeName={reportModal.reporteeName}
        chatReferenceId={reportModal.chatReferenceId}
      />
      
    </aside>
  );
};

export default ChatSidebar;
