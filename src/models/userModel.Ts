import mongoose from "mongoose";

interface IUser extends mongoose.Document {
  username: string;
  email: string;
  password?: string;
  googleId?: string;
  profileImage?: string;
  firstName?: string;
  lastName?: string;
  nic?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  role?: "patient" | "counselor";
  isVerified: boolean;
  isAdmin: boolean;
  otp?: string;
  otpExpiry?: Date;
  forgotPasswordToken?: string;
  forgotPasswordTokenExpiry?: Date;
  verifyToken?: string;
  verifyTokenExpiry?: Date;
}

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please provide a username"],
    unique: true,
    trim: true,
    minlength: [3, "Username must be at least 3 characters"],
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: true,
    trim: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please provide a valid email",
    ],
  },
  password: {
    type: String,
    required: false,
    minlength: [6, "Password must be at least 6 characters"],
  },
  googleId: {
    type: String,
    default: null,
  },
  profileImage: {
    type: String,
    default: null,
  },
  firstName: {
    type: String,
    default: null,
  },
  lastName: {
    type: String,
    default: null,
  },
  nic: {
    type: String,
    default: null,
  },
  address: {
    type: String,
    default: null,
  },
  city: {
    type: String,
    default: null,
  },
  postalCode: {
    type: String,
    default: null,
  },
  role: {
    type: String,
    enum: ["patient", "counselor"],
    default: null,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  otp: {
    type: String,
    default: null,
  },
  otpExpiry: {
    type: Date,
    default: null,
  },
  forgotPasswordToken: String,
  forgotPasswordTokenExpiry: Date,
  verifyToken: String,
  verifyTokenExpiry: Date,
}, {
  timestamps: true
});

const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;