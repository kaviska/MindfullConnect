import mongoose from "mongoose";

const CounsellorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
 
 
  patients_ids: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: false,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Counsellor =
  mongoose.models.Counsellor || mongoose.model("Counsellor", CounsellorSchema);

export default Counsellor;
