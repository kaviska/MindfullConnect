import mongoose, { Schema, Document, models, model } from "mongoose";

// Define array limit function FIRST
function arrayLimit(val: string[]): boolean {
    return val.length > 0;
}

// Now create your userSchema safely
const userSchema = new mongoose.Schema({

    firstname: {
        type: String,
        required: true,
        unique: true,
        minlength: 5,
        maxlength: 20
    },
    lastname: {
        type: String,
        required: true,
        unique: true,
        minlength: 5,
        maxlength: 20
    },
    dateofbirth: {
        type: Date,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    contact: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true,
        enum: ["male", "female", "other"]
    },
    nic: {
        type: String,
        required: true,
        unique: true,
        minlength: 10,
        maxlength: 12
    },
    address: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 100
    },
    nationality: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50
    },
    role: {
        type: String,
        required: true,
        enum: ["patient", "counsellor", "admin"]
    },
    profession: {//patient only
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50
    },
    image: {
        type: String
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 8
    },
    isActive: {
        type: Boolean,
        default: false
    },
    specializations: {
        type: [String],
        required: true,
        validate: [arrayLimit, 'At least one specialization is required.']
    },
    qualifications: {
        type: [String],
        required: true,
        validate: [arrayLimit, 'At least one qualification is required.']
    },
    availability: [
        {
            day: {
                type: String,
                required: true,
                enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
            },
            startTime: {
                type: String,
                required: true
            },
            endTime: {
                type: String,
                required: true
            }
        }
    ]
},
    { timestamps: true }
);

// Finally export it
export const User = mongoose.models.User || mongoose.model("User", userSchema);