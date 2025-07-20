'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Home,
    PsychologyAlt,
    Person,
    ReportProblem,
    Badge,
    KeyboardArrowLeft,
    KeyboardArrowRight,
    Menu,
    Close,
    ExpandMore,
    ExpandLess,
    Dashboard
} from '@mui/icons-material';

interface SidebarProps {
    collapsed: boolean;
    setCollapsed: (value: boolean) => void;
    windowWidth: number;
    isSuperAdmin?: boolean;
    permissions?: { [key: string]: { read: boolean } } | null;
}

const Sidebar = ({ collapsed, setCollapsed, windowWidth, isSuperAdmin, permissions }: SidebarProps) => {
    const pathname = usePathname();
    const [openDropdowns, setOpenDropdowns] = useState<string[]>([]);
    const [showText, setShowText] = useState(!collapsed);
    const [isMobile, setIsMobile] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        setIsMobile(windowWidth < 768);
        if (!collapsed && !isMobile) {
            const timeout = setTimeout(() => setShowText(true), 150);
            return () => clearTimeout(timeout);
        } else {
            setShowText(false);
        }
    }, [collapsed, windowWidth, isMobile]);

    // Auto-open relevant dropdowns based on current path
    useEffect(() => {
        const currentPath = pathname;
        const openDropdowns: string[] = [];

        if (currentPath.includes('/counsellors/')) {
            openDropdowns.push('Counsellors');
        }
        if (currentPath.includes('/reported/')) {
            openDropdowns.push('Reported');
        }

        setOpenDropdowns(openDropdowns);
    }, [pathname]);

    const toggleDropdown = (menu: string) => {
        setOpenDropdowns(prev =>
            prev.includes(menu)
                ? prev.filter(item => item !== menu)
                : [...prev, menu]
        );
    };

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    const menuItems = [


        { name: 'Dashboard', icon: <Home />, path: '/admind/dashboard', badge: null },

        ...(isSuperAdmin ? [{ name: 'Panel', icon: <Dashboard />, path: '/admind/panel', badge: null }] : []),
        {
            name: 'Patients',
            icon: <PsychologyAlt />,
            path: '/admind/patient',
            badge: 'new'
        },
        {
            name: 'Counsellors',
            icon: <Person />,
            subItems: [
                { name: 'Active', path: '/admind/counsellors/active', count: 13 },
                { name: 'Pending', path: '/admind/counsellors/pending', count: 5 },
            ],
        },
        {
            name: 'Reports',
            icon: <ReportProblem />,
            subItems: [
                { name: 'Resolved', path: '/admind/reported/resolved', count: 8 },
                { name: 'Pending', path: '/admind/reported/pending', count: 3 },
            ],
        },
        ...(isSuperAdmin 
            ? [{ name: 'Employees', icon: <Badge />, path: '/admind/employee', badge: null }]
                : []),
    ];

    console.log(menuItems);

    const isActiveLink = (path: string) => {
        return pathname === path;
    };

    const isActiveParent = (itemName: string, subItems?: any[]) => {
        if (subItems) {
            return subItems.some(sub => pathname === sub.path);
        }
        return false;
    };

    const SidebarContent = () => (
        <>
            {/* Logo Section */}
            <div className="flex items-center justify-center py-6 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                        <span className="text-white font-bold text-lg">M</span>
                    </div>
                    {(showText && !collapsed) || isMobile ? (
                        <div className="flex flex-col">
                            <span className="text-xl font-bold text-gray-800">Mindful</span>
                            <span className="text-xs text-gray-500 -mt-1">Connect</span>
                        </div>
                    ) : null}
                </div>
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 py-6 px-4 space-y-2">
                {menuItems.map((item) => {
                    const hasSubItems = !!item.subItems;
                    const isParentActive = isActiveParent(item.name, item.subItems);
                    const isDropdownOpen = openDropdowns.includes(item.name);

                    return (
                        <div key={item.name} className="space-y-1">
                            {hasSubItems ? (
                                <button
                                    onClick={() => toggleDropdown(item.name)}
                                    className={`w-full flex items-center justify-between p-3 rounded-xl font-medium transition-all duration-300 group
                                        ${isParentActive
                                            ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 shadow-sm'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                        }
                                        ${collapsed && !isMobile ? 'justify-center' : ''}
                                    `}
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className={`p-1.5 rounded-lg transition-colors duration-300 ${isParentActive
                                            ? 'bg-blue-100 text-blue-600'
                                            : 'text-gray-400 group-hover:text-gray-600'
                                            }`}>
                                            {item.icon}
                                        </div>
                                        {(showText && !collapsed) || isMobile ? (
                                            <span className="font-medium">{item.name}</span>
                                        ) : null}
                                    </div>

                                    {((showText && !collapsed) || isMobile) && (
                                        <div className="flex items-center space-x-2">
                                            {item.subItems && (
                                                <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                                                    {item.subItems.reduce((sum, sub) => sum + (sub.count || 0), 0)}
                                                </span>
                                            )}
                                            {isDropdownOpen ? <ExpandLess /> : <ExpandMore />}
                                        </div>
                                    )}
                                </button>
                            ) : (
                                <Link
                                    href={item.path}
                                    className={`flex items-center justify-between p-3 rounded-xl font-medium transition-all duration-300 group
                                        ${isActiveLink(item.path)
                                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-200'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                        }
                                        ${collapsed && !isMobile ? 'justify-center' : ''}
                                    `}
                                    onClick={() => isMobile && setMobileMenuOpen(false)}
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className={`p-1.5 rounded-lg transition-colors duration-300 ${isActiveLink(item.path)
                                            ? 'bg-white/20 text-white'
                                            : 'text-gray-400 group-hover:text-gray-600'
                                            }`}>
                                            {item.icon}
                                        </div>
                                        {(showText && !collapsed) || isMobile ? (
                                            <span className="font-medium">{item.name}</span>
                                        ) : null}
                                    </div>

                                    {((showText && !collapsed) || isMobile) && item.badge && (
                                        <span className={`text-xs px-2 py-1 rounded-full ${item.badge === 'new'
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-gray-200 text-gray-600'
                                            }`}>
                                            {item.badge}
                                        </span>
                                    )}
                                </Link>
                            )}

                            {/* Dropdown Items */}
                            {hasSubItems && isDropdownOpen && ((showText && !collapsed) || isMobile) && (
                                <div className="ml-6 mt-2 space-y-1 border-l-2 border-gray-100 pl-4">
                                    {item.subItems?.map((subItem) => (
                                        <Link
                                            key={subItem.name}
                                            href={subItem.path}
                                            className={`flex items-center justify-between p-2.5 rounded-lg text-sm font-medium transition-all duration-200
                                                ${isActiveLink(subItem.path)
                                                    ? 'bg-blue-50 text-blue-700 border-l-3 border-blue-600'
                                                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                                                }
                                            `}
                                            onClick={() => isMobile && setMobileMenuOpen(false)}
                                        >
                                            <span>{subItem.name}</span>
                                            {subItem.count && (
                                                <span className={`text-xs px-2 py-1 rounded-full ${isActiveLink(subItem.path)
                                                    ? 'bg-blue-100 text-blue-700'
                                                    : 'bg-gray-200 text-gray-600'
                                                    }`}>
                                                    {subItem.count}
                                                </span>
                                            )}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </nav>

            {/* Bottom Section */}
            <div className="border-t border-gray-100 p-4">
                {!isMobile && (
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="w-full flex items-center justify-center p-3 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-600 transition-all duration-300 group"
                        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                    >
                        <div className="p-1 rounded-lg group-hover:bg-gray-200 transition-colors duration-300">
                            {collapsed ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
                        </div>
                        {showText && !collapsed && (
                            <span className="ml-2 text-sm font-medium">Collapse</span>
                        )}
                    </button>
                )}
            </div>
        </>
    );
    // Desktop Sidebar
    if (!isMobile) {
        return (
            <div className={`bg-white shadow-xl border-r border-gray-100 h-screen flex flex-col transition-all duration-300 ease-in-out ${collapsed ? 'w-20' : 'w-64'
                }`}>
                <SidebarContent />
            </div>
        );
    }

    // Mobile Sidebar
    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={toggleMobileMenu}
                className="fixed top-4 left-4 z-50 p-3 bg-white rounded-xl shadow-lg border border-gray-200 md:hidden"
                aria-label="Toggle mobile menu"
            >
                {mobileMenuOpen ? <Close /> : <Menu />}
            </button>

            {/* Mobile Overlay */}
            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            {/* Mobile Sidebar */}
            <div className={`fixed left-0 top-0 h-full w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 md:hidden ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                }`}>
                <div className="flex flex-col h-full">
                    <SidebarContent />
                </div>
            </div>
        </>
    );
};

export default Sidebar;