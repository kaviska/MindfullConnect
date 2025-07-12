import mongoose from "mongoose";

const MileStoneSchema = new mongoose.Schema({
  breakdown: [
    {
      description: {
        type: String,
        required: true,
      },
      time: {
        type: String,
        required: true,
      },
    },
  ],
  goal_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Goals",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// ✅ Check if already compiled to prevent OverwriteModelError
const MileStoneModel =
  mongoose.models.MileStone || mongoose.model("MileStone", MileStoneSchema);

export default MileStoneModel;
