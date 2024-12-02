import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setUser, setLoading } from "../store/slice/authSlice";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import CustomAlert from "../components/CustomAlert/CustomAlert";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState(null);

  const showAlert = (message, type = "info") => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 3000);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      showAlert("Please provide both email and password", "error");
      return;
    }

    dispatch(setLoading(true));
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_BASE_URL}/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }

      const data = await response.json();
      dispatch(setUser(data.user));
      localStorage.setItem("token", data.token);
      showAlert("Login successful! Redirecting...", "success");
      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      console.error("Login Error:", error.message);
      showAlert(error.message || "Login failed", "error");
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="absolute top-4 left-4">
        <Link to="/">
          <img src={logo} alt="Logo" className="w-12 h-12 rounded-full" />
        </Link>
      </div>

      <div className="hidden md:flex flex-1 bg-gradient-to-r from-purple-500 to-black items-center justify-center text-white">
        <div className="text-center px-8">
          <h1 className="text-5xl font-bold mb-4">Bentornato!</h1>
          <p className="text-lg">Perfavore Accedi per continuare.</p>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center bg-gray-100">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Accedi</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
          >
            <div className="mb-4">
              <label className="block text-gray-700 text-sm mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="username@gmail.com"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-purple-600 text-white rounded-lg shadow-md hover:bg-purple-700 transition"
            >
              Accedi
            </button>
          </form>
          <div className="mt-4 text-center text-sm text-gray-600">
            Nuovo Utente?{" "}
            <Link to="/register" className="text-purple-600">
              Registrati
            </Link>
          </div>
        </div>
      </div>

      {alert && (
        <CustomAlert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}
    </div>
  );
};

export default LoginPage;
