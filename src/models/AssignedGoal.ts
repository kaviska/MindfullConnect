import mongoose from "mongoose";

const AssignedGoalSchema = new mongoose.Schema({
    goal_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Goals',
        required: true,
    },
    patient_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true,
    },
    counsellor_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Counsellor',
        required: true,
    },
    status: {
        type: String,
        enum: ['assigned', 'completed'],
        default: 'assigned',
    },
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
            status: {
                type: String,
                enum: ['completed', 'pending'],
                default: 'pending',
            },
        },
    ],
    assignedAt: {
        type: Date,
        default: Date.now,
    },
})

const AssignedGoal = mongoose.models.AssignedGoal || mongoose.model('AssignedGoal', AssignedGoalSchema)
export default AssignedGoal