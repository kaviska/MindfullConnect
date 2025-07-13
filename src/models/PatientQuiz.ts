import mongoose, { Schema } from "mongoose";

const patientQuizSchema = new Schema({
  quizId: { type: Schema.Types.ObjectId, ref: 'Quiz', required: true },
  patientId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  counsellorId: { type: Schema.Types.ObjectId, ref: 'Counselor', required: true },
  status: { 
    type: String, 
    enum: ['assigned', 'in_progress', 'completed', 'expired'], 
    default: 'assigned' 
  },
  assignedDate: { type: Date, default: Date.now },
  startedDate: { type: Date },
  dueDate: { type: Date },
  completedDate: { type: Date },
  score: { type: Number, default: 0 },
  correctAnswers: { type: Number, default: 0 },
  totalQuestions: { type: Number, default: 0 },
  timeSpent: { type: Number, default: 0 }, // in seconds
  answers: [{
    questionId: { type: Schema.Types.ObjectId },
    selectedOption: { type: Number },
    isCorrect: { type: Boolean, default: false },
    answeredAt: { type: Date, default: Date.now }
  }],
  attempts: { type: Number, default: 0 },
  maxAttempts: { type: Number, default: 3 }
}, { timestamps: true });

const PatientQuiz = mongoose.models.PatientQuiz || mongoose.model("PatientQuiz", patientQuizSchema);

export default PatientQuiz;
