import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser, setLoading, setRedirecting } from "../store/slice/authSlice";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import Spinner from "../components/LoadingSpinner/LoadingSpinner";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState(null);

  const loading = useSelector((state) => state.auth.loading);
  const redirecting = useSelector((state) => state.auth.redirecting);

  if (loading || redirecting) {
    return (
      <div>
        <Spinner />
      </div>
    );
  }

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

      dispatch(setRedirecting(true));

      setTimeout(() => {
        navigate("/dashboard");
        dispatch(setRedirecting(false));
      }, 2500);
    } catch (error) {
      console.error("Login Error:", error.message);
      showAlert(error.message || "Login failed", "error");
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleGoogleLogin = async () => {
    try {
      dispatch(setLoading(true));
      window.location.href = `${import.meta.env.VITE_SERVER_BASE_URL}/auth/google`;
    } catch (error) {
      console.error("Google Login Error:", error.message);
      showAlert("Failed to initiate Google login", "error");
    } finally {
      setTimeout(() => {
        dispatch(setLoading(false));
      }, 1500);
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

          <button
            onClick={handleGoogleLogin}
            className="flex items-center justify-center w-full max-w-xs md:max-w-sm py-3 px-4 mt-4 bg-white text-black font-medium rounded-lg shadow-md hover:bg-gray-100 transition-all duration-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 md:w-6 md:h-6 mr-2"
              preserveAspectRatio="xMidYMid"
              viewBox="0 0 256 262"
              id="google"
            >
              <path
                fill="#4285F4"
                d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
              ></path>
              <path
                fill="#34A853"
                d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
              ></path>
              <path
                fill="#FBBC05"
                d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
              ></path>
              <path
                fill="#EB4335"
                d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
              ></path>
            </svg>
            <span className="text-sm md:text-base">Accedi con Google</span>
          </button>

          <div className="mt-4 text-center text-sm text-gray-600">
            Nuovo Utente?{" "}
            <Link to="/register" className="text-purple-600">
              Registrati
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
