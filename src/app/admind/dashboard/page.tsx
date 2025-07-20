import React from "react";
import Card from "../../ui/dashboard/card/card";
import RecentSessions from "../../ui/dashboard/rsessions/rsessions";
import Chart from "../../ui/dashboard/chart/chart";
import PieChart from "../../ui/dashboard/piechart/piechart";
import TopCounsellors from "../../ui/dashboard/topcounsellors/topcounsellors";
import EarningsInfo from "../../ui/dashboard/earnings/earnings";
//dashboard page for admin with responsive design and modern UI components
const Dashboard = () => {
    return (
        <div className="min-h-screen bg-transparent p-4 md:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Dashboard Header */}
                <div className="mb-6 md:mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-[#0A1D58] mb-2">Dashboard Overview</h1>
                    <p className="text-gray-600 text-sm md:text-base">Welcome back! Here's what's happening with your therapy platform.</p>
                </div>

                {/* Key Metrics Cards - Responsive Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    <Card
                        title="Total Patients"
                        endpoint="/admind/api/patient"
                        defaultValue={0}
                        icon="groups"
                        color="#1C3172"
                    />
                    <Card
                        title="Active Counselors"
                        endpoint="/admind/api/counsellors/active"
                        defaultValue={0}
                        icon="person"
                        color="#1C3172"
                    />
                    <Card
                        title="Total Sessions"
                        endpoint="/admind/api/sessions"
                        defaultValue={0}
                        icon="event"
                        color="#1C3172"
                    />
                </div>

                {/* Earnings Overview - Full Width */}
                <div className="w-full">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-4 md:p-6 border-b border-gray-100">
                            <h2 className="text-lg md:text-xl font-semibold text-[#0A1D58]">Earnings Overview</h2>
                            <p className="text-gray-600 text-xs md:text-sm mt-1">Current month financial performance</p>
                        </div>
                        <div className="p-4 md:p-6">
                            <EarningsInfo />
                        </div>
                    </div>
                </div>

                {/* Analytics Section - Responsive Layout */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    {/* Chart - Takes 2/3 on xl screens */}
                    <div className="xl:col-span-2">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden h-full">
                            <div className="p-4 md:p-6 border-b border-gray-100">
                                <h2 className="text-lg md:text-xl font-semibold text-[#0A1D58]">Revenue Trends</h2>
                                <p className="text-gray-600 text-xs md:text-sm mt-1">Last 6 months earnings performance</p>
                            </div>
                            <div className="p-4 md:p-6">
                                <Chart />
                            </div>
                        </div>
                    </div>

                    {/* User Distribution - Takes 1/3 on xl screens */}
                    <div className="xl:col-span-1">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden h-full">
                            <div className="p-4 md:p-6 border-b border-gray-100">
                                <h2 className="text-lg md:text-xl font-semibold text-[#0A1D58]">User Distribution</h2>
                                <p className="text-gray-600 text-xs md:text-sm mt-1">Platform user breakdown</p>
                            </div>
                            <div className="p-2 md:p-4">
                                <PieChart />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Management Section - Responsive Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    {/* Top Counsellors - Takes 3/5 on lg screens */}
                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden h-full">
                            <div className="p-4 md:p-6 border-b border-gray-100">
                                <h2 className="text-lg md:text-xl font-semibold text-[#0A1D58]">Top Performing Counsellors</h2>
                                <p className="text-gray-600 text-xs md:text-sm mt-1">Highest rated therapy professionals</p>
                            </div>
                            <div className="p-4 md:p-6">
                                <TopCounsellors />
                            </div>
                        </div>
                    </div>

                    {/* Recent Sessions - Takes 2/5 on lg screens */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden h-full">
                            <div className="p-4 md:p-6 border-b border-gray-100">
                                <h2 className="text-lg md:text-xl font-semibold text-[#0A1D58]">Recent Activity</h2>
                                <p className="text-gray-600 text-xs md:text-sm mt-1">Latest therapy sessions</p>
                            </div>
                            <div className="p-4 md:p-6">
                                <RecentSessions />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
