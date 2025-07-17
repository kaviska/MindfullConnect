import React from "react";
import Card from "../../ui/dashboard/card/card";
import RecentSession from "../../ui/dashboard/rsessions/rsessions";
import Chart from "../../ui/dashboard/chart/chart";
import PieChart from "../../ui/dashboard/piechart/piechart";
import Topcounsellor from "../../ui/dashboard/topcounsellor/topcounsellor";

const Dashboard = () => {
    return (
        <div className="p-6  min-h-screen space-y-8">
            {/* First row: Cards */}
            <div className="w-full">
                <h1 className="text-xl font-bold text-[#0A1D58] mb-3">Recent Data</h1>
                <div className="grid grid-cols-3 gap-6">
                    <Card />
                    <Card />
                    <Card />
                </div>
            </div>

            {/* Second row: Chart and PieChart */}
            <div className="flex gap-20">
                <div className="w-3/5">
                    <h1 className="text-xl font-bold text-[#0A1D58] mb-3">Total Earning</h1>
                    <div className=" bg-white p-5 pr-10 rounded-xl">
                        <Chart />
                    </div>
                </div>
                <div className="w-2/5">
                    <h1 className="text-xl font-bold text-[#0A1D58] mb-3">New Users</h1>
                    <div className="rounded-xl">
                        <PieChart />
                    </div>
                </div>
            </div>

            {/* Third row: Top Counsellors and Recent Sessions */}
            <div className="flex gap-20">
                <div className="w-3/5 ">
                    <h1 className="text-xl font-bold text-[#0A1D58] mb-3">Top Consellors</h1>
                    <div className="grid grid-cols-3 gap-6 bg-white p-6 rounded-xl gap-y-3 items-center">
                        <Topcounsellor />
                        <Topcounsellor />
                        <Topcounsellor />
                        <Topcounsellor />
                        <Topcounsellor />
                        <Topcounsellor />
                    </div>
                </div>
                <div className="w-2/5">
                    <h1 className="text-xl font-bold text-[#0A1D58] mb-3">Recent Sessions</h1>
                    <RecentSession />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
