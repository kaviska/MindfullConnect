"use client";

import React, { useEffect, useState } from "react";
import { ChatUserItem } from "./ChatUserItem";
import { ChatUser, Conversation, User } from "./types";
import { useAuth } from "@/context/AuthContext";
import { Search, MessageSquare, Users, Filter, Plus, Shield } from "lucide-react";

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
  className
}) => {
  const { user, token } = useAuth();
  const [otherUsers, setOtherUsers] = useState<User[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(
    conversations[0]?._id || null
  );
  const [activeTab, setActiveTab] = useState<'all' | 'teams' | 'unread'>('all');
  const [searchTerm, setSearchTerm] = useState('');

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
      _id: otherParticipant?._id || "unknown", // ✅ Added _id
      name: otherParticipant?.fullName || "Unknown",
      fullName: otherParticipant?.fullName || "Unknown", // ✅ Added fullName
      role: otherParticipant?.role || "user", // ✅ Added role
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
      unreadCount: conv.unreadCounts?.find(uc => 
        typeof uc.participant === 'string' 
          ? uc.participant === user?._id 
          : uc.participant._id === user?._id
      )?.count || 0,
      // ✅ Added encryption-related properties
      encryptionEnabled: conv.encryptionEnabled || false,
      conversationType: conv.conversationType || 'general',
    };
  };

  // ✅ Fixed mapping function with all required properties
  const mapUserToChatUser = (u: User): ChatUser => ({
    _id: u._id, // ✅ Added _id
    name: u.fullName,
    fullName: u.fullName, // ✅ Added fullName
    role: u.role || "user", // ✅ Added role
    status: u.isOnline ? "online" : "offline",
    avatar: u.profileImageUrl || undefined,
    profileImageUrl: u.profileImageUrl || undefined,
    isTyping: false,
    lastMessage: "",
    lastMessageTime: "",
    unreadCount: 0,
    // ✅ Added encryption-related properties
    encryptionEnabled: u.encryptionPreference || true,
    conversationType: 'general',
  });

  const conversationUsers: ChatUser[] = conversations.map(mapConversationToChatUser);
  const otherChatUsers: ChatUser[] = otherUsers.map(mapUserToChatUser);

  // ✅ Filter conversations based on search and active tab
  const filteredConversationUsers = conversationUsers.filter(chatUser => {
    const matchesSearch = searchTerm === '' || 
      chatUser.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chatUser.lastMessage?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTab = activeTab === 'all' || 
      (activeTab === 'unread' && (chatUser.unreadCount || 0) > 0) ||
      (activeTab === 'teams' && chatUser.conversationType === 'admin');
    
    return matchesSearch && matchesTab;
  });

  const filteredOtherUsers = otherChatUsers.filter(chatUser => 
    searchTerm === '' || 
    chatUser.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStartConversation = async (participantId: string) => {
    if (!token) return;

    try {
      const res = await fetch("/api/conversations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include', // ✅ Added for cookie support
        body: JSON.stringify({ participantId }),
      });

      const data = await res.json();
      if (res.ok) {
        setSelectedConversationId(data.conversation._id);
        onSelectConversation(data.conversation._id);
      } else {
        console.error("Failed to start conversation:", data.error);
      }
    } catch (error) {
      console.error("Error starting conversation:", error);
    }
  };

  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversationId(conversationId);
    onSelectConversation(conversationId);
  };

  return (
    <aside className={`flex flex-col bg-white border-r border-blue-100 h-full ${className}`}>
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
            { key: 'all', label: 'All', icon: MessageSquare },
            { key: 'teams', label: 'Teams', icon: Users },
            { key: 'unread', label: 'Unread', icon: Filter }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as any)}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === key
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
              {/* ✅ Show unread count badge */}
              {key === 'unread' && filteredConversationUsers.filter(u => (u.unreadCount || 0) > 0).length > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {filteredConversationUsers.filter(u => (u.unreadCount || 0) > 0).length}
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
            onChange={(e) => setSearchTerm(e.target.value)}
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
              {activeTab === 'unread' && ' (Unread)'}
              {activeTab === 'teams' && ' (Teams)'}
            </h3>
            <div className="space-y-2">
              {filteredConversationUsers.map((chatUser, index) => {
                // Find the original conversation index
                const originalIndex = conversationUsers.findIndex(cu => cu._id === chatUser._id);
                return (
                  <div
                    key={conversations[originalIndex]._id}
                    onClick={() => handleSelectConversation(conversations[originalIndex]._id)}
                    className="cursor-pointer"
                  >
                    <ChatUserItem
                      user={chatUser}
                      isActive={selectedConversationId === conversations[originalIndex]._id}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Show empty state when no conversations match filters */}
        {filteredConversationUsers.length === 0 && conversationUsers.length > 0 && (
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
                const originalIndex = otherChatUsers.findIndex(cu => cu._id === chatUser._id);
                return (
                  <div
                    key={otherUsers[originalIndex]._id}
                    onClick={() => handleStartConversation(otherUsers[originalIndex]._id)}
                    className="cursor-pointer"
                  >
                    <ChatUserItem user={chatUser} isActive={false} />
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">
                {searchTerm ? 'No users found matching your search' : 'No new users to chat with'}
              </p>
            </div>
          )}
        </div>
      </section>
    </aside>
  );
};

export default ChatSidebar;