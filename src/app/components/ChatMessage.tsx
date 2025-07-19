import React from "react";
import { ChatMessage as ChatMessageType } from "./types";
import { Download } from "lucide-react";

interface ChatMessageProps {
  message: ChatMessageType;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isSender = message.sender === "user";

  return (
    <div className={`flex ${isSender ? "justify-end" : "justify-start"} mb-4`}>
      <div className={`flex flex-col ${isSender ? "items-end" : "items-start"} max-w-[320px]`}>
        <time className={`text-xs mb-2 ${
          isSender ? "text-right text-blue-600" : "text-left text-gray-500"
        }`}>
          {message.timestamp}
        </time>
        
        <div
          className={`px-4 py-3 rounded-2xl shadow-sm ${
            isSender
              ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-br-md"
              : "bg-white text-gray-900 border border-gray-200 rounded-bl-md"
          }`}
        >
          <p className="text-sm leading-relaxed">{message.content}</p>

          {message.attachment && (
            <div className={`flex items-center gap-3 p-3 mt-3 rounded-xl ${
              isSender ? "bg-white bg-opacity-20" : "bg-gray-50"
            }`}>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                isSender ? "bg-white bg-opacity-30 text-white" : "bg-blue-100 text-blue-600"
              }`}>
                {message.attachment.type.toUpperCase()}
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className={`text-sm font-medium truncate ${
                  isSender ? "text-white" : "text-gray-900"
                }`}>
                  {message.attachment.name}
                </h4>
                <div className={`flex items-center gap-1 text-xs ${
                  isSender ? "text-blue-100" : "text-gray-500"
                }`}>
                  <span>{message.attachment.date}</span>
                  <span>•</span>
                  <span>{message.attachment.size}</span>
                </div>
              </div>
              
              <button className={`p-1 rounded-lg transition-colors ${
                isSender 
                  ? "hover:bg-white hover:bg-opacity-20" 
                  : "hover:bg-blue-100"
              }`}>
                <Download className={`w-4 h-4 ${
                  isSender ? "text-white" : "text-blue-600"
                }`} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};