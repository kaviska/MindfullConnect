'use client';

import { useRouter } from 'next/navigation';
import {
    NotificationsNone,
    Logout,
} from '@mui/icons-material';

const Navbar = () => {
    const router = useRouter();

    const handleLogout = () => {
        console.log('Logout clicked');
    };

    const goToProfile = () => {
        router.push('/admind/adminprofile/profile');
    };

    return (
        <div className="bg-[#E6EFF5] w-full">
            <header
                className="bg-white flex flex-wrap items-center justify-between px-4 sm:px-8 py-3 sm:py-5 gap-y-2 min-w-0"
            >
                {/* Admin Heading */}
                <h1 className="text-[#343C6A] font-inter font-semibold text-[18px] sm:text-[28px] whitespace-nowrap">
                    Admin
                </h1>

                {/* Icon + Profile Section */}
                <div className="flex items-center gap-3 sm:gap-6 flex-shrink-0">
                    <button
                        className="w-[32px] h-[32px] sm:w-[40px] sm:h-[40px] flex items-center justify-center rounded-full cursor-pointer hover:scale-110 transition-all"
                        onClick={() => router.push('/admind/contactmessages')}
                    >
                        <NotificationsNone fontSize="small" />
                    </button>

                    <button
                        className="w-[32px] h-[32px] sm:w-[40px] sm:h-[40px] flex items-center justify-center rounded-full cursor-pointer hover:scale-110 transition-all"
                        onClick={handleLogout}
                    >
                        <Logout fontSize="small" />
                    </button>

                    <div
                        className="w-[40px] h-[40px] sm:w-[50px] sm:h-[50px] bg-gray-300 rounded-full overflow-hidden cursor-pointer hover:scale-110 transition-all flex-shrink-0"
                        onClick={goToProfile}
                    >
                        <img
                            src="/admin-photo.jpg"
                            alt="Admin"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
            </header>
        </div>
    );
};

export default Navbar;