import mongoose, { Schema } from "mongoose";

const conversationSchema = new Schema({
  participants: [
    {
      type: Schema.Types.ObjectId,
      ref: "User", // References the "User" model
      required: true,
    },
  ],
  // ✅ Updated lastMessage structure with encryption support
  lastMessage: {
    content: String,
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    timestamp: Date,
    isEncrypted: {
      type: Boolean,
      default: false
    },
    messageId: {
      type: Schema.Types.ObjectId,
      ref: "Message"
    }
  },
  // ✅ Conversation-level encryption settings
  encryptionEnabled: {
    type: Boolean,
    default: true // Enable by default for patient-counselor conversations
  },
  // ✅ Conversation type for different security levels
  conversationType: {
    type: String,
    enum: ['patient-counselor', 'admin', 'general', 'emergency'],
    default: 'patient-counselor'
  },
  // ✅ Security and compliance features
  retentionPolicy: {
    type: String,
    enum: ['30days', '90days', '1year', '7years', 'indefinite'],
    default: '7years' // HIPAA compliance default
  },
  // ✅ Archive settings
  isArchived: {
    type: Boolean,
    default: false
  },
  archivedAt: Date,
  archivedBy: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  // ✅ Conversation metadata
  metadata: {
    sessionId: String, // Link to therapy session if applicable
    caseNumber: String, // For administrative tracking
    tags: [String], // For categorization
    priority: {
      type: String,
      enum: ['low', 'normal', 'high', 'urgent'],
      default: 'normal'
    }
  },
  // ✅ Unread message counts per participant
  unreadCounts: [{
    participant: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    count: {
      type: Number,
      default: 0
    }
  }]
}, { 
  timestamps: true 
});

// ✅ Add indexes for performance
conversationSchema.index({ participants: 1 });
conversationSchema.index({ 'lastMessage.timestamp': -1 });
conversationSchema.index({ conversationType: 1 });
conversationSchema.index({ encryptionEnabled: 1 });
conversationSchema.index({ isArchived: 1, updatedAt: -1 });
conversationSchema.index({ 'metadata.priority': 1, 'lastMessage.timestamp': -1 });

// ✅ Add methods for conversation management
conversationSchema.methods.getUnreadCount = function(userId: string) {
  const userUnread = this.unreadCounts.find((uc: any) => 
    uc.participant.toString() === userId
  );
  return userUnread ? userUnread.count : 0;
};

conversationSchema.methods.updateUnreadCount = function(userId: string, increment: number = 1) {
  const userUnreadIndex = this.unreadCounts.findIndex((uc: any) => 
    uc.participant.toString() === userId
  );
  
  if (userUnreadIndex >= 0) {
    this.unreadCounts[userUnreadIndex].count += increment;
    if (this.unreadCounts[userUnreadIndex].count < 0) {
      this.unreadCounts[userUnreadIndex].count = 0;
    }
  } else {
    this.unreadCounts.push({
      participant: userId,
      count: Math.max(0, increment)
    });
  }
  
  return this.save();
};

conversationSchema.methods.markAllAsRead = function(userId: string) {
  const userUnreadIndex = this.unreadCounts.findIndex((uc: any) => 
    uc.participant.toString() === userId
  );
  
  if (userUnreadIndex >= 0) {
    this.unreadCounts[userUnreadIndex].count = 0;
    return this.save();
  }
  
  return Promise.resolve(this);
};

// ✅ Add method to check if user is participant
conversationSchema.methods.isParticipant = function(userId: string) {
  return this.participants.some((p: any) => p.toString() === userId);
};

// ✅ Add method to archive conversation
conversationSchema.methods.archive = function(userId: string) {
  this.isArchived = true;
  this.archivedAt = new Date();
  this.archivedBy = userId;
  return this.save();
};

const Conversation = mongoose.models.Conversation || mongoose.model("Conversation", conversationSchema);

export default Conversation;