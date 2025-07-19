// Types and Interfaces
export interface Counselor {
  _id: string;
  name: string;
  specialty: string;
  rating: number;
  reviews: number;
  yearsOfExperience: number;
  consultationFee: number;
  bio: string;
  avatar: string;
  status: "active" | "inactive" | "pending";
  profileCompleted: boolean;
  therapeuticModalities: string[];
  languagesSpoken: string[];
  availabilityType: "online" | "in-person" | "both";
  // Optional fields
  description?: string; // Keep for backward compatibility
}

// ✅ UPDATED: Enhanced BookedSession interface for dynamic data
export interface BookedSession {
  id: string;
  date: string;
  time: string;
  duration: number;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  counselor: {
    id: string;
    name: string;
    specialty: string;
  };
  // TODO: Add zoom link when implemented
  zoomLink?: string;
  createdAt: string;
  isUpcoming?: boolean;
  avatar?: string;
}

// ✅ UPDATED: Enhanced ChatUser interface with security features
export interface ChatUser {
  _id: string;
  name: string;
  fullName: string;
  role?: string;
  avatar?: string;
  profileImageUrl?: string;
  status?: 'online' | 'offline' | 'away' | 'busy';
  lastSeen?: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
  isTyping?: boolean;
  // ✅ Security and encryption related
  encryptionEnabled?: boolean;
  conversationType?: 'patient-counselor' | 'admin' | 'general' | 'emergency';
}

// ✅ UPDATED: Enhanced ChatMessage interface with encryption support
export interface ChatMessage {
  id: string;
  content: string;
  timestamp: string;
  sender: string | { _id: string; fullName: string; role?: string };
  attachment?: MessageAttachment;
  // ✅ Encryption and security fields
  isEncrypted?: boolean;
  messageHash?: string;
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  // ✅ Read receipt support
  readBy?: ReadReceipt[];
  isRead?: boolean;
  // ✅ Message status
  status?: 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
  // ✅ Edit and delete tracking
  editedAt?: string;
  deletedAt?: string;
  isDeleted?: boolean;
}

// ✅ NEW: Message attachment interface with encryption support
export interface MessageAttachment {
  type: string;
  name: string;
  date: string;
  size: string;
  url?: string;
  // ✅ Encryption support for files
  isEncrypted?: boolean;
  thumbnailUrl?: string;
  mimeType?: string;
}

// ✅ NEW: Read receipt interface
export interface ReadReceipt {
  user: string | User;
  readAt: string;
}

// ✅ UPDATED: Enhanced User interface
export interface User {
  _id: string;
  fullName: string;
  email: string;
  profileImageUrl?: string;
  lastSeen?: string;
  role: 'patient' | 'counselor' | 'admin' | 'superadmin';
  // ✅ Security and preferences
  encryptionPreference?: boolean;
  notificationSettings?: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  // ✅ Online status
  isOnline?: boolean;
  status?: 'online' | 'offline' | 'away' | 'busy';
  // ✅ Verification status
  isVerified?: boolean;
  verificationLevel?: 'basic' | 'enhanced' | 'professional';
}

// ✅ UPDATED: Enhanced Conversation interface with encryption support
export interface Conversation {
  _id: string;
  participants: User[];
  lastMessage?: {
    content: string;
    sender: string | User;
    timestamp: string;
    isEncrypted?: boolean;
    messageId?: string;
  };
  // ✅ Encryption and security settings
  encryptionEnabled?: boolean;
  conversationType?: 'patient-counselor' | 'admin' | 'general' | 'emergency';
  retentionPolicy?: '30days' | '90days' | '1year' | '7years' | 'indefinite';
  // ✅ Archive settings
  isArchived?: boolean;
  archivedAt?: string;
  archivedBy?: string | User;
  // ✅ Conversation metadata
  metadata?: {
    sessionId?: string;
    caseNumber?: string;
    tags?: string[];
    priority?: 'low' | 'normal' | 'high' | 'urgent';
  };
  // ✅ Unread counts
  unreadCounts?: Array<{
    participant: string | User;
    count: number;
  }>;
  // ✅ Timestamps
  createdAt?: string;
  updatedAt?: string;
}

// ✅ NEW: Encryption utilities interface
export interface EncryptionConfig {
  enabled: boolean;
  algorithm: string;
  keyRotationInterval?: number;
  retentionPeriod?: string;
}

// ✅ NEW: Message security context
export interface MessageSecurityContext {
  isEncrypted: boolean;
  encryptionLevel: 'none' | 'basic' | 'enhanced' | 'military';
  integrityVerified: boolean;
  senderVerified: boolean;
  conversationSecure: boolean;
}

// ✅ NEW: Chat interface configuration
export interface ChatConfig {
  encryption: EncryptionConfig;
  retentionPolicy: string;
  auditLogging: boolean;
  readReceipts: boolean;
  typingIndicators: boolean;
  fileSharing: boolean;
  maxFileSize: number;
  allowedFileTypes: string[];
}

// ✅ Existing interfaces (keep for backward compatibility)
export interface MediaItem {
  id: string;
  url: string;
  type?: string;
  name?: string;
  size?: string;
  isEncrypted?: boolean;
}

export interface FileTypeItem {
  icon: string;
  type: string;
  count: string;
  size: string;
  bgColor: string;
}

// ✅ NEW: Export utility types
export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
export type UserRole = 'patient' | 'counselor' | 'admin' | 'superadmin';
export type ConversationType = 'patient-counselor' | 'admin' | 'general' | 'emergency';
export type EncryptionLevel = 'none' | 'basic' | 'enhanced' | 'military';
export type Priority = 'low' | 'normal' | 'high' | 'urgent';