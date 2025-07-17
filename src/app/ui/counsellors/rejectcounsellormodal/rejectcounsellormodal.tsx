"use client";

import React from "react";

interface RejectCounsellorModalProps {
    isOpen: boolean;
    onCancel: () => void;
    onReject: () => void;
}

const RejectCounsellorModal: React.FC<RejectCounsellorModalProps> = ({
    isOpen,
    onCancel,
    onReject,
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
                <h2 className="text-xl font-semibold mb-2">Reject counsellor</h2>
                <p className="text-gray-600 mb-6">
                    Are you sure you want to reject this counsellor? This action cannot be undone.
                </p>
                <div className="flex justify-end gap-4">
                    <button
                        onClick={onCancel}
                        className="border border-gray-300 rounded-lg px-6 py-2 hover:bg-gray-100"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onReject}
                        className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
                    >
                        Reject
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RejectCounsellorModal;
