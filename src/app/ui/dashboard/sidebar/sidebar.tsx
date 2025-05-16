'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    Home,
    PsychologyAlt,
    Person,
    ReportProblem,
    Badge
} from '@mui/icons-material';

const Sidebar = () => {
    const [activeMenu, setActiveMenu] = useState('Dashboard');
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

    const handleMenuClick = (menu: string, hasSubItems: boolean) => {
        if (hasSubItems) {
            setOpenDropdown(openDropdown === menu ? null : menu);
        } else {
            setActiveMenu(menu);
            setOpenDropdown(null);
        }
    };

    const menuItems = [
        { name: 'Dashboard', icon: <Home fontSize="large" />, path: '/admind/dashboard' },
        { name: 'Patient', icon: <PsychologyAlt fontSize="large" />, path: '/admind/patient' },
        {
            name: 'Counsellors',
            icon: <Person fontSize="large" />,
            subItems: [
                { name: 'Active', path: '/admind/counsellors/active' },
                { name: 'Pending', path: '/admind/counsellors/pending' },
            ],
        },
        {
            name: 'Reported',
            icon: <ReportProblem fontSize="large" />,
            subItems: [
                { name: 'Resolved', path: '/admind/reported/resolved' },
                { name: 'Pending', path: '/admind/reported/pending' },
            ],
        },
        { name: 'Employee', icon: <Badge fontSize="large" />, path: '/admind/employee' },
    ];

    return (
        <div className="w-64 bg-white shadow-md p-4 flex flex-col items-center h-screen">
            <img src="/logo.png" alt="Logo" className="w-20 h-20 object-contain mb-6" />
            <ul className="w-full pl-4">
                {menuItems.map((item) => (
                    <li key={item.name}>
                        {item.subItems ? (
                            <button
                                className={`flex items-center gap-3 p-3 rounded-lg text-[18px] font-medium w-full ${activeMenu === item.name
                                    ? 'text-[#2D60FF]'
                                    : 'text-[#9C9C9C] hover:text-[#7B7A7A]'
                                    }`}
                                onClick={() => handleMenuClick(item.name, true)}
                            >
                                {item.icon} {item.name}
                            </button>
                        ) : (
                            <Link
                                href={item.path}
                                onClick={() => handleMenuClick(item.name, false)}
                                className={`flex items-center gap-3 p-3 rounded-lg text-[18px] font-medium w-full ${activeMenu === item.name
                                    ? 'text-[#032DB0]'
                                    : 'text-[#9C9C9C] hover:text-[#7B7A7A]'
                                    }`}
                            >
                                {item.icon} {item.name}
                            </Link>
                        )}

                        {item.subItems && openDropdown === item.name && (
                            <ul className="pl-8">
                                {item.subItems.map((sub) => (
                                    <li key={sub.name}>
                                        <Link href={sub.path}>
                                            <span className="block text-[14px] text-[#9C9C9C] hover:text-[#2D60FF] py-1 cursor-pointer">
                                                {sub.name}
                                            </span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Sidebar;