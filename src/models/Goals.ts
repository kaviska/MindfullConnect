import mongoose from 'mongoose';

const GoalsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    counsellor_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Counsellor',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    });

const Goals = mongoose.models.Goals || mongoose.model('Goals', GoalsSchema);
export default Goals;