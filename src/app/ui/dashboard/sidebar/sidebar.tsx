'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    Home,
    PsychologyAlt,
    Person,
    ReportProblem,
    Badge,
    KeyboardArrowLeft,
    KeyboardArrowRight
} from '@mui/icons-material';

interface SidebarProps {
    collapsed: boolean;
    setCollapsed: (value: boolean) => void;
    windowWidth: number;
}

const Sidebar = ({ collapsed, setCollapsed, windowWidth }: SidebarProps) => {
    const [activeMenu, setActiveMenu] = useState('Dashboard');
    const [activeSubMenu, setActiveSubMenu] = useState<string | null>(null);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [showText, setShowText] = useState(!collapsed);

    useEffect(() => {
        if (!collapsed) {
            const timeout = setTimeout(() => setShowText(true), 300);
            return () => clearTimeout(timeout);
        } else {
            setShowText(false);
        }
    }, [collapsed]);

    const handleMenuClick = (menu: string, hasSubItems: boolean, subItem?: string) => {
        setActiveMenu(menu);
        setActiveSubMenu(subItem || null);

        if (hasSubItems) {
            setOpenDropdown(openDropdown === menu ? null : menu);
        } else {
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
        <div
            className={`bg-white shadow-md p-4 flex flex-col items-center h-screen
        transition-all duration-300 ease-in-out
        ${collapsed ? 'w-20' : 'w-64'} relative`}
        >
            <img
                src="/logo.png"
                alt="Logo"
                className={`object-contain mb-6 transition-all duration-300 ease-in-out w-20 h-20
          ${windowWidth < 768 && collapsed ? 'w-10 h-10' : ''}`}
            />

            <ul className="w-full flex flex-col items-center">
                {menuItems.map((item) => {
                    const isActiveParent =
                        activeMenu === item.name &&
                        (!item.subItems || activeSubMenu === null);
                    const isActiveParentWithSub =
                        activeMenu === item.name && activeSubMenu !== null;

                    return (
                        <li key={item.name} className="w-full">
                            {item.subItems ? (
                                <>
                                    <button
                                        className={`flex items-center gap-3 p-3 rounded-lg font-medium w-full
                    ${collapsed ? 'justify-center' : 'justify-start pl-6'}
                    ${isActiveParentWithSub ? 'text-[#1C3172]' : 'text-[#9C9C9C] hover:text-[#7B7A7A]'}
                    transition-colors duration-200`}
                                        onClick={() => handleMenuClick(item.name, true)}
                                        style={{ fontSize: windowWidth < 768 ? '14px' : '18px' }}
                                    >
                                        {item.icon}
                                        {showText && !collapsed && item.name}
                                    </button>

                                    {openDropdown === item.name && showText && !collapsed && (
                                        <ul className="pl-12 mt-1">
                                            {item.subItems.map((sub) => (
                                                <li key={sub.name}>
                                                    <Link href={sub.path}>
                                                        <span
                                                            onClick={() =>
                                                                handleMenuClick(item.name, true, sub.name)
                                                            }
                                                            className={`block text-[14px] py-1 cursor-pointer pl-6
                              ${activeSubMenu === sub.name
                                                                    ? 'text-[#1C3172]'
                                                                    : 'text-[#9C9C9C] hover:text-[#1C3172]'}`}
                                                        >
                                                            {sub.name}
                                                        </span>
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </>
                            ) : (
                                <Link
                                    href={item.path}
                                    onClick={() => handleMenuClick(item.name, false)}
                                    className={`flex items-center gap-3 p-3 rounded-lg font-medium w-full
                  ${collapsed ? 'justify-center' : 'justify-start pl-6'}
                  ${isActiveParent ? 'text-[#1C3172]' : 'text-[#9C9C9C] hover:text-[#7B7A7A]'}
                  transition-colors duration-200`}
                                    style={{ fontSize: windowWidth < 768 ? '14px' : '18px' }}
                                >
                                    {item.icon}
                                    {showText && !collapsed && item.name}
                                </Link>
                            )}
                        </li>
                    );
                })}
            </ul>

            <button
                onClick={() => setCollapsed(!collapsed)}
                className="absolute bottom-4 right-4 p-2 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 flex items-center justify-center"
                aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
                {collapsed ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            </button>
        </div>
    );
};

export default Sidebar;