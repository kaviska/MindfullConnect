"use client";

import React from "react";
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

interface PaginationProps {
    totalPages: number;
}

const Pagination: React.FC<PaginationProps> = ({ totalPages }) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const currentPage = Number(searchParams.get("page")) || 1;

    const goToPage = (page: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", page.toString());
        router.push(`${pathname}?${params.toString()}`);
    };

    const renderPages = () => {
        const pages: (number | string)[] = [];

        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                pages.push(1, 2, 3, "...", totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
            } else {
                pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
            }
        }

        return pages.map((page, idx) => {
            if (page === "...") {
                return <span key={idx} className="px-2">...</span>;//renders plain text
            }

            return (
                <button
                    key={idx}
                    className={`w-8 h-8 flex items-center justify-center rounded-md transition ${page === currentPage
                        ? "bg-[#2F64D3] text-white font-semibold"
                        : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                        }`}
                    onClick={() => goToPage(Number(page))}
                >
                    {page}
                </button>
            );
        });
    };

    return (
        <div className=" flex items-center justify-between py-4 text-sm">
            <p className="text-gray-600">
                Showing page {currentPage} of {totalPages}
            </p>

            <div className="flex items-center space-x-2 text-gray-600">
                <span
                    className={`cursor-pointer ${currentPage === 1 ? "text-gray-400 cursor-not-allowed" : ""}`}
                    onClick={() => currentPage > 1 && goToPage(currentPage - 1)}
                >
                    Previous
                </span>

                {renderPages()}

                <span
                    className={`cursor-pointer ${currentPage === totalPages ? "text-gray-400 cursor-not-allowed" : ""}`}
                    onClick={() => currentPage < totalPages && goToPage(currentPage + 1)}
                >
                    Next
                </span>
            </div>
        </div>
    );
};

export default Pagination;