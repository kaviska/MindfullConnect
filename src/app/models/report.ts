import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
    reporterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    reporterName: { type: String, required: true, minlength: 5, maxlength: 50 },
    reporteeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    reporteeName: { type: String, required: true, minlength: 5, maxlength: 50 },
    reportType: {
        type: String,
        required: true,
        enum: ['Harassment', 'Inappropriate Language', 'Unprofessional Behavior', 'Spam or Scams', 'Other']
    },
    description: { type: String, required: true, minlength: 10, maxlength: 1000 },
    status: { type: String, enum: ['Pending', 'Resolved'], default: 'Pending' },
    chatReferenceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat' },
    actionNote: { type: String, maxlength: 500 },
}, { timestamps: true });

export default mongoose.models.Report || mongoose.model('Report', reportSchema);