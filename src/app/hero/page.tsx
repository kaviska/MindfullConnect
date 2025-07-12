"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Refund() {
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  useEffect(() => {
    // Check on mount + resize
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 1070);git checkout B
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#E1F3FD] px-6">
      <div className={`absolute left-0 ${isLargeScreen ? "w-3/5" : "w-full"} flex items-center justify-start h-full px-6 lg:pl-20`}>
        <div className="w-full text-left space-y-8">
          <h1 className="text-[50px] md:text-[80px] font-black text-[#1045A1] leading-tight break-words" style={{ fontFamily: 'Poppins' }}>
            Healing is your right!<br />Claim it now!
          </h1>
          <p className="text-gray-700 text-[18px] md:text-[24px] leading-relaxed">
            Your journey to healing, peace, and happiness starts 
            right here, at <span className="font-semibold">MindfulConnect</span>.  
            At this safe place, we connect you with licensed therapists ready 
            to help you find your inner peace.
          </p>
          <Link href="/">
            <button className="mt-9 bg-[#70C6E6] text-[17px] text-gray-900 font-medium px-6 py-3 rounded-full flex items-center gap-2 hover:bg-[#8EC2EB] transition">
              Take the first step today →
            </button>
          </Link>
        </div>
      </div>

      {/* Only render if screen is large */}
      {isLargeScreen && (
        <div className="absolute right-0 w-2/5 flex justify-end m-0 p-0" style={{ right: '-2%' }}>
          <Image 
            width={678}
            height={1036} 
            src="/HeroImg.png"
            alt="Smiling woman representing healing"
            priority 
            className="rounded-lg drop-shadow-lg"
          />
        </div>
      )}
    </div>
  );
}