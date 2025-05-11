"use client";

import React from "react";

interface BlockUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onDelete: () => void;
}

const BlockUserModal: React.FC<BlockUserModalProps> = ({ isOpen, onClose, onDelete }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-2xl shadow-lg max-w-md w-full p-6 relative animate-fadeIn">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                >
                    X {/* Add some text/icon */}
                </button>

                <div className="flex flex-col items-center text-center">
                    <div className="bg-red-100 p-4 rounded-full mb-4">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-8 w-8 text-red-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4m-4 0a2 2 0 00-2 2v2h8V5a2 2 0 00-2-2m-4 0h4"
                            />
                        </svg>
                    </div>

                    <h2 className="text-2xl font-bold mb-2">Delete User</h2>
                    <p className="text-gray-600 mb-6">
                        Are you sure you want to delete this user? This action cannot be undone.
                    </p>

                    <div className="flex w-full space-x-4">
                        <button
                            onClick={onClose}
                            className="w-full border border-gray-300 text-gray-700 rounded-lg py-2 hover:bg-gray-100 transition"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onDelete}
                            className="w-full bg-red-600 text-white rounded-lg py-2 hover:bg-red-700 transition"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlockUserModal;