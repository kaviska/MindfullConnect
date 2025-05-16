import React from "react";
import Sidebar from "../../app/components/sidebar";
import Header from "../../app/components/Header";
import StatsCard from "../../app/components/StatsCard";
import Graph from "../../app/components/Graph";
import Transactions from "../../app/components/Transactions";
import ClientList from "../../app/components/ClientList";
import PieChart from "../../app/components/PieChart";

const Dashboard: React.FC = () => {
  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />
      <div className="flex-1 p-6 ml-64">
        <Header />
        <div className="grid grid-cols-3 gap-4 mt-6">
          <StatsCard title="Total Sessions" value="67" bgColor="bg-orange-300" />
          <StatsCard title="Upcoming Sessions" value="67" bgColor="bg-blue-300" />
          <StatsCard title="Total Earnings" value="$675" bgColor="bg-gray-300" />
        </div>
        <div className="grid grid-cols-3 gap-6 mt-6">
          <Graph />
          <Transactions />
          <PieChart />
        </div>
        <div className="mt-6">
          <ClientList />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
