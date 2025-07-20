import mongoose, { Schema, Document } from "mongoose";

export interface IContactUs extends Document {
    fullName: string;
    email: string;
    contact: string;
    role: "User" | "Counsellor";
    message: string;
    createdAt: Date;
}

const ContactUsSchema: Schema = new Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    contact: { type: String, required: true },
    role: { type: String, enum: ["User", "Counsellor"], required: true },
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.ContactUs || mongoose.model<IContactUs>("ContactUs", ContactUsSchema);