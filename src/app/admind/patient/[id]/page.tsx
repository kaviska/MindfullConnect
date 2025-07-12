"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BlockUserModal from "../../../ui/blockuser/blockuser";

interface UserType {
    firstname?: string;
    lastname?: string;
    dateofbirth?: string;
    email?: string;
    contact?: string;
    gender?: string;
    nic?: string;
    nationality?: string;
    profession?: string;
    [key: string]: any;
}

const UserInfo = ({ id }: { id: string }) => {
    const router = useRouter();
    const [user, setUser] = useState<UserType | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const res = await fetch(`/api/user/${id}`);
                const data = await res.json();
                console.log("Fetched user:", data);
                setUser(data);
            } catch (err) {
                console.error("Client fetch error:", err);
            }
        };
        loadUser();
    }, [id]);

    const handleBack = () => router.push("/admind/patient");
    const handleBlock = () => setIsModalOpen(true);
    const handleDelete = () => setIsModalOpen(false);
    const handleCloseModal = () => setIsModalOpen(false);

    if (!user) return <div>Loading...</div>;

    const fields = [
        { label: "First Name", value: user.firstname },
        { label: "Last Name", value: user.lastname },
        {
            label: "Date of Birth",
            value: user.dateofbirth ? new Date(user.dateofbirth).toLocaleDateString() : "Not Available"
        },
        { label: "Email address", value: user.email },
        { label: "Contact Number", value: user.contact },
        { label: "Gender", value: user.gender },
        { label: "NIC/ Passport number", value: user.nic },
        { label: "Nationality", value: user.nationality },
        { label: "Profession", value: user.profession },
    ];

    return (
        <div className="min-h-screen flex flex-col items-center p-6 md:p-10 relative">
            <div className="w-full flex justify-between items-center mb-8">
                <button onClick={handleBack} className="bg-blue-600 text-white px-6 py-2 rounded-full text-sm hover:bg-blue-700 transition">
                    Back
                </button>
                <button onClick={handleBlock} className="bg-red-600 text-white px-6 py-2 rounded-full text-sm hover:bg-red-700 transition">
                    Block
                </button>
            </div>

            <div className="flex flex-col items-center mb-10 text-center">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">Patient Details</h1>
                <img src="/rsessions.png" alt="Profile" className="w-28 h-28 md:w-32 md:h-32 rounded-full object-cover mb-4" />
                <p className="text-gray-700 font-semibold">User ID: {id}</p>
            </div>

            <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-6">
                {fields.map(({ label, value }, idx) => (
                    <div key={idx} className="flex flex-col">
                        <label className="text-gray-700 text-sm mb-1">{label}</label>
                        <input
                            type="text"
                            value={value || "Not Available"} // Show "Not Available" when no value is present
                            disabled
                            className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300 text-[#94A3B8]"
                        />
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <BlockUserModal isOpen={isModalOpen} onClose={handleCloseModal} onDelete={handleDelete} />
            )}
        </div>
    );
};

export default UserInfo;