import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel"
import { NextRequest,NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import bcryptjs from "bcryptjs";
import jwt from "jasonwebtoken";

connect()

export async function POST(request:NextRequest) {
try {
    const reqBody = request.json()
    const {email,password}=reqBody;
    console.log(reqBody);

    //check if user exists
    const user = await User.findOne{{email}}
    if(!user){
        return NextResponse.json({error:"User does not exixst"},{status:400})
    }

    //check if password is correct
   const validPassword = await bcryptjs.compare(password,user.password)
   if(!validPassword){
    return NextResponse.json({error:"invalid password"},{status:400})
   }
//create token data 
const tokenData ={
    id:user.id,
    username:user.username,
    email:user.email
}
// create token
const token = await jwt.sign(tokenData,process.env.TOKEN_SECRET!,{expiresIn:"1d"})

const response =NextResponse.json({message:"login successful"})

response.cookies.set("token",token,{httpOnly:true,})

return response;
} catch (error:any) {
   return NextResponse.json({error:error.message},{status:500}) 
}



}