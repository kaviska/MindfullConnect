"use client";

import React, { useEffect, useState } from "react";
import Pagination from "../../ui/pagination/pagination";
import { useSearchParams } from "next/navigation";
import { Edit } from "lucide-react";
import DescriptionIcon from '@mui/icons-material/Description';
import ProfilePopup from "../../ui/employee/profilepopup/profilepopup";

interface User {
    _id: string;
    firstname: string;
    lastname: string;
    date: string;
    postalCode: number;
    email: string;
    status: "Active" | "Inactive";
    imageUrl: string;
    nic: string;
    address: string;
    contact: string;
}

const fetchUsers = async (
    page: number,
    query: string
): Promise<{ users: User[]; totalPages: number }> => {
    const res = await fetch(`/api/employees?page=${page}&q=${query}`);
    if (!res.ok) throw new Error("Failed to fetch users");

    const data = await res.json();
    return {
        users: data.users,
        totalPages: data.totalPages,
    };
};

const fetchUserById = async (id: string): Promise<User> => {
    const res = await fetch(`/api/employees/${id}`);
    if (!res.ok) throw new Error("Failed to fetch user");
    const data = await res.json();
    return data.user;
};

export default function UserPage() {
    const searchParams = useSearchParams();
    const page = Number(searchParams.get("page")) || 1;
    const query = searchParams.get("q") || "";

    const [users, setUsers] = useState<User[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        fetchUsers(page, query).then(({ users, totalPages }) => {
            setUsers(users);
            setTotalPages(totalPages);
        });
    }, [page, query]);

    const handleViewDetails = async (id: string) => {
        try {
            const user = await fetchUserById(id);
            setSelectedUser(user);
        } catch (err) {
            console.error("Failed to fetch user", err);
        }
    };

    return (
        <div className="p-6 bg-[#E9F0F6] min-h-screen">
            <div className="mb-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-[#1045A1]">Employees</h1>
            </div>

            <div className="bg-white rounded-xl overflow-x-auto">
                <table className="min-w-full text-sm text-left">
                    <thead className="bg-[#F5F7FA] text-gray-600 font-semibold">
                        <tr>
                            <th className="px-6 py-4 text-center hidden lg:table-cell">User Id</th>
                            <th className="px-6 py-4 text-center">Name</th>
                            <th className="px-6 py-4 text-center hidden lg:table-cell">Registered Date</th>
                            <th className="px-6 py-4 text-center hidden md:table-cell">Email</th>
                            <th className="px-6 py-4 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, i) => (
                            <tr key={i} className="border-t border-gray-200 hover:bg-gray-50">
                                <td className="px-6 py-4 text-center hidden lg:table-cell">{user._id}</td>

                                <td className="px-6 py-4 text-center flex items-center justify-center gap-2">
                                    <img src={user.imageUrl} alt="" className="w-7 h-7 rounded-full" />
                                    {user.firstname}
                                </td>

                                <td className="px-6 py-4 text-center hidden lg:table-cell">{user.date}</td>

                                <td className="px-6 py-4 text-center hidden md:table-cell">{user.email}</td>

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

            <div className="mt-10 w-full">
                <div className="w-full flex justify-center sm:justify-end">
                    <Pagination totalPages={totalPages} />
                </div>
            </div>

            {selectedUser && (
                <ProfilePopup
                    employee={selectedUser}
                    onClose={() => setSelectedUser(null)}
                />
            )}
        </div>
    );
}
