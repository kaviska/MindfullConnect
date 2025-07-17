"use client";

import React, { useEffect } from "react";

interface CounsellorAcceptedModalProps {
    isOpen: boolean;
    onOk: () => void;
}

const CounsellorAcceptedModal: React.FC<CounsellorAcceptedModalProps> = ({
    isOpen,
    onOk,
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-sm text-center shadow-xl">
                <h2 className="text-xl font-bold mb-6 text-[#1045A1]">Counsellor accepted</h2>
                <p className="text-gray-600 mb-6">The counsellor has been successfully approved.</p>
                <button
                    onClick={onOk}
                    className="bg-sky-500 text-white px-6 py-2 rounded-lg hover:bg-sky-600 transition"
                >
                    OK
                </button>
            </div>
        </div>
    );
};

export default CounsellorAcceptedModal;
