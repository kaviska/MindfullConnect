'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { NotificationsNone, NotificationsActive, Search, Logout } from '@mui/icons-material';

const Navbar = () => {
    const [notifications, setNotifications] = useState(false);
    const router = useRouter(); // Get the router instance

    const handleLogout = () => {
        console.log("Logout clicked");
        // Add your logout logic here
    };

    const goToProfile = () => {
        router.push('/admind/adminprofile/profile'); // Adjust the route as needed
    };

    return (
        <div className="bg-[#E6EFF5]">
            <header className="bg-white flex items-center px-8 py-5 justify-between overflow-hidden">
                <h1 className="text-[#343C6A] text-[28px] font-semibold font-inter">Admin</h1>
                <div className="flex items-center gap-6">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search"
                            className="w-[255px] h-[40px] pl-12 pr-4 rounded-[40px] bg-[#F5F7FA] outline-none"
                        />
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
                    </div>
                    <button
                        className="w-[40px] h-[40px] flex items-center justify-center rounded-full cursor-pointer hover:scale-110 transition-all"
                        onClick={() => setNotifications(!notifications)}
                    >
                        {notifications ? <NotificationsActive fontSize="large" /> : <NotificationsNone fontSize="medium" />}
                    </button>
                    <button
                        className="w-[40px] h-[40px] flex items-center justify-center rounded-full cursor-pointer hover:scale-110 transition-all"
                        onClick={handleLogout}
                    >
                        <Logout fontSize="medium" />
                    </button>
                    <div
                        className="w-[50px] h-[50px] bg-gray-300 rounded-full overflow-hidden cursor-pointer hover:scale-110 transition-all"
                        onClick={goToProfile}
                    >
                        <img src="/admin-photo.jpg" alt="Admin" className="w-full h-full object-cover" />
                    </div>
                </div>
            </header>
        </div>
    );
};

export default Navbar;
