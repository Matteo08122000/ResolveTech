import React, { useState } from "react";
import Sidebar from "../components/Sidebar/Sidebar";
import Header from "../components/Header/Header";
import TicketsChart from "../components/TicketsChart/TicketsChart";
import TicketsPieChart from "../components/TicketsPieChart/TicketsPieChart";
import RadarChart from "../components/RadarChart/RadarChart";
import TicketsTable from "../components/TicketsTable/TicketsTable";

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <div className="flex-shrink-0 shadow-md">
        <Header />
      </div>
      <div className="flex flex-grow overflow-hidden relative">
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        )}

        <div
          className={`bg-purple-900 text-white rounded-r-xl transform ${
            isSidebarOpen ? "w-64" : "w-16"
          } transition-all duration-300 ease-in-out z-50 ${
            isSidebarOpen ? "fixed md:relative" : "fixed md:relative"
          } h-screen flex-shrink-0`}
        >
          <Sidebar collapsed={!isSidebarOpen} />
        </div>
        <div
          className={`flex-grow bg-white p-4 md:p-6 overflow-y-auto transition-all ${
            isSidebarOpen ? "ml-16 md:ml-64" : "ml-16 md:ml-64"
          }`}
        >
          <div className="flex-grow bg-white p-4 md:p-6 overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white shadow-lg rounded-lg p-4 border border-gray-200 hover:shadow-xl transition-shadow duration-300">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">
                  Tickets Overview
                </h2>
                <TicketsChart />
              </div>

              <div className="bg-white shadow-lg rounded-lg p-4 border border-gray-200 hover:shadow-xl transition-shadow duration-300">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">
                  Tickets Distribution
                </h2>
                <TicketsPieChart />
              </div>
              <div className="bg-white shadow-lg rounded-lg p-4 border border-gray-200 hover:shadow-xl transition-shadow duration-300">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">
                  Priority Metrics
                </h2>
                <RadarChart />
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 sm:none md:grid-cols-1 lg:grid-cols-1 gap-6">
              <div className="bg-white shadow-lg rounded-lg p-4 border border-gray-200 hover:shadow-xl transition-shadow duration-300">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">
                  Growth Over Time
                </h2>
                <TicketsTable />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
