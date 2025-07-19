import React from "react";
import { ChatUser } from "./types";

interface ChatUserItemProps {
  user: ChatUser;
  isActive: boolean;
}

export const ChatUserItem: React.FC<ChatUserItemProps> = ({ user, isActive }) => {
  return (
    <div
      className={`p-3 rounded-xl transition-all cursor-pointer ${
        isActive
          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
          : 'hover:bg-blue-50 text-gray-900'
      }`}
    >
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className="relative">
          <div className="w-12 h-12 rounded-full overflow-hidden">
            {user.avatar && user.avatar !== "avatar1" ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className={`w-full h-full flex items-center justify-center font-semibold ${
                isActive ? 'bg-white bg-opacity-20 text-white' : 'bg-gradient-to-br from-blue-400 to-purple-500 text-white'
              }`}>
                {user.name.split(' ').map(n => n[0]).join('')}
              </div>
            )}
          </div>
          {/* Online Status */}
          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 ${
            isActive ? 'border-white' : 'border-white'
          } ${
            user.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
          }`}></div>
        </div>

        {/* User Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4 className={`font-semibold text-sm truncate ${
              isActive ? 'text-white' : 'text-gray-900'
            }`}>
              {user.name}
            </h4>
            {user.lastMessageTime && (
              <span className={`text-xs ${
                isActive ? 'text-blue-100' : 'text-gray-500'
              }`}>
                {user.lastMessageTime}
              </span>
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <p className={`text-xs truncate ${
              isActive ? 'text-blue-100' : 'text-gray-600'
            }`}>
              {user.isTyping ? (
                <span className="italic">Typing...</span>
              ) : (
                user.lastMessage || "No messages yet"
              )}
            </p>
            
            {user.unreadCount > 0 && (
              <span className={`ml-2 px-2 py-1 rounded-full text-xs font-bold ${
                isActive ? 'bg-white text-blue-600' : 'bg-blue-600 text-white'
              }`}>
                {user.unreadCount}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};