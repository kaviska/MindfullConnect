"use client";

import React, { useState, useEffect, useRef } from "react";
import { ChatMessage } from "./ChatMessage";
import { ChatMessage as ChatMessageType, Conversation, User } from "./types";
import { ArrowLeft, Phone, Video, Info, Send, Paperclip, Smile } from "lucide-react";

interface ChatMainProps {
  conversationId: string | null;
  user: User | null;
  token: string | null;
  conversation?: Conversation;
  onToggleProfileSidebar: () => void;
  fetchConversations: () => Promise<void>;
  onBack?: () => void;
  className?: string;
}

export const ChatMain: React.FC<ChatMainProps> = ({
  conversationId,
  user,
  token,
  conversation,
  onToggleProfileSidebar,
  fetchConversations,
  onBack,
  className,
}) => {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isScrolledUp, setIsScrolledUp] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isScrolledUp) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isScrolledUp]);

  useEffect(() => {
    const handleScroll = () => {
      if (messagesContainerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
        const atBottom = scrollHeight - scrollTop - clientHeight < 50;
        setIsScrolledUp(!atBottom);
      }
    };

    const container = messagesContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [conversationId]);

  useEffect(() => {
    if (!conversationId || !token) return;

    const fetchMessages = async () => {
      const res = await fetch(`/api/messages/${conversationId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setMessages(
          data.messages.map((msg: any) => ({
            id: msg._id,
            content: msg.content,
            timestamp: new Date(msg.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            sender: msg.sender._id === user?._id ? "user" : "other",
            attachment: msg.attachment,
          }))
        );
      } else {
        console.error(data.error);
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [conversationId, token, user]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !conversationId || !token) return;

    try {
      const res = await fetch(`/api/messages/${conversationId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: newMessage }),
      });

      if (res.ok) {
        const { message } = await res.json();
        setNewMessage("");
        setMessages((prev) => [
          ...prev,
          {
            id: message._id,
            content: message.content,
            timestamp: new Date(message.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            sender: "user",
            attachment: message.attachment,
          },
        ]);
        fetchConversations();
      } else {
        const data = await res.json();
        console.error("Failed to send message:", data.error);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleScrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    setIsScrolledUp(false);
  };

  const otherParticipant = conversation?.participants.find((p) => p._id !== user?._id);

  return (
    <main className={`flex flex-col h-full bg-white ${className}`}>
      {!conversationId ? (
        <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-blue-50 to-purple-50">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-6">
              <Send className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Messages</h2>
            <p className="text-gray-600 max-w-md">
              Select a conversation from the sidebar to start chatting, or start a new conversation with someone.
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Header */}
          <header className="flex items-center justify-between p-6 border-b border-blue-100 bg-white">
            <div className="flex items-center gap-4">
              {onBack && (
                <button 
                  onClick={onBack} 
                  className="sm:hidden p-2 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
              )}
              
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    {otherParticipant?.profileImageUrl ? (
                      <img
                        src={otherParticipant.profileImageUrl}
                        alt={otherParticipant.fullName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold">
                        {otherParticipant?.fullName?.split(' ').map(n => n[0]).join('') || 'U'}
                      </div>
                    )}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                
                <div>
                  <h2 className="font-semibold text-gray-900">
                    {otherParticipant?.fullName || "Unknown User"}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {otherParticipant?.role || "User"} • Online
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button className="p-3 hover:bg-blue-50 rounded-lg transition-colors">
                <Phone className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-3 hover:bg-blue-50 rounded-lg transition-colors">
                <Video className="w-5 h-5 text-gray-600" />
              </button>
              <button 
                onClick={onToggleProfileSidebar}
                className="p-3 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Info className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </header>

          {/* Messages */}
          <div className="relative flex-1 bg-gradient-to-br from-blue-50 to-purple-50">
            <section
              ref={messagesContainerRef}
              className="h-full overflow-y-auto p-6 space-y-4"
            >
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-lg">
                      <Send className="w-6 h-6 text-blue-600" />
                    </div>
                    <p className="text-gray-500">No messages yet. Start the conversation!</p>
                  </div>
                </div>
              ) : (
                messages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))
              )}
              <div ref={messagesEndRef} />
            </section>

            {isScrolledUp && (
              <button
                onClick={handleScrollToBottom}
                className="absolute bottom-6 right-6 w-12 h-12 bg-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center"
              >
                <ArrowLeft className="w-5 h-5 text-blue-600 rotate-[-90deg]" />
              </button>
            )}
          </div>

          {/* Message Input */}
          <footer className="p-6 bg-white border-t border-blue-100">
            <div className="flex items-center gap-3 bg-gray-50 rounded-2xl p-3">
              <button className="p-2 hover:bg-blue-100 rounded-lg transition-colors">
                <Paperclip className="w-5 h-5 text-gray-600" />
              </button>
              
              <input
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                className="flex-1 bg-transparent outline-none text-gray-900 placeholder-gray-500"
              />
              
              <button className="p-2 hover:bg-blue-100 rounded-lg transition-colors">
                <Smile className="w-5 h-5 text-gray-600" />
              </button>
              
              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className={`p-3 rounded-xl transition-all ${
                  newMessage.trim()
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:shadow-xl'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </footer>
        </>
      )}
    </main>
  );
};

export default ChatMain;