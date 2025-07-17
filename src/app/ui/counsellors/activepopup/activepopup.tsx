"use client";

import { X } from "lucide-react";
import React, { useState } from "react";
import DownloadIcon from "@mui/icons-material/Download";
import BlockUserModal from "../../blockuser/blockuser";

interface CounsellorProfilePopupProps {
    counsellor: any;
    onClose: () => void;
    onBlock: () => void;
}

const ProfilePopup: React.FC<CounsellorProfilePopupProps> = ({
    counsellor,
    onClose,
    onBlock,
}) => {
    const [showBlockModal, setShowBlockModal] = useState(false);

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
                <div className="relative bg-[#e7f1f8] rounded-3xl max-w-4xl w-full max-h-[90vh] shadow-lg overflow-hidden">
                    <div className="overflow-y-auto max-h-[90vh] p-8">
                        <div className="flex justify-end mb-4 sticky top-0 z-10 bg-[#e7f1f8]">
                            <button
                                onClick={onClose}
                                className="text-red-600 hover:text-red-700 transition"
                                aria-label="Close popup"
                            >
                                <X size={28} />
                            </button>
                        </div>

                        <div className="flex flex-col items-center mb-8 mt-4">
                            <img
                                src={counsellor.imageUrl}
                                alt="profile"
                                className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-md"
                            />
                            <h2 className="text-2xl font-bold text-[#1045A1] mt-5">
                                Personal Details
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            {[
                                { label: "Full Name", value: counsellor.firstname + " " + counsellor.lastname },
                                { label: "Date of Birth", value: counsellor.dob },
                                { label: "Email address", value: counsellor.email },
                                { label: "Contact Number", value: counsellor.contact },
                                { label: "Gender", value: counsellor.gender },
                                { label: "NIC", value: counsellor.nic },
                                { label: "Nationality", value: counsellor.nationality },
                            ].map((field, i) => (
                                <div key={i}>
                                    <label className="block mb-1 font-semibold text-gray-700">{field.label}</label>
                                    <input
                                        value={field.value}
                                        readOnly
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-[#f5f7fa] text-sm text-gray-800 focus:outline-none"
                                    />
                                </div>
                            ))}

                            <div className="sm:col-span-1">
                                <label className="block mb-1 font-semibold text-gray-700">Qualifications</label>
                                <textarea
                                    value={counsellor.qualifications}
                                    readOnly
                                    className="w-full min-h-[5rem] px-3 py-2 border border-gray-300 rounded-md bg-[#f5f7fa] text-sm text-gray-800 resize-y focus:outline-none"
                                />
                            </div>
                            <div className="sm:col-span-1">
                                <label className="block mb-1 font-semibold text-gray-700">Specialization Areas</label>
                                <textarea
                                    value={counsellor.specialization}
                                    readOnly
                                    className="w-full min-h-[5rem] px-3 py-2 border border-gray-300 rounded-md bg-[#f5f7fa] text-sm text-gray-800 resize-y focus:outline-none"
                                />
                            </div>

                            <div className="sm:col-span-2">
                                <label className="block mb-2 font-semibold text-gray-700">Proof Documents</label>
                                <div className="flex items-center gap-3">
                                    <div className="bg-[#f5f7fa] px-5 py-3 rounded-md text-sm flex items-center gap-3 shadow-sm border border-gray-300">
                                        <DownloadIcon fontSize="small" />
                                        <a
                                            href={counsellor.proofUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            download
                                            className="text-blue-700 hover:underline"
                                        >
                                            Download
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-center gap-10 mt-12 mb-2">
                            <button
                                onClick={() => setShowBlockModal(true)}
                                className="bg-red-600 hover:bg-red-700 text-white px-10 py-3 rounded-full font-semibold shadow-md transition"
                            >
                                Block Counsellor
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <BlockUserModal
                isOpen={showBlockModal}
                onClose={() => setShowBlockModal(false)}
                onDelete={() => {
                    setShowBlockModal(false);
                    onBlock();
                }}
            />
        </>
    );
};

export default ProfilePopup;
