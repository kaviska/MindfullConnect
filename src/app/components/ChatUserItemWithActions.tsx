// ✅ Create src/app/components/ChatUserItemWithActions.tsx
import React, { useState } from "react";
import { ChatUser } from "./types";
import { ChatUserItem } from "./ChatUserItem";
import { MoreVertical, Flag } from "lucide-react";

interface ChatUserItemWithActionsProps {
  user: ChatUser;
  isActive: boolean;
  conversationId?: string;
  onReport: () => void;
  onSelect?: () => void;
}

export const ChatUserItemWithActions: React.FC<ChatUserItemWithActionsProps> = ({ 
  user, 
  isActive, 
  conversationId, 
  onReport,
  onSelect 
}) => {
  const [showActions, setShowActions] = useState(false);

  return (
    <div className="relative group">
      {/* Main Chat User Item */}
      <div onClick={onSelect} className="cursor-pointer">
        <ChatUserItem user={user} isActive={isActive} />
      </div>

      {/* Actions Button - Only shows on hover */}
      <div className="absolute top-2 right-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowActions(!showActions);
          }}
          className={`w-6 h-6 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 ${
            isActive 
              ? 'hover:bg-white/20 text-white' 
              : 'hover:bg-gray-200 text-gray-500'
          }`}
        >
          <MoreVertical className="w-4 h-4" />
        </button>

        {/* Actions Dropdown */}
        {showActions && (
          <>
            {/* Backdrop to close dropdown */}
            <div 
              className="fixed inset-0 z-10" 
              onClick={() => setShowActions(false)}
            />
            
            {/* Dropdown Menu */}
            <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-20 min-w-[140px]">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  console.log('[ChatUserItemWithActions] Report button clicked for:', user.name);
                  onReport();
                  setShowActions(false);
                }}
                className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
              >
                <Flag className="w-4 h-4" />
                Report User
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ChatUserItemWithActions;