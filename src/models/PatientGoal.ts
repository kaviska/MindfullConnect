import mongoose, { Schema } from "mongoose";

const patientGoalSchema = new Schema({
  goalId: { type: Schema.Types.ObjectId, ref: 'Goals', required: true },
  patientId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  counsellorId: { type: Schema.Types.ObjectId, ref: 'Counselor', required: true },
  status: { 
    type: String, 
    enum: ['assigned', 'in_progress', 'completed', 'paused'], 
    default: 'assigned' 
  },
  progress: { type: Number, default: 0, min: 0, max: 100 },
  startDate: { type: Date, default: Date.now },
  targetDate: { type: Date },
  completedDate: { type: Date },
  milestones: [{
    title: { type: String, required: true },
    description: { type: String },
    targetDate: { type: Date },
    completedDate: { type: Date },
    status: { type: String, enum: ['pending', 'completed'], default: 'pending' }
  }],
  notes: [{ 
    content: String,
    addedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    addedAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

const PatientGoal = mongoose.models.PatientGoal || mongoose.model("PatientGoal", patientGoalSchema);

export default PatientGoal;
