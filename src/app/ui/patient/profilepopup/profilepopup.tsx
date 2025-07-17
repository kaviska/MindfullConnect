"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import BlockUserModal from "../../blockuser/blockuser";

interface Patient {
    _id: string;
    firstname: string;
    lastname: string;
    email: string;
    nic: string;
    address: string;
    contact: string;
    imageUrl: string;
    date?: string;
    gender?: string;
    nationality?: string;
    profession?: string;
    dateofbirth?: string;
}

interface ProfilePopupProps {
    onClose: () => void;
    patient: Patient;
}

export default function PatientProfilePopup({ onClose, patient }: ProfilePopupProps) {
    const router = useRouter();
    const [showModal, setShowModal] = useState(false);

    const handleBlock = () => {
        setShowModal(true);
    };

    const handleDelete = async () => {
        const formData = new FormData();
        formData.set("id", patient._id);
        await fetch("/api/deletepatient", {
            method: "POST",
            body: formData,
        });
        setShowModal(false);
        onClose();
        router.refresh();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-[#e9f3f9] p-8 rounded-xl w-full max-w-4xl relative shadow-lg">
                <div className="flex justify-between mb-6">
                    <button
                        onClick={onClose}
                        className="bg-blue-600 text-white px-6 py-2 rounded-full text-sm hover:bg-blue-700 transition"
                    >
                        Back
                    </button>
                    <button
                        onClick={handleBlock}
                        className="bg-red-600 text-white px-6 py-2 rounded-full text-sm hover:bg-red-700 transition"
                    >
                        Block
                    </button>
                </div>

                <div className="flex flex-col items-center mb-6">
                    <Image
                        src={patient.imageUrl || "/rsessions.png"}
                        alt="Patient"
                        width={100}
                        height={100}
                        className="rounded-full object-cover"
                    />
                    <p className="mt-3 text-sm font-semibold text-gray-700">User ID: {patient._id}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                        ["First Name", patient.firstname],
                        ["Last Name", patient.lastname],
                        ["Email", patient.email],
                        ["Contact", patient.contact],
                        ["NIC", patient.nic],
                        ["Address", patient.address],
                        ["Date of Birth", patient.dateofbirth || "Not Available"],
                        ["Gender", patient.gender || "Not Available"],
                        ["Nationality", patient.nationality || "Not Available"],
                        ["Profession", patient.profession || "Not Available"]
                    ].map(([label, value], idx) => (
                        <div key={idx}>
                            <label className="block mb-1 font-medium">{label}</label>
                            <input className="w-full p-2 rounded-md bg-white text-[#7d88ac]" value={value} readOnly />
                        </div>
                    ))}
                </div>
            </div>

            {showModal && (
                <BlockUserModal
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    onDelete={handleDelete}
                />
            )}
        </div>
    );
}
