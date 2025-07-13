// models/Counselor.ts
import mongoose, { Schema } from "mongoose";

const counselorSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  specialty: { type: String, required: true },
  description: { type: String },
  rating: { type: Number, default: 4.8 },
  reviews: { type: Number, default: 0 },
  avatar: { type: String, default: "/default-avatar.png" },
  status: { type: String, enum: ["active", "inactive"], default: "inactive" },
   name: {
      type: String,
      required: true,
    },
   
   
    patients_ids: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false,
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
});

const Counselor = mongoose.models.Counselor || mongoose.model("Counselor", counselorSchema);
export default Counselor;
