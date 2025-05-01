import mongoose from "mongoose";

const QuizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
 
 
 
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const QuestionGroup =
  mongoose.models.QuestionGroup ||
  mongoose.model("QuestionGroup", QuizSchema);
export default QuestionGroup;