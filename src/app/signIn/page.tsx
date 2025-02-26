"use client";
import React from "react";
import PrimeButton from "../components/PrimeButton";
import googleIcon from "../../../public/google.svg";
import TextField from "@mui/material/TextField";
import Switch from "@mui/material/Switch";

export default function SignIn() {
  return (
    <div className="flex gap-0">
      <div className="md:w-[50%] md:block hidden bg-cover bg-center sign-in-left"></div>
      <div className="md:w-[50%] w-[100%] px-7">
        <div className="flex justify-end">
             <PrimeButton
             className="mt-6 px-4 py-1 rounded-[18px] bg-[#007AFF]"
             text={{
                text: "<- Back",
                className: "text-white",
             }}
             ></PrimeButton>
        </div>
        <div>
        <h1 className=" font-bold text-[28px] mt-6 text-center">
          Mindfull Connect
        </h1>
        <h3 className="font-semibold text-[22px] mt-6"> Nice To See You Again</h3>
        </div>

        
       

        <div className="mt-6">
          <label className=" mb-2 block">Login</label>
          <TextField
            variant="filled"
            label="Email or Phone Number"
            
            fullWidth
            sx={{
              // Target the input element for padding and border radius
              "& .MuiInputBase-root": {
                borderRadius: "10px", // Custom border radius
                padding: "0px 0px", // Custom padding
                height: "50px",
                fontSize: "12px",
                backgroundColor: "#F5F5F5",
              
              
              },
              "& .MuiFilledInput-underline:before": {
                borderBottom: "none", // Remove the default underline
              },
              "& .MuiFilledInput-underline:after": {
                borderBottom: "2px solid #007AFF", // Blue underline when focused
              },
              "& .MuiFormLabel-root": {
                fontSize: "12px",
              },
              
              
          
            }}
          />

          <label htmlFor="" className="mt-6 mb-2 block">Password</label>
          <TextField
         
            variant="filled"
            label="Enter Password"
            fullWidth
            sx={{
               
              // Target the input element for padding and border radius
              "& .MuiInputBase-root": {
                borderRadius: "10px", // Custom border radius
                padding: "0px 0px", // Custom padding
                fontSize: "12px",
                height: "50px",

                backgroundColor: "#F5F5F5",
              },
              "& .MuiFilledInput-underline:before": {
                borderBottom: "none", // Remove the default underline
              },
              "& .MuiFilledInput-underline:after": {
                borderBottom: "2px solid #007AFF", // Blue underline when focused
              },
              "& .MuiInputBase-input::placeholder": {
                fontSize: "10px", // Custom placeholder font size
              },
              "& .MuiFormLabel-root": {
                fontSize: "12px",
              },
            }}
          />
        </div>
        <div className="mt-4 flex justify-between">
          <div>
        <Switch defaultChecked /><span>Remember Me</span>

          </div>
          <div>
            <span className="text-[#007AFF]">Frogot Password</span>
          </div>

        </div>
        <div className="mt-6">
        <PrimeButton
          text={{
            text: "Sign In",
            className: "text-white",
          }}
          className="bg-[#007AFF] px-6 py-3 w-full rounded-[18px]"
        />
        <PrimeButton
          text={{
            text: "Or sign in with Google",
            className: "text-white",
          }}
          image={{
            src: googleIcon,
            width:  20,
            height: 20,
            alt: "google icon",
            className: "mr-0",
          }}
          className="bg-[#333333] flex gap-4 justify-center items-center px-6 py-3 w-full rounded-[18px] mt-6"
        />

        </div>

        
        <p className="text-center mt-6">
          Dont have an account?{" "}
          <span className="text-[#007AFF]">Sign up now</span>
        </p>
      </div>
    </div>
  );
}
