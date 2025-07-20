"use client";

import React, { useEffect, useState } from "react";
import Pagination from "../../ui/pagination/pagination";
import { useSearchParams, useRouter } from "next/navigation";
import DescriptionIcon from '@mui/icons-material/Description';
import ProfilePopup from "../../ui/employee/profilepopup/profilepopup";

interface Admin {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  isSuperAdmin: boolean;
}

const fetchAdmins = async (
  page: number,
  query: string
): Promise<{ users: Admin[]; totalPages: number }> => {
  const res = await fetch(`/admind/api/employee?page=${page}&q=${query}`);
  if (!res.ok) throw new Error("Failed to fetch admins");
  const data = await res.json();
  return {
    users: data.users,
    totalPages: data.totalPages,
  };
};

const fetchAdminById = async (id: string): Promise<Admin> => {
  const res = await fetch(`/admind/api/employee/${id}`);
  if (!res.ok) throw new Error("Failed to fetch admin");
  const data = await res.json();
  return data.user;
};

export default function AdminListPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const page = Number(searchParams.get("page")) || 1;
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);

  useEffect(() => {
    fetchAdmins(page, query).then(({ users, totalPages }) => {
      setAdmins(users);
      setTotalPages(totalPages);
    });
  }, [page, query]);

  const handleViewDetails = async (id: string) => {
    try {
      const user = await fetchAdminById(id);
      if (!user.isSuperAdmin) {
        setSelectedAdmin(user);
      }
    } catch {}
  };

  const handleSearch = () => {
    const search = new URLSearchParams();
    if (query) search.set("q", query);
    router.push(`?${search.toString()}`);
  };
  return (
    <div className="p-6 bg-[#E9F0F6] min-h-screen">
      <div className="mb-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl font-bold text-[#1045A1]">Employees</h1>
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name/email"
            className="border p-2 rounded"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Search
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-[#F5F7FA] text-gray-600 font-semibold">
            <tr>
              <th className="px-6 py-4 text-center hidden lg:table-cell">User Id</th>
              <th className="px-6 py-4 text-center">Name</th>
              <th className="px-6 py-4 text-center hidden md:table-cell">Email</th>
              <th className="px-6 py-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin, i) => (
              <tr key={i} className="border-t border-gray-200 hover:bg-gray-50">
                <td className="px-6 py-4 text-center hidden lg:table-cell">{admin._id}</td>
                <td className="px-6 py-4 text-center">
                  {admin.firstName} {admin.lastName}
                </td>
                <td className="px-6 py-4 text-center hidden md:table-cell">{admin.email}</td>
                <td className="px-6 py-4 text-center flex justify-center gap-3 text-purple-600">
                  <button
                    onClick={() => handleViewDetails(admin._id)}
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

      {selectedAdmin && (
        <ProfilePopup
          employee={selectedAdmin}
          onClose={() => setSelectedAdmin(null)}
        />
      )}
    </div>
  );
}
