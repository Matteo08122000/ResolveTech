import React from "react";
import ReactDOM from "react-dom";

const CustomAlert = ({ message, type, onClose }) => {
  const alertColors = {
    success: "bg-green-500 text-white",
    error: "bg-red-500 text-white",
    warning: "bg-yellow-500 text-black",
    info: "bg-blue-500 text-white",
  };

  return ReactDOM.createPortal(
    <div
      className={`fixed top-5 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-lg shadow-lg transition-opacity duration-300 ${
        alertColors[type] || "bg-gray-800 text-white"
      }`}
    >
      <div className="flex items-center space-x-3">
        <div>
          <strong>{type.charAt(0).toUpperCase() + type.slice(1)}</strong>:{" "}
          {message}
        </div>
        <button
          onClick={onClose}
          className="text-xl font-bold px-2 focus:outline-none"
        >
          &times;
        </button>
      </div>
    </div>,
    document.body
  );
};

export default CustomAlert;
