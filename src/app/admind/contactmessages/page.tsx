"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import DescriptionIcon from '@mui/icons-material/Description';
import Pagination from "../../ui/pagination/pagination";

interface ContactMessage {
    _id: string;
    fullName: string;
    email: string;
    contact: string;
    role: string;
    message: string;
    createdAt: string;
}

const fetchMessages = async (page: number): Promise<{ contacts: ContactMessage[]; totalPages: number }> => {
    const res = await fetch(`/admind/api/contactus?page=${page}&pending=true`);
    if (!res.ok) {
        console.error("Failed to fetch messages:", await res.text());
        throw new Error("Failed to fetch messages");
    }
    const data = await res.json();
    if (!data.success) {
        throw new Error(data.error || "Failed to fetch messages");
    }
    return {
        contacts: data.contacts,
        totalPages: data.totalPages
    };
};

const ContactMessagesPage = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const page = Number(searchParams.get("page")) || 1;

    const [messages, setMessages] = useState<ContactMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [replyMessage, setReplyMessage] = useState('');
    const [isSending, setIsSending] = useState(false);

    const handleSendReply = async () => {
        if (!selectedMessage || !replyMessage.trim()) return;

        try {
            setIsSending(true);
            const response = await fetch('/admind/api/contactus/reply', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-message-id': selectedMessage._id,
                },
                body: JSON.stringify({
                    to: selectedMessage.email,
                    subject: `Re: Your Message to MindfulConnect`,
                    message: replyMessage,
                    originalMessage: selectedMessage.message,
                }),
            }); if (!response.ok) {
                throw new Error('Failed to send reply');
            }

            setShowReplyForm(false);
            setReplyMessage('');
            alert('Reply sent successfully!');

            // Remove the replied message from the list
            setMessages(prevMessages =>
                prevMessages.filter(msg => msg._id !== selectedMessage._id)
            );

            setShowModal(false);
        } catch (error) {
            console.error('Error sending reply:', error);
            alert('Failed to send reply. Please try again.');
        } finally {
            setIsSending(false);
        }
    };

    useEffect(() => {
        const loadMessages = async () => {
            try {
                setLoading(true);
                const data = await fetchMessages(page);
                if (data.contacts) {
                    setMessages(data.contacts);
                    setTotalPages(data.totalPages);
                } else {
                    console.error("No contacts data received:", data);
                }
            } catch (error) {
                console.error("Error fetching messages:", error);
                setMessages([]);
            } finally {
                setLoading(false);
            }
        };

        loadMessages();
    }, [page]);

    const handleViewMessage = (message: ContactMessage) => {
        setSelectedMessage(message);
        setShowModal(true);
    };

    return (
        <div className="p-6 bg-[#E9F0F6] min-h-screen">
            <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-[#1045A1]">Contact Messages</h1>
                <p className="text-gray-600 mt-2">View contact form submissions</p>
            </div>

            {/* Messages Table */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm text-left">
                        <thead className="bg-[#F5F7FA] text-gray-600 font-semibold">
                            <tr>
                                <th className="px-6 py-4 text-center hidden lg:table-cell">Message ID</th>
                                <th className="px-6 py-4 text-center">Name</th>
                                <th className="px-6 py-4 text-center hidden md:table-cell">Email</th>
                                <th className="px-6 py-4 text-center hidden md:table-cell">Role</th>
                                <th className="px-6 py-4 text-center hidden md:table-cell">Date</th>
                                <th className="px-6 py-4 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {messages.map((message) => (
                                <tr key={message._id} className="border-t border-gray-200 hover:bg-gray-50">
                                    <td className="px-6 py-4 text-center hidden lg:table-cell">{message._id}</td>
                                    <td className="px-6 py-4 text-center">{message.fullName}</td>
                                    <td className="px-6 py-4 text-center hidden md:table-cell">{message.email}</td>
                                    <td className="px-6 py-4 text-center hidden md:table-cell">
                                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            {message.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center hidden md:table-cell">
                                        {new Date(message.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <button
                                            onClick={() => handleViewMessage(message)}
                                            className="w-[35px] h-[35px] flex items-center justify-center rounded-full cursor-pointer hover:scale-110 transition-all mx-auto"
                                            title="View Details"
                                        >
                                            <DescriptionIcon fontSize="small" style={{ color: "black" }} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="text-center py-4">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#1045A1] border-t-transparent"></div>
                </div>
            )}

            {/* Pagination */}
            <div className="mt-6">
                <Pagination totalPages={totalPages} />
            </div>

            {/* View Message Modal */}
            {showModal && selectedMessage && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 w-full max-w-lg mx-4">
                        <h2 className="text-xl sm:text-2xl font-bold text-[#1045A1] mb-6">Message Details</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-600">Name</label>
                                <p className="mt-1">{selectedMessage.fullName}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600">Email</label>
                                <p className="mt-1">{selectedMessage.email}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600">Contact</label>
                                <p className="mt-1">{selectedMessage.contact}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600">Role</label>
                                <p className="mt-1">{selectedMessage.role}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600">Message</label>
                                <p className="mt-1 whitespace-pre-wrap">{selectedMessage.message}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600">Date Submitted</label>
                                <p className="mt-1">
                                    {new Date(selectedMessage.createdAt).toLocaleString()}
                                </p>
                            </div>
                        </div>
                        {showReplyForm ? (
                            <div className="mt-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-2">
                                        Your Reply
                                    </label>
                                    <textarea
                                        value={replyMessage}
                                        onChange={(e) => setReplyMessage(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1045A1] focus:border-transparent"
                                        rows={6}
                                        placeholder="Type your reply here..."
                                    />
                                </div>
                                <div className="flex space-x-3">
                                    <button
                                        onClick={handleSendReply}
                                        disabled={isSending || !replyMessage.trim()}
                                        className="flex-1 py-2 px-4 bg-[#1045A1] text-white font-semibold rounded-lg hover:bg-[#0d357c] transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
                                    >
                                        {isSending ? 'Sending...' : 'Send Reply'}
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowReplyForm(false);
                                            setReplyMessage('');
                                        }}
                                        className="flex-1 py-2 px-4 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-all"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="mt-6 flex space-x-3">
                                <button
                                    onClick={() => setShowReplyForm(true)}
                                    className="flex-1 py-2 px-4 bg-[#1045A1] text-white font-semibold rounded-lg hover:bg-[#0d357c] transition-all"
                                >
                                    Reply
                                </button>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 py-2 px-4 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-all"
                                >
                                    Close
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ContactMessagesPage;
