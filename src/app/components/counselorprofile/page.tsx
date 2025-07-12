"use client";

import { useState } from 'react';

export default function CounselorProfile() {
  const [profilePic, setProfilePic] = useState(null);
  const [isEditing, setIsEditing] = useState(true);
  const [verifiedStatus, setVerifiedStatus] = useState('On Approval');
  const [documents, setDocuments] = useState({
    nicPassport: null,
    licenseCertificate: null,
    relatedQualifications: [],
  });

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(URL.createObjectURL(file));
    }
  };

  const handleDocumentChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      setDocuments((prev) => ({
        ...prev,
        [type]: file,
      }));
    }
  };

  const handleSave = (e) => {
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
        <form>
          {/* Profile Picture and Verified Indicator */}
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
                  verifiedStatus === 'On Approval'
                    ? 'bg-yellow-200 text-yellow-800'
                    : verifiedStatus === 'Verified'
                    ? 'bg-green-200 text-green-800'
                    : 'bg-red-200 text-red-800'
                }`}
              >
                {verifiedStatus}
              </span>
            </div>
          </div>

          {/* Personal Details */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-center mb-4 text-blue-800">Personal Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                    placeholder="Enter full name"
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                  <input
                    type="date"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
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
                  <label className="block text-sm font-medium text-gray-700">Gender</label>
                  <select
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                    disabled={!isEditing}
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Contact Number</label>
                  <input
                    type="tel"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                    placeholder="Enter contact number"
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nationality</label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                    placeholder="Enter nationality"
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">NIC Number/Passport Number</label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                    placeholder="Enter NIC or Passport number"
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Professional Details */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-center mb-4 text-blue-800">Professional Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Highest Rated Qualification</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                  placeholder="Enter highest qualification"
                  disabled={!isEditing}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Languages Fluent In</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                  placeholder="Enter languages (comma-separated)"
                  disabled={!isEditing}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Years of Experience</label>
                <input
                  type="number"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                  placeholder="Enter years of experience"
                  disabled={!isEditing}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">License Number</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                  placeholder="Enter license number"
                  disabled={!isEditing}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">All Related Qualifications</label>
                <textarea
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                  placeholder="Enter all related qualifications"
                  rows="4"
                  disabled={!isEditing}
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Specialized Area</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                  placeholder="Enter specialized area"
                  disabled={!isEditing}
                />
              </div>
            </div>
          </div>

          {/* Proof of Documents */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-center mb-4 text-blue-800">Proof of Documents</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">NIC/Passport Scanned Copy</label>
                <input
                  type="file"
                  accept=".pdf"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                  onChange={(e) => handleDocumentChange(e, 'nicPassport')}
                  disabled={!isEditing}
                />
                {documents.nicPassport && (
                  <div className="mt-2 flex items-center">
                    <span className="text-blue-600">{documents.nicPassport.name}</span>
                    <span className="ml-2 text-gray-500">👁️</span>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Counselor License Certificate</label>
                <input
                  type="file"
                  accept=".pdf"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                  onChange={(e) => handleDocumentChange(e, 'licenseCertificate')}
                  disabled={!isEditing}
                />
                {documents.licenseCertificate && (
                  <div className="mt-2 flex items-center">
                    <span className="text-blue-600">{documents.licenseCertificate.name}</span>
                    <span className="ml-2 text-gray-500">👁️</span>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Related Qualifications</label>
                <input
                  type="file"
                  accept=".pdf"
                  multiple
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                  onChange={(e) => {
                    const files = Array.from(e.target.files);
                    setDocuments((prev) => ({
                      ...prev,
                      relatedQualifications: files,
                    }));
                  }}
                  disabled={!isEditing}
                />
                {documents.relatedQualifications.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {documents.relatedQualifications.map((file, index) => (
                      <div key={index} className="flex items-center">
                        <span className="text-blue-600">{file.name}</span>
                        <span className="ml-2 text-gray-500">👁️</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Save and Edit Buttons */}
          <div className="flex justify-center mt-6 space-x-4">
            {isEditing ? (
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={handleSave}
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