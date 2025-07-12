import mongoose from "mongoose";

interface ICounsellorModel extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  availability: Array<{
    day: string;
    startTime: string;    
    endTime: string;     
  }>;
  specializations: string[];
  qualifications: string;
  ratings: {
    average: number;
    reviews: Array<{
      userId: mongoose.Types.ObjectId;
      rating: number;
      comment: string;
      createdAt: Date;
    }>;
  };
}

const counsellorSchema = new mongoose.Schema<ICounsellorModel>({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  availability: [
    {
      day: { type: String, required: true },
      startTime: { type: String, required: true },
      endTime: { type: String, required: true },
    },
  ],
  specializations: [{ type: String }],
  qualifications: { type: String },
  ratings: {
    average: { type: Number, default: 0 },
    reviews: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        rating: { type: Number, min: 1, max: 5 },
        comment: { type: String },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
}, {
  timestamps: true,
});

const CounsellorModel = mongoose.models.Counsellor || mongoose.model<ICounsellorModel>("Counsellor", counsellorSchema);

export default CounsellorModel;