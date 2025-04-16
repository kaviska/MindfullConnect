export interface ChatUser {
  name: string;
  role?: string;
  avatar?: string;
  status?: "online" | "offline";
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
  isTyping?: boolean;
}

export interface ChatMessage {
  id: string;
  content: string;
  timestamp: string;
  sender: "user" | "other";
  attachment?: {
    type: string;
    name: string;
    date: string;
    size: string;
  };
}

export interface MediaItem {
  id: string;
  url: string;
}

export interface FileTypeItem {
  icon: string;
  type: string;
  count: string;
  size: string;
  bgColor: string;
}
