import mongoose from "mongoose";
import { unique } from "next/dist/build/utils";
import { type } from "os";
const userSchema =new mongoose.Schema({
username:{
    type:String,
    required:[true,"please provide a valid user name"],
    unique:true,
     
},
email:{
    type:String,
    required:[true,"please provide a valid Email"],
    unique:true,
},
isVerified:{
    type:Boolean,
    default:false,
},
isAdmin:{
    type:Boolean,
    default:false,
},
forgotPasswordToken:String,
forgotPasswordTokenExpairy:Date,
verifyToken:String,
verifyTokenExpiry:Date,
});

const User = mongoose.models.users || mongoose.model("users",userSchema);

export default User;