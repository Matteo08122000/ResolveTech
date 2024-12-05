import React, { useState } from "react";
import {
  FaHome,
  FaTicketAlt,
  FaUserFriends,
  FaCog,
  FaComments,
  FaMapMarkerAlt,
  FaSignOutAlt,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { theme } = useSelector((state) => state.theme);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    try {
      const response = await fetch(`${import.meta.env.FRONTEND_URL}/logout`, {
        method: "GET",
      });

      if (response.ok) {
        window.location.href = "/";
      } else {
        console.error("Errore nel logout");
        alert("Errore nel logout. Riprova più tardi.");
      }
    } catch (error) {
      console.error("Errore di rete:", error);
      alert("Errore di rete. Riprova più tardi.");
    }
  };

  return (
    <div
      className={`h-screen transition-all rounded-r-xl shadow-lg ${
        theme === "light" ? "bg-purple-900 text-white" : "bg-black text-white"
      } ${collapsed ? "w-16" : "w-64"} flex flex-col`}
    >
      <div className="flex items-center justify-between p-4">
        {!collapsed && <h1 className="text-lg font-bold">ResolveTech</h1>}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-400 hover:text-white"
        >
          ☰
        </button>
      </div>

      <nav className="mt-6 flex flex-col space-y-2">
        <Link
          to="/dashboard"
          className="flex items-center gap-4 p-4 hover:bg-gray-800 rounded-lg"
        >
          <FaHome size={20} />
          {!collapsed && <span>Dashboard</span>}
        </Link>
        <Link
          to="/tickets"
          className="flex items-center gap-4 p-4 hover:bg-gray-800 rounded-lg"
        >
          <FaTicketAlt size={20} />
          {!collapsed && <span>Tickets</span>}
        </Link>
        <Link
          to="/users"
          className="flex items-center gap-4 p-4 hover:bg-gray-800 rounded-lg"
        >
          <FaUserFriends size={20} />
          {!collapsed && <span>Users</span>}
        </Link>
        <Link
          to="/departments"
          className="flex items-center gap-4 p-4 hover:bg-gray-800 rounded-lg"
        >
          <FaUserFriends size={20} />
          {!collapsed && <span>Departments</span>}
        </Link>
        <Link
          to="/logs"
          className="flex items-center gap-4 p-4 hover:bg-gray-800 rounded-lg"
        >
          <FaComments size={20} />
          {!collapsed && <span>Logs & Comments</span>}
        </Link>
        <Link
          to="/map"
          className="flex items-center gap-4 p-4 hover:bg-gray-800 rounded-lg"
        >
          <FaMapMarkerAlt size={20} />
          {!collapsed && <span>Live Map</span>}
        </Link>
        <Link
          to="/settings"
          className="flex items-center gap-4 p-4 hover:bg-gray-800 rounded-lg"
        >
          <FaCog size={20} />
          {!collapsed && <span>Settings</span>}
        </Link>
      </nav>
      <div className="border mt-auto border-white"></div>
      <div className="mt-auto p-4">
        <div className="flex items-center">
          {isAuthenticated && (
            <button
              className="p-auto  rounded-full hover:opacity-80 transition bg-gray-700 text-white"
              onClick={handleLogout}
            >
              <FaSignOutAlt size={20} />
            </button>
          )}
        </div>
        {!collapsed && (
          <p className="text-sm text-white-400 mt-auto ">© 2024 ResolveTech</p>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
