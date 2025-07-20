"use client";

import React, { useEffect, useState } from "react";
import Pagination from "../../../ui/pagination/pagination";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import SearchIcon from "@mui/icons-material/Search";
import DescriptionIcon from "@mui/icons-material/Description";
import DeleteIcon from "@mui/icons-material/Delete";
import ProfilePopup from "../../../ui/counsellors/activepopup/activepopup";

interface Counsellor {
    _id: string;
    name: string;
    firstname: string;
    lastname: string;
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
    highestQualification?: string;
    university?: string;
    licenseNumber?: string;
    availabilityType?: string;
    sessionDuration?: number;
    description?: string;
}

const fetchCounsellors = async (
    page: number,
    query: string
): Promise<{ users: Counsellor[]; totalPages: number }> => {
    const res = await fetch(`/admind/api/counsellors/active?page=${page}&q=${query}`);
    if (!res.ok) throw new Error("Failed to fetch counsellors");

    const data = await res.json();
    return { users: data.users, totalPages: data.totalPages };
};

const fetchCounsellorById = async (id: string): Promise<Counsellor> => {
    const res = await fetch(`/admind/api/counsellors/active/${id}`);
    if (!res.ok) throw new Error("Failed to fetch counsellor");
    const data = await res.json();
    return data.user;
};

export default function CounsellorActivePage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const page = Number(searchParams.get("page")) || 1;
    const query = searchParams.get("q") || "";

    const [counsellors, setCounsellors] = useState<Counsellor[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedCounsellor, setSelectedCounsellor] = useState<Counsellor | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

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

    const handleEditCounsellor = (updatedCounsellor: Counsellor) => {
        setCounsellors(prev => 
            prev.map(counsellor => 
                counsellor._id === updatedCounsellor._id ? updatedCounsellor : counsellor
            )
        );
        setSelectedCounsellor(updatedCounsellor);
    };

    const handleDeleteCounsellor = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this counsellor? This action cannot be undone.")) {
            setDeletingId(id);
            try {
                const response = await fetch(`/admind/api/counsellors/active/${id}`, {
                    method: "DELETE",
                });
                
                if (response.ok) {
                    setCounsellors(prev => prev.filter(counsellor => counsellor._id !== id));
                    if (selectedCounsellor?._id === id) {
                        setSelectedCounsellor(null);
                    }
                } else {
                    alert("Failed to delete counsellor");
                }
            } catch (error) {
                console.error("Error deleting counsellor:", error);
                alert("Failed to delete counsellor");
            } finally {
                setDeletingId(null);
            }
        }
    };

    return (
        <div className="p-6 bg-[#E9F0F6] min-h-screen">
            <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl font-bold text-[#1045A1]">Registered Counsellors</h1>
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
                            <th className="px-6 py-4 text-center">Actions</th>
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
                                <td className="px-6 py-4 text-center text-green-600 font-semibold">Registered</td>
                                <td className="px-6 py-4 text-center flex justify-center gap-3 text-purple-600">
                                    <button
                                        onClick={() => handleViewDetails(user._id)}
                                        className="w-[35px] h-[35px] flex items-center justify-center rounded-full cursor-pointer hover:scale-110 transition-all"
                                        title="View Details"
                                    >
                                        <DescriptionIcon fontSize="medium" style={{ color: "black" }} />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteCounsellor(user._id)}
                                        disabled={deletingId === user._id}
                                        className="w-[35px] h-[35px] flex items-center justify-center rounded-full cursor-pointer hover:scale-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                        title="Delete Counsellor"
                                    >
                                        <DeleteIcon 
                                            fontSize="medium" 
                                            style={{ 
                                                color: deletingId === user._id ? "#gray" : "#ef4444" 
                                            }} 
                                        />
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
                    onEdit={handleEditCounsellor}
                    onBlock={async () => {
                        await fetch(`/admind/api/counsellors/active/${selectedCounsellor._id}`, {
                            method: "DELETE",
                        });
                        setSelectedCounsellor(null);
                        router.refresh();
                    }}
                />
            )}
        </div>
    );
}
