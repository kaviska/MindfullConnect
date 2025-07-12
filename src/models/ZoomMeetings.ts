import mongoose from 'mongoose';

const ZoomMeetingSchema = new mongoose.Schema({
  meetingId: { type: String, required: true, unique: true },
  topic: { type: String, required: true },
  status: { type: String, required: true, enum: ['waiting', 'completed', 'cancelled'] },
  joinUrl: { type: String, required: true },
  startURL: { type: String, required: true },
  startTime: { type: Date, required: true },
  duration: { type: Number, required: true },
  counsellorId: { type: String, required: true },
  patientId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Avoid recompiling the model during hot reloads
export default mongoose.models.ZoomMeeting || mongoose.model('ZoomMeeting', ZoomMeetingSchema);