'use client';

import { ReactNode, useState, useEffect } from "react";
import Navbar from "../ui/dashboard/navbar/navbar";
import Sidebar from "../ui/dashboard/sidebar/sidebar";

type LayoutProps = {
    children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
    const [collapsed, setCollapsed] = useState(false);
    const [windowWidth, setWindowWidth] = useState(0);

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
            if (window.innerWidth < 768) {
                setCollapsed(true); // auto-collapse on small screens
            } else {
                setCollapsed(false);
            }
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div className="flex h-screen overflow-hidden">
            {/* Sidebar */}
            <div className={`${collapsed ? 'w-20' : 'w-64'} transition-all duration-300`}>
                <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} windowWidth={windowWidth} />
            </div>

            {/* Main content */}
            <div className="flex-1 flex flex-col">
                <Navbar />
                <div className="flex-1 overflow-y-auto bg-[#E6EFF5] px-4 pb-4 pt-0">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Layout;
