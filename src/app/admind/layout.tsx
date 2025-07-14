'use client';

import { ReactNode } from "react";
import Navbar from "../ui/dashboard/navbar/navbar";
import Sidebar from "../ui/dashboard/sidebar/sidebar";

type LayoutProps = {
    children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
    return (
        <div className="flex h-screen overflow-hidden">
            {/* Sidebar */}
            <div className="w-[250px] bg-[#f1f1f1]">
                <Sidebar />
            </div>

            {/* Main content */}
            <div className="flex-1 flex flex-col">
                <Navbar />
                {/* Scrollable dashboard content */}
                <div className="flex-1 overflow-y-auto bg-[#E6EFF5] px-4 pb-4 pt-0">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Layout;
