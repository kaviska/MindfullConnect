"use client";

import React, { useEffect, useState } from "react";
import Pagination from "../../ui/pagination/pagination";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import DescriptionIcon from "@mui/icons-material/Description";
import DeleteIcon from "@mui/icons-material/Delete";
import PatientProfilePopup from "../../ui/patient/profilepopup/profilepopup";
import { useDebouncedCallback } from "use-debounce";
import SearchIcon from "@mui/icons-material/Search";

interface Patient {
  _id: string;
  fullName: string;
  email: string;
  role: string;
  lastSeen?: Date;
  isVerified: boolean;
  otp?: string;
  otpExpiry?: Date;
  image?: string;
}

interface Permissions {
  [key: string]: {
    create?: boolean;
    read?: boolean;
    update?: boolean;
    delete?: boolean;
  };
}

const fetchPatients = async (
  page: number,
  query: string
): Promise<{ users: Patient[]; totalPages: number }> => {
  const res = await fetch(`/admind/api/patient?page=${page}&q=${query}`);
  if (!res.ok) throw new Error("Failed to fetch patients");
  const data = await res.json();
  return {
    users: data.users,
    totalPages: data.totalPages,
  };
};

const fetchPatientById = async (id: string): Promise<Patient> => {
  const res = await fetch(`/admind/api/patient/${id}`);
  if (!res.ok) throw new Error("Failed to fetch patient");
  const data = await res.json();
  return data.user;
};

const fetchPermissions = async (userId: string): Promise<Permissions> => {
  const res = await fetch(`/admind/api/permissions/${userId}`);
  if (!res.ok) throw new Error("Failed to fetch permissions");
  const data = await res.json();
  return data.permissions || {};
};

export default function PatientPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const page = Number(searchParams.get("page")) || 1;
  const query = searchParams.get("q") || "";

  const [patients, setPatients] = useState<Patient[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [permissions, setPermissions] = useState<Permissions>({});

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
    fetchPatients(page, query).then(({ users, totalPages }) => {
      setPatients(users);
      setTotalPages(totalPages);
    });

    const userId = localStorage.getItem("userId");
    if (userId) {
      fetch(`/admind/api/employee/${userId}`)
        .then(res => res.json())
        .then(data => {
          if (data.user?.isSuperAdmin) {
            setPermissions({
              patient: { create: true, read: true, update: true, delete: true },
              counselor: { create: true, read: true, update: true, delete: true },
              dashboard: { read: true },
              report: { read: true },
              employee: { create: true, read: true, update: true, delete: true }
            });
          } else {
            fetchPermissions(userId)
              .then(setPermissions)
              .catch(err => console.error("Permission fetch error", err));
          }
        });
    }
  }, [page, query]);

  const handleViewDetails = async (id: string) => {
    try {
      const user = await fetchPatientById(id);
      setSelectedPatient(user);
    } catch (err) {
      console.error("Failed to fetch patient", err);
    }
  };

  const handleDeletePatient = async (id: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this patient? This action cannot be undone."
      )
    ) {
      setDeletingId(id);
      try {
        const response = await fetch(`/admind/api/patient/${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          setPatients((prev) => prev.filter((patient) => patient._id !== id));
          if (selectedPatient?._id === id) {
            setSelectedPatient(null);
          }
        } else {
          alert("Failed to delete patient");
        }
      } catch (error) {
        console.error("Error deleting patient:", error);
        alert("Failed to delete patient");
      } finally {
        setDeletingId(null);
      }
    }
  };

  return (
    <div className="p-6 bg-[#E9F0F6] min-h-screen">
      <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-[#1045A1]">Patients</h1>
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search patients..."
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
              <th className="px-6 py-4 text-center hidden lg:table-cell">User Id</th>
              <th className="px-6 py-4 text-center">Name</th>
              <th className="px-6 py-4 text-center hidden md:table-cell">Email</th>
              <th className="px-6 py-4 text-center hidden md:table-cell">Role</th>
              <th className="px-6 py-4 text-center hidden md:table-cell">Verified</th>
              <th className="px-6 py-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((user, i) => (
              <tr key={i} className="border-t border-gray-200 hover:bg-gray-50">
                <td className="px-6 py-4 text-center hidden lg:table-cell">{user._id}</td>
                <td className="px-6 py-4 text-center flex items-center justify-center gap-2">
                  {user.image && user.image.trim() !== "" ? (
                    <img src={user.image} alt="" className="w-7 h-7 rounded-full" />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-gray-300 flex items-center justify-center text-gray-500">
                      {user.fullName.charAt(0)}
                    </div>
                  )}
                  {user.fullName}
                </td>
                <td className="px-6 py-4 text-center hidden md:table-cell">{user.email}</td>
                <td className="px-6 py-4 text-center hidden md:table-cell">{user.role}</td>
                <td className="px-6 py-4 text-center hidden md:table-cell">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.isVerified
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {user.isVerified ? "Verified" : "Not Verified"}
                  </span>
                </td>
                <td className="px-6 py-4 text-center flex justify-center gap-3 text-purple-600">
                  {permissions?.patient?.read !== false && (
                    <button
                      onClick={() => handleViewDetails(user._id)}
                      className="w-[35px] h-[35px] flex items-center justify-center rounded-full cursor-pointer hover:scale-110 transition-all"
                      title="View Details"
                    >
                      <DescriptionIcon fontSize="medium" style={{ color: "black" }} />
                    </button>
                  )}
                  {permissions?.patient?.delete && (
                    <button
                      onClick={() => handleDeletePatient(user._id)}
                      disabled={deletingId === user._id}
                      className="w-[35px] h-[35px] flex items-center justify-center rounded-full cursor-pointer hover:scale-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Delete Patient"
                    >
                      <DeleteIcon
                        fontSize="medium"
                        style={{
                          color: deletingId === user._id ? "#ccc" : "#ef4444",
                        }}
                      />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination totalPages={totalPages} />

      {selectedPatient && (
        <PatientProfilePopup
          patient={{
            ...selectedPatient,
            imageUrl:
              selectedPatient.image && selectedPatient.image.trim() !== ""
                ? selectedPatient.image
                : null,
            lastSeen: selectedPatient.lastSeen
              ? new Date(selectedPatient.lastSeen).toLocaleString()
              : undefined,
            otpExpiry: selectedPatient.otpExpiry
              ? new Date(selectedPatient.otpExpiry).toLocaleString()
              : undefined,
          }}
          onClose={() => setSelectedPatient(null)}
        />
      )}
    </div>
  );
}
