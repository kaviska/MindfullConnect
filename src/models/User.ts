import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'User' },
  lastSeen: Date,
  isVerified: { type: Boolean, default: false },
  otp: String,
  otpExpiry: Date,
});

export default mongoose.models.User || mongoose.model('User', userSchema);