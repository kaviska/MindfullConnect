import React from "react";

const Sidebar: React.FC = () => {
  return (
    <div className="bg-blue-100 w-64 p-4 h-full fixed">
      <div className="text-center mb-6">
        <img
          src="/profile.jpg"
          alt="Profile"
          className="rounded-full w-24 h-24 mx-auto mb-2"
        />
        <h3 className="text-xl font-bold">John Smith</h3>
        <p className="text-sm text-gray-600">johnsmithmindful@gmail.com</p>
      </div>
      <nav className="space-y-4">
        <a href="#" className="block text-blue-500 font-medium">Dashboard</a>
        <a href="#" className="block">Manage Profile</a>
        <a href="#" className="block">Sessions</a>
        <a href="#" className="block">Messages</a>
        <a href="#" className="block">Progress Tracking</a>
        <a href="#" className="block">Feedbacks</a>
        <a href="#" className="block">Patient Details</a>
        <a href="#" className="block">Blog Section</a>
      </nav>
    </div>
  );
};

export default Sidebar;
