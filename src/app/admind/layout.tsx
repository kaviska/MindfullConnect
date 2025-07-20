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
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
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

    // Prevent hydration mismatch
    if (!mounted) {
        return (
            <div className="flex h-screen overflow-hidden">
                <div className="w-64 bg-white shadow-xl border-r border-gray-100">
                    <div className="animate-pulse p-6">
                        <div className="w-10 h-10 bg-gray-200 rounded-xl mx-auto mb-6"></div>
                        <div className="space-y-4">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="h-12 bg-gray-200 rounded-lg"></div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="flex-1 flex flex-col">
                    <div className="h-16 bg-white shadow-sm"></div>
                    <div className="flex-1 bg-gray-50"></div>
                </div>
            </div>
        );
    }

    const isMobile = windowWidth < 768;

    return (
        <div className="flex h-screen overflow-hidden bg-gray-50">
            {/* Sidebar - Hidden on mobile, shown as overlay */}
            {!isMobile && (
                <div className={`${collapsed ? 'w-20' : 'w-64'} transition-all duration-300 flex-shrink-0`}>
                    <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} windowWidth={windowWidth} />
                </div>
            )}

            {/* Mobile Sidebar */}
            {isMobile && (
                <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} windowWidth={windowWidth} />
            )}

            {/* Main content */}
            <div className="flex-1 flex flex-col min-w-0">
                <Navbar />
                <main className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-6">
                    <div className="max-w-full mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;
