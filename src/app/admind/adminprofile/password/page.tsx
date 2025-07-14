'use client';
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import SuccessModal from "@/app/ui/success/success"; // Adjust path if needed

export default function AdminPassword() {
    const router = useRouter();
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const handleCancel = () => {
        router.push('/admind/adminprofile/profile');
    };

    const handleProfileClick = () => {
        router.push('/admind/adminprofile/profile');
    };

    const handleSave = () => {
        // Optional: Add validation or API logic here
        setShowSuccessModal(true);
    };

    const handleModalOk = () => {
        setShowSuccessModal(false);
        router.push('/admind/adminprofile/profile');
    };

    const handleModalCancel = () => {
        setShowSuccessModal(false);
    };

    return (
        <div className="min-h-screen flex flex-col items-center p-6 md:p-10">
            {/* Tabs */}
            <div className="flex w-full max-w-6xl border-b mb-8">
                <button
                    onClick={handleProfileClick}
                    className="px-4 py-2 ml-4 text-gray-500 hover:text-blue-600 transition"
                >
                    Profile
                </button>
                <button className="px-4 py-2 font-semibold text-blue-600 border-b-2 border-blue-600">
                    Change Password
                </button>
            </div>

            {/* Profile Picture */}
            <div className="flex justify-center mb-8">
                <Image
                    src="/rsessions.png"
                    alt="Profile Picture"
                    width={120}
                    height={120}
                    className="rounded-full object-cover"
                />
            </div>

            {/* Form */}
            <div className="grid grid-cols-2 gap-6 w-full max-w-3xl">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        defaultValue="kasi@gmail.com"
                        className="w-full p-2 mt-1 rounded-md bg-white border border-gray-300"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Current Password</label>
                    <input
                        type="password"
                        className="w-full p-2 mt-1 rounded-md bg-white border border-gray-300"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">New Password</label>
                    <input
                        type="password"
                        className="w-full p-2 mt-1 rounded-md bg-white border border-gray-300"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                    <input
                        type="password"
                        className="w-full p-2 mt-1 rounded-md bg-white border border-gray-300"
                    />
                </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-between w-full max-w-3xl mt-10">
                <button onClick={handleCancel} className="px-6 py-2 bg-gray-300 text-gray-800 font-semibold rounded-full hover:bg-gray-400">
                    Cancel
                </button>
                <button onClick={handleSave} className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700">
                    Save
                </button>
            </div>

            {/* Success Modal */}
            {showSuccessModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                    <SuccessModal onOk={handleModalOk} onCancel={handleModalCancel} />
                </div>
            )}
        </div>
    );
}
