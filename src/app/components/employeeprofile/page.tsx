"use client";

import { useState } from 'react';

export default function EmployeeProfile() {
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [applicationStatus] = useState('Pending'); // Made read-only as per default "Pending"

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setProfilePic(URL.createObjectURL(file));
    }
  };

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsEditing(false);
    // Add API call or logic to save data here
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-7xl">
        <form onSubmit={handleSave}>
          {/* Profile Picture and Application Status */}
          <div className="flex flex-col items-center mb-6 relative">
            <div className="relative">
              <div className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                {profilePic ? (
                  <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-gray-500">Upload Photo</span>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={handleProfilePicChange}
                disabled={!isEditing}
              />
            </div>
            <div className="absolute top-0 right-0 mt-2 mr-2">
              <span
                className={`text-sm font-medium px-2 py-1 rounded-full ${
                  applicationStatus === 'Pending'
                    ? 'bg-yellow-200 text-yellow-800'
                    : applicationStatus === 'Approved'
                    ? 'bg-green-200 text-green-800'
                    : 'bg-red-200 text-red-800'
                }`}
              >
                {applicationStatus}
              </span>
            </div>
          </div>

          {/* Personal Details */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-center mb-4 text-blue-800">Personal Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">First Name</label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                    placeholder="Enter first name"
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                    placeholder="Enter email"
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Address</label>
                  <textarea
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                    placeholder="Enter address"
                    rows={3}
                    disabled={!isEditing}
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Last Name</label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                    placeholder="Enter last name"
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Postal Code</label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                    placeholder="Enter postal code"
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">City</label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                    placeholder="Enter city"
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Province</label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                    placeholder="Enter province"
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Role</label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                    placeholder="Enter role"
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Save and Edit Buttons */}
          <div className="flex justify-center mt-6 space-x-4">
            {isEditing ? (
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Save
              </button>
            ) : (
              <button
                type="button"
                className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                onClick={handleEdit}
              >
                Edit
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}