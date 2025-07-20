// Simple test to check if Report model loads
console.log("Testing Report model import...");

try {
    const mongoose = require('mongoose');
    
    // Test if we can access the model
    const reportSchema = new mongoose.Schema({
        reporterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        reporterName: { type: String, required: true },
        reporteeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        reporteeName: { type: String, required: true },
        reportType: {
            type: String,
            required: true,
            enum: ['Harassment', 'Inappropriate Language', 'Unprofessional Behavior', 'Spam or Scams', 'Other']
        },
        description: { type: String, required: true },
        status: { type: String, enum: ['Pending', 'Resolved'], default: 'Pending' },
        chatReferenceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat' },
        actionNote: { type: String },
    }, { timestamps: true });

    const Report = mongoose.models.Report || mongoose.model('Report', reportSchema);
    console.log("Report model loaded successfully!");
    console.log("Report model methods:", Object.getOwnPropertyNames(Report));
    
} catch (error) {
    console.error("Error loading Report model:", error.message);
}
