import React, { useState, useEffect } from "react";
import Header from "../components/Header/Header";
import Sidebar from "../components/Sidebar/Sidebar";
import Spinner from "../components/LoadingSpinner/LoadingSpinner";
import Swal from "sweetalert2";

const SendEmailForm = () => {
  const [formData, setFormData] = useState({
    ticketId: "",
    senderEmail: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);

  const resetForm = () => {
    setFormData({
      ticketId: "",
      senderEmail: "",
      message: "",
    });
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsPageLoading(false);
    }, 500);

    return () => clearTimeout(timeout);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        Swal.fire({
          icon: "error",
          title: "Authentication Error",
          text: "User not authenticated. Please log in again.",
        });
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_SERVER_BASE_URL}/sendEmail`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        Swal.fire({
          icon: "error",
          title: "Error",
          text: errorData.message || "Something went wrong. Please try again.",
        });
      } else {
        const data = await response.json();
        Swal.fire({
          icon: "success",
          title: "Email Sent",
          text: data.message || "Your email has been sent successfully!",
        }).then(() => {
          resetForm();
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Unable to send email. Please check your connection and try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (isPageLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <div className="flex-shrink-0 shadow-md bg-white">
        <Header />
      </div>

      <div className="flex flex-grow overflow-hidden">
        <div className="hidden md:block w-64 bg-gray-800 text-white">
          <Sidebar />
        </div>

        <div className="flex-grow flex justify-center items-center px-4 py-6">
          <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
              Send Email
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label
                  htmlFor="ticketId"
                  className="block text-sm font-medium text-gray-700"
                >
                  Ticket ID
                </label>
                <input
                  type="text"
                  name="ticketId"
                  id="ticketId"
                  value={formData.ticketId}
                  onChange={handleChange}
                  required
                  placeholder="Enter the Ticket ID"
                  className="mt-1 p-3 border rounded-md w-full text-gray-700 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="senderEmail"
                  className="block text-sm font-medium text-gray-700"
                >
                  Sender Email
                </label>
                <input
                  type="email"
                  name="senderEmail"
                  id="senderEmail"
                  value={formData.senderEmail}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email"
                  className="mt-1 p-3 border rounded-md w-full text-gray-700 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700"
                >
                  Message
                </label>
                <textarea
                  name="message"
                  id="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  placeholder="Write your message here"
                  className="mt-1 p-3 border rounded-md w-full h-28 text-gray-700 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-purple-900 hover:bg-purple-600 text-white font-semibold py-3 rounded-md shadow-md transition-all"
              >
                Send Email
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SendEmailForm;
