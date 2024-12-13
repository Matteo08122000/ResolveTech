import React from "react";

const Spinner = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="relative w-20 h-20 rounded-full">
        <div className="absolute inset-0 w-full h-full rounded-full animate-spin bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500"></div>
        <div className="absolute inset-0 w-[85%] h-[85%] m-auto bg-white rounded-full"></div>
      </div>
    </div>
  );
};

export default Spinner;
