import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../../store/slice/themeSilce";
import logo from "../../assets/logo.png";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { theme } = useSelector((state) => state.theme);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userImage, setUserImage] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

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
        ></button>
      </div>

      <div className="flex-1 flex items-center justify-center flex-col md:flex-row md:justify-start text-center md:text-left">
        <div className="text-2xl pl-4 font-bold flex items-center hidden md:block cursor-pointer">
          ResolveTech
        </div>
        <div
          className="pl-4 text-1xl flex items-center font-medium text-purple-600 hidden md:block cursor-pointer"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          Benvenuto, {user?.name}!
        </div>
      </div>

      <div className="flex items-center gap-4 cursor-pointer">
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
    </div>
  );
};

export default Header;
