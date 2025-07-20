"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const roles = ["User", "Counsellor"];

const ContactUs = () => {
    const [form, setForm] = useState({
        fullName: "",
        email: "",
        contact: "",
        role: "",
        message: "",
    });
    const [showModal, setShowModal] = useState(false);
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/contactus", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (data.success) {
                setForm({ fullName: "", email: "", contact: "", role: "", message: "" });
                setShowModal(true);
            } else {
                alert("Failed to send message: " + (data.error || "Unknown error"));
            }
        } catch (err) {
            alert("Failed to send message: " + err);
        }
    };

    return (
        <div className="min-h-screen bg-[#E9F0F6] flex items-center justify-center py-8 px-2 sm:px-6">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6 sm:p-8 mx-auto">
                <button
                    type="button"
                    onClick={() => router.push("/")}
                    className="mb-4 px-4 py-2 bg-gray-200 text-[#1045A1] rounded-lg font-semibold hover:bg-gray-300 transition-all"
                >
                    &#8592; Back
                </button>
                <h1 className="text-2xl sm:text-3xl font-bold text-[#1045A1] mb-6 text-center">Contact Us</h1>
                <form className="space-y-5" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="fullName" className="block text-sm font-medium text-[#1045A1] mb-1">Full Name</label>
                        <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            value={form.fullName}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1045A1]"
                            placeholder="Enter your full name"
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-[#1045A1] mb-1">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1045A1]"
                            placeholder="Enter your email"
                        />
                    </div>
                    <div>
                        <label htmlFor="contact" className="block text-sm font-medium text-[#1045A1] mb-1">Contact Number</label>
                        <input
                            type="text"
                            id="contact"
                            name="contact"
                            value={form.contact}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1045A1]"
                            placeholder="Enter your contact number"
                        />
                    </div>
                    <div>
                        <label htmlFor="role" className="block text-sm font-medium text-[#1045A1] mb-1">Role</label>
                        <select
                            id="role"
                            name="role"
                            value={form.role}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1045A1]"
                        >
                            <option value="" disabled>Select role</option>
                            {roles.map((role) => (
                                <option key={role} value={role}>{role}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="message" className="block text-sm font-medium text-[#1045A1] mb-1">Message</label>
                        <textarea
                            id="message"
                            name="message"
                            value={form.message}
                            onChange={handleChange}
                            required
                            rows={4}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1045A1] resize-none"
                            placeholder="Type your message here..."
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-[#1045A1] text-white font-semibold rounded-lg hover:bg-[#0d357c] transition-all"
                    >
                        Submit
                    </button>
                </form>
            </div>
            {/* Success Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                    <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 w-full max-w-sm mx-2 flex flex-col items-center">
                        <h2 className="text-xl sm:text-2xl font-bold text-[#1045A1] mb-4 text-center">Details Submitted!</h2>
                        <p className="text-gray-700 text-center mb-6">Your details have been successfully submitted. We will get back to you soon.</p>
                        <button
                            type="button"
                            onClick={() => { setShowModal(false); router.push("/contactus"); }}
                            className="w-full py-2 px-4 bg-[#1045A1] text-white font-semibold rounded-lg hover:bg-[#0d357c] transition-all"
                        >
                            OK
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ContactUs;
