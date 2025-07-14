import mongoose, { Schema } from "mongoose";

const quizSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  question_group_id: {
    type: Schema.Types.ObjectId,
    ref: "QuestionGroup",
    required: true,
  },
  counsellor_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Quiz = mongoose.models.Quiz || mongoose.model("Quiz", quizSchema);

export default Quiz;