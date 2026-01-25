"use client";

import React, { useEffect, useState } from "react";
import StatsCard from "../../../ui/reported/stats/stat";
import Pagination from "../../../ui/pagination/pagination";
import DescriptionIcon from '@mui/icons-material/Description';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface Report {
    _id: string;
    reporterName: string;
    reporteeName: string;
    reportType: string;
    status: "Pending" | "Resolved";
    description: string;
    actionNote?: string;
    createdAt?: string;
    updatedAt?: string;
}

const fetchReports = async (
    page: number
): Promise<{ reports: Report[]; totalPages: number }> => {
    const res = await fetch(`/admind/api/reports/resolved?page=${page}`);
    if (!res.ok) throw new Error("Failed to fetch reports");

    const data = await res.json();
    return {
        reports: data.reports,
        totalPages: data.totalPages,
    };
};

export default function Resolved() {
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

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="p-4 sm:p-6 bg-[#E9F0F6] min-h-screen flex flex-col space-y-6 sm:space-y-8">
            {/* Stats card - responsive container */}
            <div className="w-full max-w-7xl mx-auto">
                <StatsCard />
            </div>

            {/* Heading */}
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                <h1 className="text-2xl sm:text-3xl font-bold text-green-600">Resolved Reports</h1>
                <span className="text-lg sm:text-xl text-green-600">({reports.length})</span>
            </div>

            {/* Reports Table */}
            <div className="bg-white rounded-xl overflow-x-auto shadow max-w-7xl mx-auto w-full">
                <table className="min-w-full text-left text-xs sm:text-sm">
                    <thead className="bg-[#F5F7FA] text-gray-600 font-semibold">
                        <tr>
                            <th className="px-2 sm:px-6 py-2 sm:py-4 text-center">Reporter</th>
                            <th className="px-2 sm:px-6 py-2 sm:py-4 text-center hidden sm:table-cell">Reportee</th>
                            <th className="px-2 sm:px-6 py-2 sm:py-4 text-center hidden md:table-cell">Type</th>
                            <th className="px-2 sm:px-6 py-2 sm:py-4 text-center hidden lg:table-cell">Resolved Date</th>
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
                                <td className="px-2 sm:px-6 py-2 sm:py-4 text-center hidden lg:table-cell">{formatDate(report.updatedAt)}</td>
                                <td className="px-2 sm:px-6 py-2 sm:py-4 text-center hidden md:table-cell">
                                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                        <CheckCircleIcon fontSize="small" />
                                        {report.status}
                                    </span>
                                </td>
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

            {/* Modal for viewing resolved report details */}
            {selectedReport && modalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold text-gray-800">Resolved Report Details</h2>
                            <button
                                onClick={() => setModalOpen(false)}
                                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                            >
                                ×
                            </button>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-600">Reporter</p>
                                    <p className="font-semibold">{selectedReport.reporterName}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Reportee</p>
                                    <p className="font-semibold">{selectedReport.reporteeName}</p>
                                </div>
                            </div>

                            <div>
                                <p className="text-sm text-gray-600">Report Type</p>
                                <p className="font-semibold">{selectedReport.reportType}</p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-600">Description</p>
                                <p className="bg-gray-50 p-3 rounded-lg">{selectedReport.description}</p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-600">Action Note</p>
                                <p className="bg-green-50 p-3 rounded-lg">{selectedReport.actionNote || 'No action note provided'}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-600">Reported Date</p>
                                    <p className="font-semibold">{formatDate(selectedReport.createdAt)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Resolved Date</p>
                                    <p className="font-semibold">{formatDate(selectedReport.updatedAt)}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 pt-4">
                                <CheckCircleIcon className="text-green-600" />
                                <span className="text-green-600 font-semibold">This report has been resolved</span>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={() => setModalOpen(false)}
                                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
