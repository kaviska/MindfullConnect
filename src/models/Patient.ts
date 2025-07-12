import mongoose from "mongoose";

const PatientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ["normal", "danger"],
        default: "active",
    },
  
    
})


const Patient = mongoose.models.Patient || mongoose.model("Patient", PatientSchema);

export default Patient;

