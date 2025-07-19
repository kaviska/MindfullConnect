import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'User'
    },
    lastSeen: Date,
    isVerified: {
        type: Boolean,
        default: false
    },
    otp: String,
    otpExpiry: Date
});

export const User = mongoose.models.User || mongoose.model('User', userSchema);

const reportSchema = new mongoose.Schema({
    reporterName: String,
    reporteeId: mongoose.Schema.Types.ObjectId,
    reporteeName: String,
    reportType: String,
    description: String,
    status: {
        type: String,
        enum: ['Pending', 'Resolved'],
        default: 'Pending'
    },
    actionNote: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export const Report = mongoose.models.Report || mongoose.model('Report', reportSchema);
