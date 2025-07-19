import mongoose, { Schema } from "mongoose";

const messageSchema = new Schema({
  conversationId: {
    type: Schema.Types.ObjectId,
    ref: "Conversation",
    required: true,
  },
  sender: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  content: { 
    type: String, 
    required: true 
  },
  // ✅ Add encryption support fields
  isEncrypted: {
    type: Boolean,
    default: false
  },
  messageHash: {
    type: String,
    // Used for message integrity verification
  },
  timestamp: { 
    type: Date, 
    default: Date.now 
  },
  attachment: {
    type: { type: String },
    name: { type: String },
    size: { type: String },
    // ✅ Add encryption flag for attachments
    isEncrypted: { type: Boolean, default: false }
  },
  // ✅ Optional: Add read receipts for enhanced security
  readBy: [{
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    readAt: {
      type: Date,
      default: Date.now
    }
  }],
  // ✅ Optional: Add audit trail
  editedAt: Date,
  deletedAt: Date,
  // ✅ Message priority for critical communications
  priority: {
    type: String,
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal'
  }
}, { 
  timestamps: true 
});

// ✅ Add indexes for performance and security queries
messageSchema.index({ conversationId: 1, timestamp: -1 });
messageSchema.index({ sender: 1, timestamp: -1 });
messageSchema.index({ isEncrypted: 1 });
messageSchema.index({ 'readBy.user': 1 });
messageSchema.index({ priority: 1, timestamp: -1 });

// ✅ Add method to check if message is read by user
messageSchema.methods.isReadBy = function(userId: string) {
  return this.readBy.some((read: any) => read.user.toString() === userId);
};

// ✅ Add method to mark as read
messageSchema.methods.markAsRead = function(userId: string) {
  if (!this.isReadBy(userId)) {
    this.readBy.push({
      user: userId,
      readAt: new Date()
    });
    return this.save();
  }
  return Promise.resolve(this);
};

export default mongoose.models.Message || mongoose.model("Message", messageSchema);