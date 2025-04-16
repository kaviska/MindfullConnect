"use client";
import React from "react";
import { ChatMessage } from "./ChatMessage";
import { ChatMessage as ChatMessageType } from "./types";

export const ChatMain: React.FC = () => {
  const messages: ChatMessageType[] = [
    {
      id: "1",
      content: "Dolor sit amet, consectetur adipiscing elit. Hendrerit",
      timestamp: "5min ago",
      sender: "user",
    },
    {
      id: "2",
      content:
        "Dolor sit amet, consectetur adipiscing elit. Hendrerit vulputate viverra commodo tincidunt",
      timestamp: "5min ago",
      sender: "other",
    },
    {
      id: "3",
      content:
        "Can you send the file of Martins UX case study and the link to wireframe ?",
      timestamp: "5min ago",
      sender: "other",
    },
    {
      id: "4",
      content: "Yes. Here it is",
      timestamp: "5min ago",
      sender: "user",
      attachment: {
        type: "PDF",
        name: "Martins UX case study",
        date: "22 Jun, 2022",
        size: "238 KB",
      },
    },
    // Add other messages...
  ];

  return (
    <main className="flex flex-col justify-center px-6 py-8 bg-white min-h-[805px] min-w-60 w-[653px] max-md:px-5 max-md:max-w-full">
      <div className="flex-1 w-full max-md:max-w-full">
        <header className="flex flex-wrap gap-10 justify-between items-center py-3 pr-2 w-full border-b border-solid border-b-[color:var(--Primary-P7,#E5EAFF)]">
          <div className="flex gap-2.5 items-center self-stretch my-auto">
            <div className="flex gap-2 items-center self-stretch my-auto">
              <div className="flex flex-col items-center self-stretch pt-1 pb-8 my-auto w-12 h-12 bg-red-200 rounded-[100.75px]">
                <div className="flex shrink-0 bg-emerald-500 h-[11px] rounded-[100px] w-[11px]" />
              </div>
              <div className="flex flex-col items-start self-stretch my-auto text-center text-black">
                <h2 className="text-xs font-semibold">Jean-Eude Cokou</h2>
                <p className="mt-1 text-xs">Project Manager</p>
              </div>
            </div>
          </div>
          <div className="flex gap-4 items-center self-stretch my-auto">
            <button>
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/d08141d8351701fa168fadc1daef0ca269e159d4?placeholderIfAbsent=true&apiKey=fd0c2c04ade54c2997bae3153b14309c"
                className="object-contain w-6 aspect-square"
                alt="Video call"
              />
            </button>
            <button>
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/c3efc60fdff5781dc31234b0e6b5046dbdf466c7?placeholderIfAbsent=true&apiKey=fd0c2c04ade54c2997bae3153b14309c"
                className="object-contain w-6 aspect-square"
                alt="Audio call"
              />
            </button>
            <button>
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/0ee42b3e99f27e7d2774d2c8caf9c4f0b55edf43?placeholderIfAbsent=true&apiKey=fd0c2c04ade54c2997bae3153b14309c"
                className="object-contain w-6 aspect-square"
                alt="More options"
              />
            </button>
          </div>
        </header>

        <section className="flex-1 mt-8 w-full bg-white rounded-xl">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
        </section>

        <footer className="flex flex-wrap gap-10 justify-between items-center px-3 py-2 mt-16 w-full rounded-lg">
          <div className="flex gap-2 items-center self-stretch my-auto text-sm text-stone-500">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/88e4a9230a70882d89aeeab379816c034333991d?placeholderIfAbsent=true&apiKey=fd0c2c04ade54c2997bae3153b14309c"
              className="object-contain shrink-0 self-stretch my-auto w-6 aspect-square"
              alt="Attachment"
            />
            <input
              type="text"
              placeholder="Enter your message"
              className="self-stretch my-auto bg-transparent outline-none"
            />
          </div>
          <button className="flex gap-2.5 items-center self-stretch p-3 my-auto w-10 h-10 bg-blue-900 rounded-lg">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/3f38d43167fc382dbd85341eabad86ddafabc14c?placeholderIfAbsent=true&apiKey=fd0c2c04ade54c2997bae3153b14309c"
              className="object-contain self-stretch my-auto w-4 aspect-square"
              alt="Send"
            />
          </button>
        </footer>
      </div>
    </main>
  );
};
