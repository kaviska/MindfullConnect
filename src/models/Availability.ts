import mongoose, { Schema } from "mongoose";

const availabilitySchema = new Schema({
  counselorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: String, required: true }, // Format: "YYYY-MM-DD"
  availableSlots: [{ type: String }],     // Example: ["10:00", "11:30"]
});

const Availability = mongoose.models.Availability || mongoose.model("Availability", availabilitySchema);

export default Availability;