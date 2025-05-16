import mongoose from "mongoose";

const QuizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  question_group_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "QuestionGroup",
    required: true,
  },
 
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Quiz = mongoose.models.Quiz || mongoose.model("Quiz", QuizSchema);
export default Quiz;