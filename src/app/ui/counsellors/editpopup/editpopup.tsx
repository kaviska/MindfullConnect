"use client";

import { X } from "lucide-react";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

interface EditCounsellorPopupProps {
    counsellor: any;
    onClose: () => void;
    onSave: (updatedCounsellor: any) => void;
}

const EditCounsellorPopup: React.FC<EditCounsellorPopupProps> = ({
    counsellor,
    onClose,
    onSave,
}) => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: counsellor.name || "",
        email: counsellor.email || "",
        specialty: counsellor.specialty || "",
        bio: counsellor.bio || "",
        rating: counsellor.rating || 4.8,
        consultationFee: counsellor.consultationFee || 0,
        yearsOfExperience: counsellor.yearsOfExperience || 0,
        highestQualification: counsellor.highestQualification || "",
        university: counsellor.university || "",
        licenseNumber: counsellor.licenseNumber || "",
        languagesSpoken: counsellor.languagesSpoken || [],
        availabilityType: counsellor.availabilityType || "online",
        sessionDuration: counsellor.sessionDuration || 60,
        therapeuticModalities: counsellor.therapeuticModalities || [],
        description: counsellor.description || "",
        status: counsellor.status || "pending",
    });

    const [loading, setLoading] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            console.log('Submitting form data:', formData);
            const response = await fetch(`/admind/api/counsellors/active/${counsellor._id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            console.log('Response status:', response.status);
            
            if (response.ok) {
                const data = await response.json();
                console.log('Response data:', data);
                const updatedCounsellor = data.user; // Extract user from response
                console.log('Updated counsellor:', updatedCounsellor);
                onSave(updatedCounsellor);
                router.refresh();
                onClose();
            } else {
                const errorData = await response.json();
                console.error('Failed to update counsellor:', errorData.message);
                alert('Failed to update counsellor: ' + (errorData.message || 'Unknown error'));
            }
        } catch (error) {
            console.error('Error updating counsellor:', error);
            alert('Error updating counsellor: ' + error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
            <div className="relative bg-[#e7f1f8] rounded-3xl max-w-4xl w-full max-h-[90vh] shadow-lg overflow-hidden">
                <div className="overflow-y-auto max-h-[90vh] p-8">
                    <div className="flex justify-between items-center mb-6 sticky top-0 z-10 bg-[#e7f1f8] pb-4">
                        <h2 className="text-2xl font-bold text-[#1045A1]">Edit Counsellor</h2>
                        <button
                            onClick={onClose}
                            className="text-red-600 hover:text-red-700 transition"
                            aria-label="Close popup"
                        >
                            <X size={28} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="sm:col-span-2">
                                <label className="block mb-2 font-semibold text-gray-700">Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#1045A1]"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block mb-2 font-semibold text-gray-700">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#1045A1]"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block mb-2 font-semibold text-gray-700">Specialty</label>
                                <input
                                    type="text"
                                    name="specialty"
                                    value={formData.specialty}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#1045A1]"
                                    placeholder="e.g., Clinical Psychology, Marriage Counseling"
                                />
                            </div>

                            <div>
                                <label className="block mb-2 font-semibold text-gray-700">Years of Experience</label>
                                <input
                                    type="number"
                                    name="yearsOfExperience"
                                    value={formData.yearsOfExperience}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#1045A1]"
                                    min="0"
                                />
                            </div>

                            <div>
                                <label className="block mb-2 font-semibold text-gray-700">Consultation Fee ($)</label>
                                <input
                                    type="number"
                                    name="consultationFee"
                                    value={formData.consultationFee}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#1045A1]"
                                    min="0"
                                    step="0.01"
                                />
                            </div>

                            <div>
                                <label className="block mb-2 font-semibold text-gray-700">Rating</label>
                                <input
                                    type="number"
                                    name="rating"
                                    value={formData.rating}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#1045A1]"
                                    min="1"
                                    max="5"
                                    step="0.1"
                                />
                            </div>

                            <div>
                                <label className="block mb-2 font-semibold text-gray-700">Highest Qualification</label>
                                <input
                                    type="text"
                                    name="highestQualification"
                                    value={formData.highestQualification}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#1045A1]"
                                    placeholder="e.g., PhD in Psychology, MS in Counseling"
                                />
                            </div>

                            <div>
                                <label className="block mb-2 font-semibold text-gray-700">University</label>
                                <input
                                    type="text"
                                    name="university"
                                    value={formData.university}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#1045A1]"
                                />
                            </div>

                            <div>
                                <label className="block mb-2 font-semibold text-gray-700">License Number</label>
                                <input
                                    type="text"
                                    name="licenseNumber"
                                    value={formData.licenseNumber}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#1045A1]"
                                />
                            </div>

                            <div>
                                <label className="block mb-2 font-semibold text-gray-700">Availability Type</label>
                                <select
                                    name="availabilityType"
                                    value={formData.availabilityType}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#1045A1]"
                                >
                                    <option value="online">Online</option>
                                    <option value="in-person">In-Person</option>
                                    <option value="both">Both</option>
                                </select>
                            </div>

                            <div>
                                <label className="block mb-2 font-semibold text-gray-700">Session Duration (minutes)</label>
                                <input
                                    type="number"
                                    name="sessionDuration"
                                    value={formData.sessionDuration}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#1045A1]"
                                    min="15"
                                    step="15"
                                />
                            </div>

                            <div>
                                <label className="block mb-2 font-semibold text-gray-700">Status</label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#1045A1]"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>

                            <div className="sm:col-span-2">
                                <label className="block mb-2 font-semibold text-gray-700">Bio</label>
                                <textarea
                                    name="bio"
                                    value={formData.bio}
                                    onChange={handleInputChange}
                                    rows={4}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm resize-y focus:outline-none focus:ring-2 focus:ring-[#1045A1]"
                                    placeholder="Professional bio and background..."
                                />
                            </div>

                            <div className="sm:col-span-2">
                                <label className="block mb-2 font-semibold text-gray-700">Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm resize-y focus:outline-none focus:ring-2 focus:ring-[#1045A1]"
                                    placeholder="Brief description of services..."
                                />
                            </div>
                        </div>

                        <div className="flex justify-center gap-4 mt-8 pt-6 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={onClose}
                                className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-3 rounded-full font-semibold shadow-md transition"
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="bg-[#1045A1] hover:bg-blue-700 text-white px-8 py-3 rounded-full font-semibold shadow-md transition disabled:opacity-50"
                                disabled={loading}
                            >
                                {loading ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditCounsellorPopup;
