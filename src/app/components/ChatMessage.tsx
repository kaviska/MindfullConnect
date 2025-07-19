"use client";

import React from "react";
import { ChatMessage as ChatMessageType } from "./types";
import { Shield } from "lucide-react";

interface ChatMessageProps {
  message: ChatMessageType;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isSender = message.sender === "user";

  return (
    <div className={`flex ${isSender ? "justify-end" : "justify-start"} mb-4`}>
      <div className={`max-w-[70%] ${isSender ? "order-2" : "order-1"}`}>
        {/* Message bubble */}
        <div
          className={`px-4 py-3 rounded-2xl ${
            isSender
              ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
              : "bg-white text-gray-900 shadow-md border border-gray-100"
          }`}
        >
          {/* ✅ Message content only */}
          <p className="text-sm leading-relaxed break-words">
            {message.content}
          </p>

          {/* ✅ Message metadata */}
          <div className="flex items-center justify-between mt-2">
            <span className={`text-xs ${
              isSender ? "text-white text-opacity-70" : "text-gray-500"
            }`}>
              {message.timestamp}
            </span>
            
            {/* ✅ Show encryption indicator */}
            {message.isEncrypted && (
              <div className="flex items-center gap-1">
                <Shield className="w-3 h-3" />
                <span className={`text-xs ${
                  isSender ? "text-white text-opacity-70" : "text-green-600"
                }`}>
                  Encrypted
                </span>
              </div>
            )}
          </div>
        </div>

        {/* ✅ Message status indicators */}
        {isSender && (
          <div className="flex items-center justify-end gap-1 mt-1 px-2">
            {message.status === 'sending' && (
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
            )}
            {message.status === 'sent' && (
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            )}
            {message.status === 'delivered' && (
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              </div>
            )}
            {message.status === 'read' && (
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;