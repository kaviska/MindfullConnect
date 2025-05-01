import * as React from "react";
import Header from "@/app/nav_user/page";
import { SidebarToggle } from "@/app/components/SidebarToggle";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  function toggleSidebar(isOpen: boolean): void {
    throw new Error("Function not implemented.");
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Fixed Navbar */}
      <div className="w-full bg-sky-100 fixed top-0 left-0 z-10">
        <Header />
      </div>

      {/* Content Area with Padding for Fixed Navbar */}
      <div className="flex flex-1 pt-16"> {/* Added pt-16 to offset the navbar height */}
        {/* Sidebar */}
        <SidebarToggle />

        {/* Main Content */}
        <section className="flex-1 p-5 bg-white">
          {children}
        </section>
      </div>
    </div>
  );
}