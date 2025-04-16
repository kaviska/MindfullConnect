"use client";
import React from "react";
import { ChatMain } from "./ChatMain";
import { ChatSidebar } from "./ChatSidebar";
import { ProfileSidebar } from "./ProfileSidebar";

export const ChatLayout: React.FC = () => {
  return (
    <div className="flex flex-col pt-36 max-md:pt-24">
      <div className="flex z-10 gap-5 justify-center items-center self-center mt-36 ml-5 text-xs font-medium text-right text-blue-900 whitespace-nowrap max-md:mt-10">
        <div className="shrink-0 self-stretch my-auto h-px bg-indigo-100 border border-indigo-100 border-solid w-[175px]" />
        <time className="self-stretch my-auto">Today</time>
        <div className="shrink-0 self-stretch my-auto h-px bg-indigo-100 border border-indigo-100 border-solid w-[175px]" />
      </div>

      <div className="flex flex-wrap justify-between items-center mt-0 w-full max-md:max-w-full">
        <div className="flex items-start self-stretch my-auto min-h-[805px] min-w-60 w-[934px] max-md:max-w-full">
          <ChatSidebar />
          <ChatMain />
        </div>
        <ProfileSidebar />
      </div>
    </div>
  );
};

export default ChatLayout;
