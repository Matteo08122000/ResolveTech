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
          className={`fixed inset-y-0 left-0 bg-gray-800 text-white transform ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-300 ease-in-out z-50 md:relative md:translate-x-0 w-64`}
        >
          <Sidebar />
        </div>

        <div className="flex-grow bg-white p-4 md:p-6 overflow-y-auto">
          <button
            className="md:hidden p-2 bg-gray-800 text-white rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-gray-500 absolute top-4 left-4 z-50"
            onClick={() => setIsSidebarOpen((prev) => !prev)}
          >
            {isSidebarOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            )}
          </button>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-1 gap-6">
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
  );
};

export default Dashboard;
