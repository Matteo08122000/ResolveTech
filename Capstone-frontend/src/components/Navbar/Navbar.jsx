import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../../store/slice/themeSilce";
import { logout } from "../../store/slice/authSlice";
import logo from "../../../src/assets/logo.png";
import clsx from "clsx";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { theme } = useSelector((state) => state.theme);
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

  const handleLogout = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_BASE_URL}/logout`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (response.ok) {
        dispatch(logout());
        navigate("/");
      } else {
        console.error("Logout error");
        alert("Logout error. Please try again later.");
      }
    } catch (error) {
      console.error("Network error:", error);
      alert("Network error. Please try again later.");
    }
  };

  return (
    <nav
      className={clsx(
        "p-2 shadow-md",
        theme === "light" ? "bg-purple-600 text-white" : "bg-black text-white"
      )}
    >
      <div className="max-w-8xl flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/">
            <img src={logo} alt="Logo" className="w-12 h-12 rounded-full" />
          </Link>
          <Link to="/" className="text-2xl font-semibold">
            ResolveTech
          </Link>
        </div>

        <ul className="hidden md:flex list-none items-center gap-10 ml-10">
          {["Blogs", "Services", "Contact", "About"].map((item, index) => (
            <li key={index}>
              <Link
                to={`/${item.toLowerCase()}`}
                className={clsx(
                  "relative font-bold uppercase text-sm transition",
                  theme === "light"
                    ? "text-white hover:text-black"
                    : "text-white hover:text-purple-400"
                )}
              >
                {item}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex items-center ml-auto space-x-4">
          <button
            className="p-2 bg-gray-700 text-white rounded-full hover:bg-gray-600 transition"
            onClick={handleToggleTheme}
          >
            {theme === "light" ? "🌙" : "🌞"}
          </button>

          {!isAuthenticated ? (
            <button
              className="flex items-center space-x-2"
              onClick={() => navigate("/login")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
                className="w-8 h-8"
              >
                <circle
                  cx="12"
                  cy="8"
                  r="4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <animate
                    attributeName="r"
                    values="4;4.5;4"
                    dur="1s"
                    repeatCount="indefinite"
                  />
                </circle>
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 20c0-4 4-6 8-6s8 2 8 6"
                >
                  <animate
                    attributeName="d"
                    dur="1.5s"
                    repeatCount="indefinite"
                    values="M4 20c0-4 4-6 8-6s8 2 8 6; M4 20c0-4.2 4-6.2 8-6.2s8 2.2 8 6.2; M4 20c0-4 4-6 8-6s8 2 8 6"
                  />
                </path>
              </svg>
            </button>
          ) : (
            <div className="relative">
              <button
                className="flex items-center space-x-2"
                onClick={handleLogout}
              >
                <span>{user?.name}</span>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
        <button
          className="block md:hidden p-2 bg-gray-700 text-white rounded-full"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        {isMenuOpen && (
          <div className="absolute top-16 right-4 bg-gray-800 text-white rounded-lg shadow-lg p-4 flex flex-col space-y-4 md:hidden z-50">
            <button
              className="p-2 bg-gray-700 text-white rounded-full hover:bg-gray-600 transition"
              onClick={handleToggleTheme}
            >
              {theme === "light" ? "🌙" : "🌞"}
            </button>
            {!isAuthenticated ? (
              <button
                className="flex items-center space-x-2"
                onClick={() => navigate("/login")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  className="w-8 h-8"
                >
                  <circle
                    cx="12"
                    cy="8"
                    r="4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <animate
                      attributeName="r"
                      values="4;4.5;4"
                      dur="1s"
                      repeatCount="indefinite"
                    />
                  </circle>
                  <path
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 20c0-4 4-6 8-6s8 2 8 6"
                  >
                    <animate
                      attributeName="d"
                      dur="1.5s"
                      repeatCount="indefinite"
                      values="M4 20c0-4 4-6 8-6s8 2 8 6; M4 20c0-4.2 4-6.2 8-6.2s8 2.2 8 6.2; M4 20c0-4 4-6 8-6s8 2 8 6"
                    />
                  </path>
                </svg>
              </button>
            ) : (
              <button
                className="p-2 bg-gray-700 text-white rounded-full hover:bg-gray-600"
                onClick={handleLogout}
              >
                Logout
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
