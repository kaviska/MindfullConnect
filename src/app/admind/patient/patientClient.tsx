"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { deletePatient } from "@/app/lib/actions";

import DescriptionIcon from '@mui/icons-material/Description';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import Search from "../../ui/search/search";
import Pagination from "../../ui/pagination/pagination";

interface PatientClientProps {
    users: any[];
    totalPages: number;
}

const PatientClient: React.FC<PatientClientProps> = ({ users, totalPages }) => {
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleViewDetails = (userId: string) => {
        router.push(`/admind/patient/${userId}`);
    };

    const handleBlockUser = () => {
        setIsModalOpen(true);
    };

    return (
        <div className="p-6 min-h-screen">
            <div>
                <Search placeholder="Search patients..." />
            </div>
            <table className="w-full [&_td]:py-3 text-center border-separate border-spacing-y-3">
                <thead className="text-gray-700 font-semibold">
                    <tr>
                        <td>User ID</td>
                        <td>Name</td>
                        <td>Registered Date</td>
                        <td>Total Sessions</td>
                        <td>Email</td>
                        <td>Status</td>
                        <td>Action</td>
                    </tr>
                </thead>
                <tbody className="text-center border-separate border-spacing-y-3 bg-[#EEF1F2]">
                    {users.map((users) => (
                        <tr key={users._id}>
                            <td>{users._id}</td>
                            <td>
                                <div className="flex items-center justify-center gap-3">
                                    <img src={users.img || "/nonavatar.png"} alt="session" className="w-9 h-9 rounded-full object-cover" />
                                    {users.firstname}
                                </div>
                            </td>
                            <td>{new Date(users.createdat).toLocaleDateString()}</td>
                            <td>{0 /* Replace 0 with patient.sessions.length if you have */}</td>
                            <td>{users.email}</td>
                            <td>
                                <div className="flex justify-center">
                                    <div className="w-20 h-7 rounded-full flex items-center justify-center bg-green-200">
                                        {users.isActive ? "Active" : "Inactive"}
                                    </div>
                                </div>
                            </td>
                            <td>
                                <div className="flex items-center justify-center gap-x-5">
                                    <button
                                        onClick={() => handleViewDetails(users._id)}
                                        className="w-[35px] h-[35px] flex items-center justify-center rounded-full cursor-pointer hover:scale-110 transition-all"
                                    >
                                        <DescriptionIcon fontSize="medium" />
                                    </button>
                                    <form action={deletePatient}>
                                        <input type="hidden" name="id" value={users._id} />
                                        <button
                                            onClick={handleBlockUser}
                                            className="w-[30px] h-[30px] flex items-center justify-center rounded-full cursor-pointer hover:scale-110 transition-all"
                                        >
                                            <RemoveCircleOutlineIcon fontSize="medium" className="text-red-500" />
                                        </button>
                                    </form>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="mt-6">
                <Pagination totalPages={totalPages} />
            </div>
        </div>
    );
};

export default PatientClient;