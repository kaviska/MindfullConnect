"use client";

import Image from "next/image";

interface ProfilePopupProps {
  onClose: () => void;
  employee: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

export default function ProfilePopup({ onClose, employee }: ProfilePopupProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-[#e9f3f9] p-8 rounded-xl w-[700px] relative shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-red-400 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg"
        >
          X
        </button>

        <div className="flex justify-center mb-6">
          <Image
            src="/profile.jpg"
            alt="Profile"
            width={100}
            height={100}
            className="rounded-full object-cover"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-1 font-medium">First Name</label>
            <input
              className="w-full p-2 rounded-md bg-white text-[#7d88ac]"
              value={employee.firstName}
              readOnly
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Last Name</label>
            <input
              className="w-full p-2 rounded-md bg-white text-[#7d88ac]"
              value={employee.lastName}
              readOnly
            />
          </div>

          <div className="md:col-span-2">
            <label className="block mb-1 font-medium">Email</label>
            <input
              className="w-full p-2 rounded-md bg-white text-[#7d88ac]"
              value={employee.email}
              readOnly
            />
          </div>
        </div>
      </div>
    </div>
  );
}
