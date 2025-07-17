"use client";

import React, { useEffect, useState } from "react";

interface ReportResolvedModalProps {
    isOpen: boolean;
    onClose: () => void;
    report: any;
}

const ReportResolvedModal: React.FC<ReportResolvedModalProps> = ({ isOpen, onClose, report }) => {
    const [note, setNote] = useState("No action taken");

    useEffect(() => {
        if (report) {
            setNote(report.actionNote && report.actionNote.trim() !== "" ? report.actionNote : "No action taken");
        }
    }, [report]);

    if (!isOpen || !report) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-[#e6f0fa] p-6 rounded-2xl w-full max-w-3xl relative">
                <button className="absolute top-4 right-4 text-red-600 text-lg" onClick={onClose}>❌</button>
                <h2 className="text-xl font-bold text-center mb-6">Resolved Report</h2>

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

                <label className="block text-sm text-gray-600 mb-1">Report Description</label>
                <textarea
                    disabled
                    value={report.description}
                    className="w-full h-28 p-3 bg-white rounded mb-4"
                />

                <label className="block text-sm text-gray-600 mb-1">Action Taken</label>
                <textarea
                    disabled
                    value={note}
                    className="w-full h-24 p-3 bg-white rounded"
                />
            </div>
        </div>
    );
};

export default ReportResolvedModal;
