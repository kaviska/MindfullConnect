import mongoose, { Schema } from "mongoose";

const sessionSchema = new Schema({
    patientId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    counselorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: String, required: true }, // Format: "YYYY-MM-DD"
    time: { type: String, required: true }, // Format: "HH:mm"
    duration: { type: Number, default: 55 }, // in minutes
    status: { type: String, enum: ["pending", "confirmed", "cancelled", "completed", "counselor requested reschedule"], default: "pending" },
    zoomLink: { type: String },
    createdAt: { type: Date, default: Date.now }
});

const Session = mongoose.models.Session || mongoose.model("Session", sessionSchema);

export default Session;