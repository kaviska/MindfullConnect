import mongoose, { Schema } from "mongoose";

const paymentSchema = new Schema({
    sessionId: { type: Schema.Types.ObjectId, ref: "Session", required: true },
    patientId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    counselorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true }, // Amount in LKR
    currency: { type: String, default: "LKR" },
    status: { 
        type: String, 
        enum: ["pending", "completed", "failed", "refunded"], 
        default: "pending" 
    },
    paymentMethod: { type: String, enum: ["card", "bank", "paypal", "wallet"], default: "card" },
    transactionId: { type: String, unique: true },
    transactionDate: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now }
});

const Payment = mongoose.models.Payment || mongoose.model("Payment", paymentSchema);

export default Payment;
