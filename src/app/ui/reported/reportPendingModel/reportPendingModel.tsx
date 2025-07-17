"use client";

import React, { useEffect, useState } from "react";

interface ReportPendingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (note: string, action: "ban" | "solve") => void;
    report: any;
}

const ReportPendingModal: React.FC<ReportPendingModalProps> = ({ isOpen, onClose, onSave, report }) => {
    const [note, setNote] = useState("No action taken");

    useEffect(() => {
        if (report) {
            setNote(report.actionNote && report.actionNote.trim() !== "" ? report.actionNote : "No action taken");
        }
    }, [report]);

    if (!isOpen || !report) return null;

    const handleAction = (type: "ban" | "solve") => {
        onSave(note, type);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-[#e6f0fa] p-6 rounded-2xl w-full max-w-3xl relative">
                <button className="absolute top-4 right-4 text-red-600 text-lg" onClick={onClose}>❌</button>
                <h2 className="text-xl font-bold text-center mb-6">Report Summary</h2>

                <div className="grid grid-cols-2 gap-6 mb-4">
                    <div className="text-center">
                        <img src="/avatar.png" className="w-24 h-24 rounded-full mx-auto mb-2" />
                        <p className="font-medium">{report.reporterName}</p>
                        <p className="text-sm text-gray-500">Reporter</p>
                    </div>
                    <div className="text-center">
                        <img src="/avatar.png" className="w-24 h-24 rounded-full mx-auto mb-2" />
                        <p className="font-medium">{report.reporteeName}</p>
                        <p className="text-sm text-gray-500">Reportee</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                    <input disabled value={new Date(report.createdAt).toLocaleDateString()} className="p-2 bg-white rounded" />
                    <input disabled value={report.reportType} className="p-2 bg-white rounded" />
                </div>

                <textarea disabled value={report.description} className="w-full h-28 p-3 bg-white rounded mb-4" />

                <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Actions taken..."
                    className="w-full h-20 p-3 bg-white rounded mb-6"
                />

                <div className="flex justify-between">
                    <button
                        className="bg-red-500 text-white px-6 py-2 rounded-full"
                        onClick={() => handleAction("ban")}
                    >
                        Ban Reportee
                    </button>
                    <button
                        className="bg-sky-500 text-white px-6 py-2 rounded-full"
                        onClick={() => handleAction("solve")}
                    >
                        Set as Solved
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReportPendingModal;