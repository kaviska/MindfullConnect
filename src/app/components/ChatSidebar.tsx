"use client";

import React, { useEffect, useState } from "react";
import { ChatUserItem } from "./ChatUserItem";
import { ChatUser, Conversation, User } from "./types";
import { useAuth } from "@/context/AuthContext";
import { Search, MessageSquare, Users, Filter, Plus } from "lucide-react";

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

  const mapConversationToChatUser = (conv: Conversation): ChatUser => {
    const otherParticipant = conv.participants.find((p) => p._id !== user?._id);

    return {
      name: otherParticipant?.fullName || "Unknown",
      status: "offline",
      avatar: otherParticipant?.profileImageUrl || "avatar1",
      isTyping: false,
      lastMessage: conv.lastMessage?.content,
      lastMessageTime: conv.lastMessage?.timestamp
        ? new Date(conv.lastMessage.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        : "Unknown",
      unreadCount: 0,
    };
  };

  const mapUserToChatUser = (u: User): ChatUser => ({
    name: u.fullName,
    status: "offline",
    avatar: u.profileImageUrl || "avatar1",
    isTyping: false,
    lastMessage: "",
    lastMessageTime: "",
    unreadCount: 0,
  });

  const conversationUsers: ChatUser[] = conversations.map(mapConversationToChatUser);
  const otherChatUsers: ChatUser[] = otherUsers.map(mapUserToChatUser);

  const handleStartConversation = async (participantId: string) => {
    if (!token) return;

    try {
      const res = await fetch("/api/conversations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
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
            <h1 className="text-xl font-bold text-gray-900">Messages</h1>
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
        {conversationUsers.length > 0 && (
          <div className="p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Recent Conversations
            </h3>
            <div className="space-y-2">
              {conversationUsers.map((chatUser, index) => (
                <div
                  key={conversations[index]._id}
                  onClick={() => handleSelectConversation(conversations[index]._id)}
                  className="cursor-pointer"
                >
                  <ChatUserItem
                    user={chatUser}
                    isActive={selectedConversationId === conversations[index]._id}
                  />
                </div>
              ))}
            </div>
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
          ) : otherChatUsers.length > 0 ? (
            <div className="space-y-2">
              {otherChatUsers.map((chatUser, index) => (
                <div
                  key={otherUsers[index]._id}
                  onClick={() => handleStartConversation(otherUsers[index]._id)}
                  className="cursor-pointer"
                >
                  <ChatUserItem user={chatUser} isActive={false} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No new users to chat with</p>
            </div>
          )}
        </div>
      </section>
    </aside>
  );
};

export default ChatSidebar;