"use client";
import React from "react";
import { ChatUserItem } from "./ChatUserItem";
import { ChatUser } from "./types";

export const ChatSidebar: React.FC = () => {
  const users: ChatUser[] = [
    {
      name: "Jean-Eude Cokou",
      status: "online",
      avatar: "avatar1",
      isTyping: true,
      lastMessageTime: "5min ago",
      unreadCount: 4,
    },
    {
      name: "UI Design team",
      lastMessage: "Frejus: Tell more about wireframe..",
      lastMessageTime: "8:15 AM",
      unreadCount: 3,
    },
    // Add other users...
  ];

  return (
    <aside className="flex gap-2.5 items-start bg-white min-h-[805px] min-w-60 w-[306px]">
      <div className="bg-white rounded-2xl border-r border-solid border-r-[color:var(--Primary-P7,#E5EAFF)] min-h-[774px] min-w-60 w-[298px]">
        <header className="w-full">
          <div className="flex gap-10 justify-between items-center px-5 pt-4 w-full rounded-xl">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/af7accf8d9e2a34fdcb44c9ff6e8afb11763ff74?placeholderIfAbsent=true&apiKey=fd0c2c04ade54c2997bae3153b14309c"
              className="object-contain shrink-0 self-stretch my-auto w-5 aspect-square"
              alt="Menu"
            />
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/c3a6323dbf2d354e271b79d7f87bad8e3c934906?placeholderIfAbsent=true&apiKey=fd0c2c04ade54c2997bae3153b14309c"
              className="object-contain shrink-0 self-stretch my-auto w-6 aspect-square"
              alt="New message"
            />
          </div>

          <nav className="px-5 mt-6 w-full text-center">
            <div className="flex gap-2 items-center p-1 w-full text-xs tracking-wide bg-blue-50 rounded-xl text-neutral-400">
              <button className="flex-1 shrink gap-2.5 self-stretch p-1 my-auto font-bold text-blue-900 bg-indigo-300 rounded basis-0">
                All
              </button>
              <button className="flex-1 shrink self-stretch my-auto basis-0">
                Teams
              </button>
              <button className="flex-1 shrink self-stretch my-auto basis-0">
                Unread
              </button>
            </div>

            <div className="flex gap-10 justify-between items-center px-4 py-3 mt-6 w-full text-base font-medium whitespace-nowrap rounded-lg text-neutral-400">
              <div className="flex gap-2 items-center self-stretch my-auto">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/f34afa7ac9a7fb7f479637d51e1ce5fe591b8369?placeholderIfAbsent=true&apiKey=fd0c2c04ade54c2997bae3153b14309c"
                  className="object-contain shrink-0 self-stretch my-auto w-6 aspect-square"
                  alt="Search"
                />
                <input
                  type="text"
                  placeholder="Search"
                  className="self-stretch my-auto bg-transparent outline-none"
                />
              </div>
              <button className="flex shrink-0 self-stretch my-auto w-6 h-6">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/0ee42b3e99f27e7d2774d2c8caf9c4f0b55edf43?placeholderIfAbsent=true&apiKey=fd0c2c04ade54c2997bae3153b14309c"
                  alt="Filter"
                  className="w-full h-full"
                />
              </button>
            </div>
          </nav>
        </header>

        <section className="mt-6 w-full bg-white rounded-xl">
          {users.map((user, index) => (
            <ChatUserItem key={user.name} user={user} isActive={index === 0} />
          ))}
        </section>
      </div>
    </aside>
  );
};
