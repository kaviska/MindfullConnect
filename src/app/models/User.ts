import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    contact: String,
    dateOfBirth: Date,
    gender: { type: String, enum: ['male', 'female', 'other'] },
    nic: { type: String, unique: true, minlength: 10, maxlength: 12 },
    address: { type: String, minlength: 5, maxlength: 100 },
    nationality: { type: String, minlength: 2, maxlength: 50 },
    role: { type: String, enum: ['patient', 'counsellor', 'admin'], default: 'patient' },
    image: String,
});

export default mongoose.models.User || mongoose.model('User', userSchema);