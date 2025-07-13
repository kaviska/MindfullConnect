// models/Counselor.ts
import mongoose, { Schema } from "mongoose";

const counselorSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  name: { type: String, required: true },
  
  // Professional Details
  specialty: { type: String, required: true },
  licenseNumber: { type: String },
  yearsOfExperience: { type: Number, required: true },
  highestQualification: { type: String, required: true },
  university: { type: String },
  languagesSpoken: [{ type: String }],
  availabilityType: { type: String, enum: ["online", "in-person", "both"], required: true },
  availableTimeSlots: [{
    day: { type: String, enum: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"] },
    startTime: { type: String },
    endTime: { type: String }
  }],
  consultationFee: { type: Number, default: 0 },
  
  // Counseling Approach
  bio: { type: String, maxlength: 1000 },
  therapeuticModalities: [{ type: String }],
  sessionDuration: { type: Number, default: 60 }, // in minutes
  
  // Stripe Connect fields
  stripeAccountId: { type: String },
  stripeOnboardingCompleted: { type: Boolean, default: false },
  stripeAccountStatus: { type: String, enum: ["pending", "active", "restricted"], default: "pending" },
  
  // ...existing code...
  description: { type: String },
  rating: { type: Number, default: 4.8 },
  reviews: { type: Number, default: 0 },
  avatar: { type: String, default: "/default-avatar.png" },
  status: { type: String, enum: ["active", "inactive", "pending"], default: "pending" },
  patients_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  createdAt: { type: Date, default: Date.now },
  
  // Profile completion status
  profileCompleted: { type: Boolean, default: false }
});

const Counselor = mongoose.models.Counselor || mongoose.model("Counselor", counselorSchema);
export default Counselor;
