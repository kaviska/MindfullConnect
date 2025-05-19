import mongoose, { Schema, model, models } from "mongoose";

const QuestionSchema = new Schema({
  question: {
    type: String,
    required: true,
  },
  options: {
    type: [String],
    required: true,
  },
  correct_answer_index: {
    type: Number,
    required: true,
  },
  question_group_id: {
    type: Schema.Types.ObjectId,
    ref: "QuestionGroup",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// ⭐️ Fix is here
const Question = models.Question || model("Question", QuestionSchema);

export default Question;
