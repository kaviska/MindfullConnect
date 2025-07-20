// ✅ Make sure src/models/report.ts exists with this content:
import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  reporterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reporterName: {
    type: String,
    required: true
  },
  reporteeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reporteeName: {
    type: String,
    required: true
  },
  reportType: {
    type: String,
    required: true,
    enum: ['Harassment', 'Inappropriate Language', 'Unprofessional Behavior', 'Spam or Scams', 'Other']
  },
  description: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 1000
  },
  chatReferenceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
    required: false
  },
  status: {
    type: String,
    enum: ['Pending', 'Resolved'],
    default: 'Pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add indexes
reportSchema.index({ reporterId: 1 });
reportSchema.index({ reporteeId: 1 });
reportSchema.index({ status: 1 });

export default mongoose.models.Report || mongoose.model('Report', reportSchema);