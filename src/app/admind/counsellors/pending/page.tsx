"use client";

import React, { useEffect, useState } from "react";
import Pagination from "../../../ui/pagination/pagination";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import SearchIcon from "@mui/icons-material/Search";
import DescriptionIcon from "@mui/icons-material/Description";
import ProfilePopup from "../../../ui/counsellors/profilepopup/profilepopup";
import CounsellorAcceptedModal from "../../../ui/counsellors/acceptedmodal/acceptedmodal";
import RejectCounsellorModal from "../../../ui/counsellors/rejectcounsellormodal/rejectcounsellormodal";

interface Counsellor {
    _id: string;
    firstname: string;
    lastname: string;
    name: string;
    email: string;
    isActive: boolean;
    status: string;
    imageUrl: string;
    specialty?: string;
    bio?: string;
    rating?: number;
    reviews?: number;
    consultationFee?: number;
    yearsOfExperience?: number;
}

const fetchCounsellors = async (
    page: number,
    query: string
): Promise<{ users: Counsellor[]; totalPages: number }> => {
    const res = await fetch(`/admind/api/counsellors/pending?page=${page}&q=${query}`);
    if (!res.ok) throw new Error("Failed to fetch counsellors");

    const data = await res.json();
    return { users: data.users, totalPages: data.totalPages };
};

const fetchCounsellorById = async (id: string): Promise<Counsellor> => {
    const res = await fetch(`/admind/api/counsellors/pending/${id}`);
    if (!res.ok) throw new Error("Failed to fetch counsellor");
    const data = await res.json();
    return data.user;
};

export default function CounsellorPendingPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const page = Number(searchParams.get("page")) || 1;
    const query = searchParams.get("q") || "";

    const [counsellors, setCounsellors] = useState<Counsellor[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedCounsellor, setSelectedCounsellor] = useState<Counsellor | null>(null);
    const [showAcceptModal, setShowAcceptModal] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);

    const handleSearch = useDebouncedCallback((term: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (term) {
            params.set("q", term);
        } else {
            params.delete("q");
        }
        params.set("page", "1");
        router.push(`${pathname}?${params.toString()}`);
    }, 300);

    const reloadPage = () => {
        router.refresh();
        setSelectedCounsellor(null);
    };

    useEffect(() => {
        fetchCounsellors(page, query).then(({ users, totalPages }) => {
            setCounsellors(users);
            setTotalPages(totalPages);
        });
    }, [page, query]);

    const handleViewDetails = async (id: string) => {
        try {
            const counsellor = await fetchCounsellorById(id);
            setSelectedCounsellor(counsellor);
        } catch (err) {
            console.error("Failed to fetch counsellor", err);
        }
    };

    const handleAccept = async () => {
        if (!selectedCounsellor) return;
        try {
            await fetch(`/admind/api/counsellors/pending/${selectedCounsellor._id}`, {
                method: "PUT",
                body: JSON.stringify({ status: "active" }),
                headers: { "Content-Type": "application/json" },
            });
            setShowAcceptModal(true);
        } catch (err) {
            console.error("Error accepting counsellor", err);
        }
    };

    const handleReject = () => setShowRejectModal(true);

    const confirmReject = async () => {
        if (!selectedCounsellor) return;
        try {
            await fetch(`/admind/api/counsellors/pending/${selectedCounsellor._id}`, {
                method: "DELETE",
            });
            reloadPage();
        } catch (err) {
            console.error("Error rejecting counsellor", err);
        }
    };

    return (
        <div className="p-6 bg-[#E9F0F6] min-h-screen">
            <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl font-bold text-[#1045A1]">Pending Counsellors</h1>
                <div className="relative w-full sm:w-64">
                    <input
                        type="text"
                        placeholder="Search counsellors..."
                        defaultValue={query}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="w-full px-4 py-2 pl-10 rounded-md border border-gray-300 bg-[#F5F7FA] text-sm"
                    />
                    <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 !w-5 !h-5" />
                </div>
            </div>

            <div className="bg-white rounded-xl overflow-x-auto">
                <table className="min-w-full text-sm text-left">
                    <thead className="bg-[#F5F7FA] text-gray-600 font-semibold">
                        <tr>
                            <th className="px-6 py-4 text-center hidden md:table-cell">Counsellor ID</th>
                            <th className="px-6 py-4 text-center">Name</th>
                            <th className="px-6 py-4 text-center hidden md:table-cell">Email</th>
                            <th className="px-6 py-4 text-center">Status</th>
                            <th className="px-6 py-4 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {counsellors.map((user, i) => (
                            <tr key={i} className="border-t border-gray-200 hover:bg-gray-50">
                                <td className="px-6 py-4 text-center hidden md:table-cell">{user._id}</td>
                                <td className="px-6 py-4 text-center flex items-center justify-center gap-2">
                                    <img src={user.imageUrl} alt="" className="w-7 h-7 rounded-full" />
                                    {`${user.firstname || ''} ${user.lastname || ''}`.trim()}
                                </td>
                                <td className="px-6 py-4 text-center hidden md:table-cell">{user.email}</td>
                                <td className="px-6 py-4 text-center">
                                    {user.isActive ? "Registered" : "Pending"}
                                </td>
                                <td className="px-6 py-4 text-center flex justify-center gap-3 text-purple-600">
                                    <button
                                        onClick={() => handleViewDetails(user._id)}
                                        className="w-[35px] h-[35px] flex items-center justify-center rounded-full cursor-pointer hover:scale-110 transition-all"
                                    >
                                        <DescriptionIcon fontSize="medium" style={{ color: "black" }} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Pagination totalPages={totalPages} />

            {selectedCounsellor && (
                <ProfilePopup
                    counsellor={selectedCounsellor}
                    onClose={() => setSelectedCounsellor(null)}
                    onAccept={handleAccept}
                    onReject={handleReject}
                />
            )}

            <CounsellorAcceptedModal
                isOpen={showAcceptModal}
                onOk={() => {
                    setShowAcceptModal(false);
                    reloadPage(); // refetches data + resets modal
                }}
            />


            <RejectCounsellorModal
                isOpen={showRejectModal}
                onCancel={() => setShowRejectModal(false)}
                onReject={confirmReject}
            />
        </div>
    );
}
