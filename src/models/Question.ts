import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  counsellor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CounSellor",
    required: true,
  },
  patients_ids: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
  ],
  question: {
    type: String,
    required: true,
  },
  options: {
    type: [String], // an array of strings
    required: true,
  },
  correct_answer_index: {
    type: Number,
    required: true,
  },
  tags: {
    type: [String],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Question =
  mongoose.models.Question || mongoose.model("Question", QuestionSchema);
export default Question;

