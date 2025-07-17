import mongoose from "mongoose";

// Define array limit function FIRST
function arrayLimit(val: string[]): boolean {
    return val.length > 0;
}

// Define the Report schema
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
    ],
    proof: {
        data: Buffer,
        contentType: String,
    },
},
    { timestamps: true }
);

// Finally export it
export const User = mongoose.models.User || mongoose.model("User", userSchema);

// Define the Report schema
const reportSchema = new mongoose.Schema(
    {
        reporterName: {
            type: String,
            required: true,
            unique: true,
            minlength: 5,
            maxlength: 50
        },
        reporteeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        reporteeName: {
            type: String,
            required: true,
            unique: true,
            minlength: 5,
            maxlength: 50
        },
        reportType: {
            type: String,
            required: true,
            enum: [
                "Harassment",
                "Inappropriate Language",
                "Unprofessional Behavior",
                "Spam or Scams",
                "Other",
            ],
        },
        description: {
            type: String,
            required: true,
            minlength: 10,
            maxlength: 1000,
        },
        status: {
            type: String,
            enum: ["Pending", "Resolved"],
            default: "Pending",
        },
        chatReferenceId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Chat", // optional if you implement chat tracking
        },
        actionNote: {
            type: String,
            maxlength: 500,
        },
    },
    { timestamps: true }
);

export const Report = mongoose.models.Report || mongoose.model("Report", reportSchema);

// Define the Payment schema
const paymentSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        userName: {
            type: String,
            required: true,
        },
        counsellorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        counsellorName: {
            type: String,
            required: true,
        },
        sessionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Session",
            required: true,
        },
        amount: {
            type: Number,
            required: true,
            min: 0,
        },
        paymentMethod: {
            type: String,
            enum: ["Debit", "Credit"],
            required: true,
        },
        transactionDate: {
            type: Date,
            default: Date.now,
        },
        status: {
            type: String,
            enum: ["Success", "Pending", "Failed"],
            default: "Pending",
        },
        reference: {
            type: String,
            unique: true,
        }
    },
    { timestamps: true }
);

export const Payment = mongoose.models.Payment || mongoose.model("Payment", paymentSchema);
