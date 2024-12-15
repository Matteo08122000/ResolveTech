import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../store/slice/authSlice";

const SuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const parseJwt = (token) => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error("Invalid JWT token:", error);
      return null;
    }
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get("token");

    if (token && token.split(".").length === 3) {
      localStorage.setItem("token", token);
      const user = parseJwt(token);
      if (user && user.name) {
        dispatch(setUser({ token, ...user }));
        navigate("/dashboard");
      } else {
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [location, navigate, dispatch]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-xl font-bold">Reindirizzamento in corso...</p>
    </div>
  );
};

export default SuccessPage;
