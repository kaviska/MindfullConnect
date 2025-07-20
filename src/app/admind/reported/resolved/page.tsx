"use client";

import React, { useEffect, useState } from "react";
import StatsCard from "../../../ui/reported/stats/stat";
import Pagination from "../../../ui/pagination/pagination";
import ReportResolvedModal from "../../../ui/reported/reportResolvedModel/reportResolvedModel";
import DescriptionIcon from '@mui/icons-material/Description';

interface Report {
    _id: string;
    reporterName: string;
    reporteeName: string;
    reportType: string;
    status: "Resolved" | "Pending";
    description?: string;
    createdAt?: string;
    actionNote?: string;
}

const Resolved = () => {
    const [reports, setReports] = useState<Report[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedReport, setSelectedReport] = useState<Report | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetch(`/admind/api/reports/resolved?page=${currentPage}`)
            .then((res) => res.json())
            .then((data) => {
                setReports(data.reports);
                setTotalPages(data.totalPages);
            });
    }, [currentPage]);

    return (
        <div className="p-4 sm:p-6 bg-[#E9F0F6] min-h-screen flex flex-col space-y-6 sm:space-y-8">
            {/* Stats card - responsive container */}
            <div className="w-full max-w-7xl mx-auto">
                <StatsCard />
            </div>

            {/* Heading */}
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                <h1 className="text-2xl sm:text-3xl font-bold text-[#1045A1]">Resolved Reports</h1>
                <span className="text-lg sm:text-xl text-[#1045A1]">({reports.length})</span>
            </div>

            {/* Reports Table */}
            <div className="bg-white rounded-xl overflow-x-auto shadow max-w-7xl mx-auto w-full">
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
            <ReportResolvedModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                report={selectedReport}
            />
        </div>
    );
};

export default Resolved;
