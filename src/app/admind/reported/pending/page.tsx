"use client";

import React, { useEffect, useState } from "react";
import StatsCard from "../../../ui/reported/stats/stat";
import Pagination from "../../../ui/pagination/pagination";
import ReportPendingModal from "../../../ui/reported/reportPendingModel/reportPendingModel";
import DescriptionIcon from '@mui/icons-material/Description';

interface Report {
    _id: string;
    reporterName: string;
    reporteeName: string;
    reportType: string;
    status: "Pending" | "Resolved";
    description: string;
    actionNote?: string;
    createdAt?: string;
}

const fetchReports = async (
    page: number
): Promise<{ reports: Report[]; totalPages: number }> => {
    const res = await fetch(`/api/reports/pending?page=${page}`);
    if (!res.ok) throw new Error("Failed to fetch reports");

    const data = await res.json();
    return {
        reports: data.reports,
        totalPages: data.totalPages,
    };
};

export default function Pending() {
    const [reports, setReports] = useState<Report[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedReport, setSelectedReport] = useState<Report | null>(null);
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        fetchReports(currentPage)
            .then(({ reports, totalPages }) => {
                setReports(reports);
                setTotalPages(totalPages);
            })
            .catch((err) => console.error(err));
    }, [currentPage]);

    const handleSave = async (note: string, action: "ban" | "solve") => {
        if (!selectedReport) return;

        await fetch(`/api/reports/pending/${selectedReport._id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                actionNote: note,
                status: action === "solve" ? "Resolved" : "Pending",
                banUser: action === "ban",
            }),
        });

        const refreshed = await fetchReports(currentPage);
        setReports(refreshed.reports);
    };

    return (
        <div className="p-6 bg-[#E9F0F6] min-h-screen flex flex-col space-y-8">
            {/* Stats card centered */}
            <div className="w-full flex justify-center">
                <StatsCard />
            </div>

            {/* Heading */}
            <div className="flex items-center space-x-4">
                <h1 className="text-3xl font-bold text-[#1045A1]">Pending Reports</h1>
                <span className="text-xl text-[#1045A1]">({reports.length})</span>
            </div>

            {/* Reports Table */}
            <div className="bg-white rounded-xl overflow-x-auto shadow">
                <table className="min-w-full text-left text-xs sm:text-sm">
                    <thead className="bg-[#F5F7FA] text-gray-600 font-semibold">
                        <tr>
                            <th className="px-2 sm:px-6 py-2 sm:py-4 text-center">Reporter</th>
                            <th className="px-2 sm:px-6 py-2 sm:py-4 text-center hidden sm:table-cell">Reportee</th>
                            <th className="px-2 sm:px-6 py-2 sm:py-4 text-center hidden md:table-cell">Type</th>
                            <th className="px-2 sm:px-6 py-2 sm:py-4 text-center hidden md:table-cell">Status</th>
                            <th className="px-2 sm:px-6 py-2 sm:py-4 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reports.map((report) => (
                            <tr key={report._id} className="border-t border-gray-200 hover:bg-gray-50">
                                <td className="px-2 sm:px-6 py-2 sm:py-4 text-center">{report.reporterName}</td>
                                <td className="px-2 sm:px-6 py-2 sm:py-4 text-center hidden sm:table-cell">{report.reporteeName}</td>
                                <td className="px-2 sm:px-6 py-2 sm:py-4 text-center hidden md:table-cell">{report.reportType}</td>
                                <td className="px-2 sm:px-6 py-2 sm:py-4 text-center hidden md:table-cell">{report.status}</td>
                                <td className="px-2 sm:px-6 py-2 sm:py-4 text-center flex justify-center gap-2 sm:gap-3 text-purple-600">
                                    <button
                                        onClick={() => {
                                            setSelectedReport(report);
                                            setModalOpen(true);
                                        }}
                                        className="w-7 h-7 sm:w-[35px] sm:h-[35px] flex items-center justify-center rounded-full cursor-pointer hover:scale-110 transition-all"
                                        aria-label="View report details"
                                    >
                                        <DescriptionIcon fontSize="small" style={{ color: "black" }} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <Pagination totalPages={totalPages} />

            {/* Modal */}
            {selectedReport && (
                <ReportPendingModal
                    isOpen={modalOpen}
                    onClose={() => setModalOpen(false)}
                    onSave={handleSave}
                    report={selectedReport}
                />
            )}
        </div>
    );
}
