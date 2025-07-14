'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SuccessModal from '../../../ui/success/success';
const EditProfile = () => {
    const router = useRouter();

    const [showSuccessModal, setShowSuccessModal] = useState(false); // 👈 added for popup control

    const [formData, setFormData] = useState({
        firstName: '',
        email: '',
        lastName: '',
        nic: '',
        address: '',
        city: '',
        province: '',
        postalCode: '',
    });

    const initialData = {
        firstName: '',
        email: '',
        lastName: '',
        nic: '',
        address: '',
        city: '',
        province: '',
        postalCode: '',
    };

    const fields = [
        { label: 'First Name', name: 'firstName', type: 'text' },
        { label: 'Last Name', name: 'lastName', type: 'text' },
        { label: 'Email', name: 'email', type: 'email' },
        { label: 'NIC', name: 'nic', type: 'text' },
        { label: 'Address', name: 'address', type: 'text' },
        { label: 'Contact No ', name: 'city', type: 'text' }
    ];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCancel = () => {
        router.push('/admind/adminprofile/profile');
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        setShowSuccessModal(true); // 👈 open the modal instead of redirect immediately
    };

    const handleModalOk = () => {
        setShowSuccessModal(false);
        router.push('/admind/adminprofile/profile'); //  Redirect to profile page
    };

    const handleModalCancel = () => {
        setShowSuccessModal(false);
    };

    return (
        <div className="min-h-screen flex flex-col items-center p-6 md:p-10">

            {/* Tabs */}
            <div className="flex w-full max-w-6xl border-b mb-8">
                <button className="px-4 py-2 font-semibold text-blue-600 border-b-1 border-blue-600">
                    Profile
                </button>
                <button
                    onClick={() => router.push('/admind/adminprofile/password')}
                    className="px-4 py-2 ml-4 text-gray-500 hover:text-blue-600 transition">
                    Change Password
                </button>
            </div>

            {/* Profile Picture */}
            <div className="flex justify-center mb-8">
                <Image
                    src="/rsessions.png"
                    alt="Profile Picture"
                    width={120}
                    height={120}
                    className="rounded-full object-cover"
                />
            </div>

            {/* Form */}
            <form onSubmit={handleSave} className="w-full max-w-3xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {fields.map((field, idx) => (
                        <div key={idx} className="flex flex-col">
                            <label htmlFor={field.name} className="text-gray-700 mb-1 text-sm">
                                {field.label}
                            </label>
                            <input
                                id={field.name}
                                name={field.name}
                                type={field.type}
                                value={(formData as any)[field.name]}
                                onChange={handleChange}
                                className="p-3 rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800"
                                required
                            />
                        </div>
                    ))}
                </div>

                {/* Buttons */}
                <div className="flex flex-col md:flex-row justify-center md:justify-between mt-10 gap-4 md:gap-10">
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="w-full md:w-auto bg-gray-300 text-gray-800 px-8 py-3 rounded-full hover:bg-gray-400 transition"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="w-full md:w-auto bg-red-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition"
                    >
                        Save
                    </button>
                </div>
            </form>

            {/* Success Modal */}
            {showSuccessModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                    <SuccessModal onOk={handleModalOk} onCancel={handleModalCancel} />
                </div>
            )}
        </div>
    );
};

export default EditProfile;
