'use client';

import { CheckCircle } from 'lucide-react';
import React from 'react';

interface SuccessModalProps {
    onOk: () => void;
    onCancel: () => void;
}

export default function SuccessModal({ onOk, onCancel }: SuccessModalProps) {
    return (
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md text-center">
            <div className="flex justify-center mb-4">
                <div className="bg-green-100 rounded-full p-3">
                    <CheckCircle className="text-green-500 w-10 h-10" />
                </div>
            </div>

            <h2 className="text-xl font-semibold text-gray-800 mb-6">
                Changes Saved Successfully
            </h2>

            <div className="flex gap-4">
                <button
                    onClick={onCancel}
                    className="w-full border border-gray-300 text-gray-700 rounded-lg py-2 hover:bg-gray-100 transition"
                >
                    Cancel
                </button>
                <button
                    onClick={onOk}
                    className="w-full bg-green-600 text-white rounded-lg py-2 hover:bg-green-700 transition"
                >
                    OK
                </button>
            </div>
        </div>
    );
}
