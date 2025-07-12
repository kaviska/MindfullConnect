// Types and Interfaces
export interface Counselor {
   _id: string;
  name: string;
  specialty: string;
  rating: number;
  reviews: number;
  description: string;
  avatar: string;
}

export interface BookedSession {
  date: string;
  time: string;
  counselor: string;
}

// UPDATED: Added new chat and user-related interfaces
export interface ChatUser {
  name: string;
  role?: string;
  avatar?: string;
  status?: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
  isTyping?: boolean;
}

export interface ChatMessage {
  id: string;
  content: string;
  timestamp: string;
  sender: string | { _id: string; fullName: string }; // UPDATED: Enhanced sender type to support both string and object
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

export interface User {
  _id: string;
  fullName: string;
  email: string;
  profileImageUrl?: string;
  lastSeen?: string;
  role: string;
}

export interface Conversation {
  _id: string;
  participants: User[];
  lastMessage?: ChatMessage; // UPDATED: Uses ChatMessage interface for better type safety
}