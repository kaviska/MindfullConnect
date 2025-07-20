import mongoose, { Schema, model, models } from "mongoose";

const PatientQuizSchema = new Schema({
  quizId: {
    type: Schema.Types.ObjectId,
    ref: "Quiz",
    required: true,
  },
  patientId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  counsellorId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: ['assigned', 'in-progress', 'completed'],
    default: 'assigned',
  },
  attempts: {
    type: Number,
    default: 0,
  },
  maxAttempts: {
    type: Number,
    default: 3,
  },
  dueDate: {
    type: Date,
  },
  answers: [{
    questionId: {
      type: Schema.Types.ObjectId,
      ref: "Question",
      required: true,
    },
    selectedOption: {
      type: Number,
      required: true,
    },
  }],
  score: {
    type: Number,
  },
  totalQuestions: {
    type: Number,
  },
  timeSpent: {
    type: Number, // in seconds
  },
  startedAt: {
    type: Date,
  },
  completedAt: {
    type: Date,
  },
  assignedAt: {
    type: Date,
    default: Date.now,
  },
});

const PatientQuiz = models.PatientQuiz || model("PatientQuiz", PatientQuizSchema);

export default PatientQuiz;
