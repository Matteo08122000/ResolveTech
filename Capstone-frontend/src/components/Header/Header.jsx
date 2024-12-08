import React, { useState, useEffect } from "react";
import { FaSearch, FaBell, FaBars, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../../store/slice/themeSilce";
import logo from "../../assets/logo.png";

const Header = () => {
  const dispatch = useDispatch();
  const { theme } = useSelector((state) => state.theme);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const [userImage, setUserImage] = useState("");

  useEffect(() => {
    const fetchRandomImage = async () => {
      try {
        const response = await fetch("https://randomuser.me/api/");
        const data = await response.json();
        setUserImage(data.results[0].picture.medium);
      } catch (error) {
        console.error("Error fetching random user image:", error);
      }
    };
    fetchRandomImage();
  }, []);

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  return (
    <div
      className={`sticky top-0 z-50 flex items-center justify-between p-4 shadow-md ${
        theme === "light" ? "bg-white text-black" : "bg-black text-white"
      }`}
    >
      <div className="flex items-center">
        <Link to="/dashboard">
          <img src={logo} alt="Logo" className="w-12 h-12 rounded-full" />
        </Link>
        <button
          className="md:hidden ml-4 p-2 rounded-full"
          onClick={toggleMenu}
        >
          {menuOpen ? (
            <FaTimes size={20} className="text-gray-500" />
          ) : (
            <FaBars size={20} className="text-gray-500" />
          )}
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center flex-col md:flex-row md:justify-start text-center md:text-left">
        <div className="text-2xl pl-4 font-bold flex items-center hidden md:block">
          ResolveTech
        </div>
        <div
          className="pl-4 text-1xl flex items-center font-medium text-purple-600 hidden md:block"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          Benvenuto, {user?.name || "Utente"}!
        </div>
      </div>

      <div className="flex items-center gap-4">
        <FaBell className="text-gray-500 md:block" />
        <img
          src={userImage || "https://via.placeholder.com/40"}
          alt="Profile"
          className="w-10 h-10 rounded-full hidden md:block"
        />
        <button
          className="p-2 rounded-full hover:opacity-80 transition"
          onClick={handleToggleTheme}
        >
          {theme === "light" ? "🌙" : "🌞"}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div
          className={`absolute top-16 left-0 w-full p-4 bg-gray-800 text-white flex flex-col gap-4 md:hidden`}
        >
          <div className="flex items-center gap-2">
            <FaSearch className="text-gray-500" />
            <input
              type="text"
              placeholder="Search..."
              className="p-2 border rounded-lg bg-gray-700 text-white outline-none w-full"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
