// ✅ Updated ChatMain.tsx with encryption
"use client";

import React, { useState, useEffect, useRef } from "react";
import { ChatMessage } from "./ChatMessage";
import { ChatMessage as ChatMessageType, Conversation, User } from "./types";
import { ArrowLeft, Phone, Video, Info, Send, Paperclip, Smile, Shield } from "lucide-react";
import { MessageEncryption } from "@/utility/encryption";

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
  const [conversationKey, setConversationKey] = useState<string>("");
  const [isEncryptionEnabled, setIsEncryptionEnabled] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // ✅ Generate conversation key when conversation changes
  useEffect(() => {
    if (conversation && user) {
      const otherParticipant = conversation.participants.find(p => p._id !== user._id);
      if (otherParticipant) {
        const key = MessageEncryption.generateConversationKey(user._id, otherParticipant._id);
        setConversationKey(key);
      }
    }
  }, [conversation, user]);

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

  // ✅ Fetch and decrypt messages
  useEffect(() => {
    if (!conversationId || !token || !conversationKey) return;

    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/messages/${conversationId}`, {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        const data = await res.json();
        if (res.ok) {
          const decryptedMessages = data.messages.map((msg: any) => {
            let decryptedContent = msg.content;
            
            // ✅ Decrypt message if it's encrypted
            if (msg.isEncrypted && conversationKey) {
              try {
                decryptedContent = MessageEncryption.decryptMessage(msg.content, conversationKey);
              } catch (error) {
                console.error('Failed to decrypt message:', error);
                decryptedContent = '[Encrypted message - failed to decrypt]';
              }
            }

            return {
              id: msg._id,
              content: decryptedContent,
              timestamp: new Date(msg.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
              sender: msg.sender._id === user?._id ? "user" : "other",
              attachment: msg.attachment,
              isEncrypted: msg.isEncrypted || false,
            };
          });
          
          setMessages(decryptedMessages);
        } else {
          console.error(data.error);
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [conversationId, token, user, conversationKey]);

  // ✅ Encrypt and send message
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !conversationId || !conversationKey) return;

    try {
      let messageToSend = newMessage;
      let isEncrypted = false;

      // ✅ Encrypt message if encryption is enabled
      if (isEncryptionEnabled && conversationKey) {
        messageToSend = MessageEncryption.encryptMessage(newMessage, conversationKey);
        isEncrypted = true;
      }

      const res = await fetch(`/api/messages/${conversationId}`, {
        method: "POST",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          content: messageToSend,
          isEncrypted: isEncrypted 
        }),
      });

      if (res.ok) {
        const { message } = await res.json();
        setNewMessage("");
        
        // ✅ Add decrypted message to local state
        setMessages((prev) => [
          ...prev,
          {
            id: message._id,
            content: newMessage, // Use original unencrypted content for display
            timestamp: new Date(message.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            sender: "user",
            attachment: message.attachment,
            isEncrypted: isEncrypted,
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
    <main className={`flex flex-col h-full bg-white ${className} overflow-hidden`}> {/* ✅ Fixed height container */}
      
      {!conversationId ? (
        <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-blue-50 to-purple-50">
          {/* Your welcome message */}
        </div>
      ) : (
        <>
          {/* ✅ Fixed Header - Doesn't scroll */}
          <header className="flex-shrink-0 flex items-center justify-between p-6 border-b border-blue-100 bg-white">
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
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-gray-500">
                      {otherParticipant?.role || "User"} • Online
                    </p>
                    {isEncryptionEnabled && (
                      <div className="flex items-center gap-1 text-xs text-green-600">
                        <Shield className="w-3 h-3" />
                        <span>Encrypted</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Your header buttons */}
            </div>
          </header>

          {/* ✅ Messages Container - Scrollable area */}
          <div className="flex-1 relative bg-gradient-to-br from-blue-50 to-purple-50 overflow-hidden">
            <section
              ref={messagesContainerRef}
              className="absolute inset-0 overflow-y-auto p-6 space-y-4" // ✅ Absolute positioning for proper scrolling
            >
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-lg">
                      <Shield className="w-6 h-6 text-blue-600" />
                    </div>
                    <p className="text-gray-500">No messages yet. Start a secure conversation!</p>
                  </div>
                </div>
              ) : (
                messages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))
              )}
              <div ref={messagesEndRef} />
            </section>

            {/* ✅ Scroll to bottom button */}
            {isScrolledUp && (
              <button
                onClick={handleScrollToBottom}
                className="absolute bottom-6 right-6 w-12 h-12 bg-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center z-10"
              >
                <ArrowLeft className="w-5 h-5 text-blue-600 rotate-[-90deg]" />
              </button>
            )}
          </div>

          {/* ✅ Fixed Footer - Doesn't scroll */}
          <footer className="flex-shrink-0 p-6 bg-white border-t border-blue-100">
            <div className="flex items-center gap-3 bg-gray-50 rounded-2xl p-3">
              <button className="p-2 hover:bg-blue-100 rounded-lg transition-colors">
                <Paperclip className="w-5 h-5 text-gray-600" />
              </button>
              
              <input
                type="text"
                placeholder={isEncryptionEnabled ? "Type a secure message..." : "Type a message..."}
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
            
            {isEncryptionEnabled && (
              <div className="flex items-center justify-center gap-2 mt-2 text-xs text-green-600">
                <Shield className="w-3 h-3" />
                <span>Messages are end-to-end encrypted</span>
              </div>
            )}
          </footer>
        </>
      )}
    </main>
  );
};

export default ChatMain;