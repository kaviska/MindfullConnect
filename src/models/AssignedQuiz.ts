import mongoose from 'mongoose'

const AssignedQuizSchema: mongoose.Schema = new mongoose.Schema({
    quiz_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz',
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
    questions: [
        {
            question: String,
            choices: [String],
            answer: String,
            correctAnswer: String,
           
        },
    ],
    assignedAt: {
        type: Date,
        default: Date.now,
    },
})
const AssignedQuiz = mongoose.models.AssignedQuiz || mongoose.model('AssignedQuiz', AssignedQuizSchema)
export default AssignedQuiz