import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setError } from "../store/slice/authSlice";
import { useNavigate, Link } from "react-router-dom";
import CustomAlert from "../components/CustomAlert/CustomAlert";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    gender: "not specified",
    dob: "",
  });

  const { loading, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [alert, setAlert] = useState(null);

  const showAlert = (message, type = "info") => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 3000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_BASE_URL}/users/create`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        showAlert(
          "Registration successful! Redirecting to login...",
          "success"
        );
        setTimeout(() => navigate("/login"), 2000);
      } else {
        const data = await response.json();
        showAlert(data.message || "Registration failed", "error");
        dispatch(setError(data.message || "Registration failed"));
      }
    } catch (err) {
      showAlert("Network error. Please try again later.", "error");
      dispatch(setError("Network error. Please try again later."));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden md:flex flex-1 bg-gradient-to-r from-black to-purple-500 items-center justify-center text-white">
        <div className="text-center px-8">
          <h1 className="text-5xl font-bold mb-4">Unisciti a noi oggi!</h1>
          <p className="text-lg">Crea il tuo account per iniziare.</p>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center bg-gray-100">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Registrati</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="example@gmail.com"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="********"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                required
                minLength={6}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm mb-2">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
              >
                <option value="not specified">Not Specified</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm mb-2">
                Date of Birth
              </label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-purple-600 text-white rounded-lg shadow-md hover:bg-purple-700 transition"
              disabled={loading}
            >
              {loading ? "Registering..." : "Registrati"}
            </button>
          </form>
          <div className="mt-4 text-center text-sm text-gray-600">
            Hai già un account?{" "}
            <Link to="/login" className="text-purple-600">
              Accedi
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

export default Register;
