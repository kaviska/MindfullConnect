"use client";

import { X } from "lucide-react";
import React, { useState } from "react";
import DownloadIcon from "@mui/icons-material/Download";
import CounsellorAcceptedModal from "../acceptedmodal/acceptedmodal"; // ✅ Correct accepted modal
import RejectCounsellorModal from "../rejectcounsellormodal/rejectcounsellormodal"; // ✅ Correct reject modal
import { useRouter } from "next/navigation";

export interface CounsellorProfilePopupProps {
    counsellor: any;
    onClose: () => void;
    onAccept: () => void;
    onReject: () => void;
}

const ProfilePopup: React.FC<CounsellorProfilePopupProps> = ({
    counsellor,
    onClose,
    onAccept,
    onReject,
}) => {
    const [showAcceptModal, setShowAcceptModal] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const router = useRouter();

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
                                { label: "Full Name", value: counsellor.name || counsellor.fullName },
                                { label: "Email Address", value: counsellor.email },
                                { label: "Specialty", value: counsellor.specialty },
                                { label: "Years of Experience", value: counsellor.yearsOfExperience },
                                { label: "Consultation Fee", value: counsellor.consultationFee ? `$${counsellor.consultationFee}` : '' },
                                { label: "Rating", value: counsellor.rating ? `${counsellor.rating}/5` : '' },
                                { label: "Reviews Count", value: counsellor.reviews },
                                { label: "Highest Qualification", value: counsellor.highestQualification },
                                { label: "University", value: counsellor.university },
                                { label: "License Number", value: counsellor.licenseNumber },
                                { label: "Availability Type", value: counsellor.availabilityType },
                                { label: "Session Duration", value: counsellor.sessionDuration ? `${counsellor.sessionDuration} mins` : '' },
                                { label: "Status", value: counsellor.status },
                            ].map((field, i) => (
                                <div key={i}>
                                    <label className="block mb-1 font-semibold text-gray-700">{field.label}</label>
                                    <input
                                        value={field.value || 'N/A'}
                                        readOnly
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-[#f5f7fa] text-sm text-gray-800 focus:outline-none"
                                    />
                                </div>
                            ))}

                            <div className="sm:col-span-1">
                                <label className="block mb-1 font-semibold text-gray-700">Bio</label>
                                <textarea
                                    value={counsellor.bio || 'N/A'}
                                    readOnly
                                    className="w-full min-h-[5rem] px-3 py-2 border border-gray-300 rounded-md bg-[#f5f7fa] text-sm text-gray-800 resize-y focus:outline-none"
                                />
                            </div>
                            <div className="sm:col-span-1">
                                <label className="block mb-1 font-semibold text-gray-700">Description</label>
                                <textarea
                                    value={counsellor.description || 'N/A'}
                                    readOnly
                                    className="w-full min-h-[5rem] px-3 py-2 border border-gray-300 rounded-md bg-[#f5f7fa] text-sm text-gray-800 resize-y focus:outline-none"
                                />
                            </div>

                            <div className="sm:col-span-2">
                                <label className="block mb-2 font-semibold text-gray-700">Languages Spoken</label>
                                <div className="bg-[#f5f7fa] px-5 py-3 rounded-md text-sm shadow-sm border border-gray-300">
                                    {counsellor.languagesSpoken && counsellor.languagesSpoken.length > 0 
                                        ? counsellor.languagesSpoken.join(', ') 
                                        : 'N/A'}
                                </div>
                            </div>

                            <div className="sm:col-span-2">
                                <label className="block mb-2 font-semibold text-gray-700">Therapeutic Modalities</label>
                                <div className="bg-[#f5f7fa] px-5 py-3 rounded-md text-sm shadow-sm border border-gray-300">
                                    {counsellor.therapeuticModalities && counsellor.therapeuticModalities.length > 0 
                                        ? counsellor.therapeuticModalities.join(', ') 
                                        : 'N/A'}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-center gap-20 mt-12 mb-2">
                            <button
                                onClick={() => setShowRejectModal(true)}
                                className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full font-semibold shadow-md transition"
                            >
                                Reject Counsellor
                            </button>

                            <button
                                onClick={async () => {
                                    await onAccept(); // updates isActive to true in DB
                                    setShowAcceptModal(true); // opens AcceptedModal
                                }}
                                className="bg-sky-500 hover:bg-sky-600 text-white px-8 py-3 rounded-full font-semibold shadow-md transition"
                            >
                                Accept Counsellor
                            </button>

                        </div>
                    </div>
                </div>
            </div>

            <CounsellorAcceptedModal
                isOpen={showAcceptModal}
                onOk={() => {
                    setShowAcceptModal(false);
                    onClose();
                }}
            />

            <RejectCounsellorModal
                isOpen={showRejectModal}
                onCancel={() => setShowRejectModal(false)}
                onReject={() => {
                    setShowRejectModal(false);
                    onReject();
                }}
            />
        </>
    );
};

export default ProfilePopup;
