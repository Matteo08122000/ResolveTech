import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import Register from "./pages/Register";
import ProtectedRoutes from "./protectedRoutes/protectedRoutes";
import SuccessPage from "./pages/SuccessPage";
import NotFoundPage from "./components/NotFoundPage/NotFoundPage";
import Dashboard from "./pages/Dashboard";
import TicketPage from "./pages/TicketPage";
import UserPage from "./pages/UserPage";
import DepartmentPage from "./pages/DepartmentPage";
import EmailPage from "./pages/EmailPage";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<Register />} />
      <Route path="/success" element={<SuccessPage />} />
      <Route element={<ProtectedRoutes />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/tickets" element={<TicketPage />} />
        <Route path="/users" element={<UserPage />} />
        <Route path="/departments" element={<DepartmentPage />} />
        <Route path="/email" element={<EmailPage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default App;
