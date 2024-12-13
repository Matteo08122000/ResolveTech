import React from "react";
import backgroundImage from "../../assets/cat black1.jpg";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gray-800 flex flex-col justify-center items-center relative">
      <div
        className="absolute inset-0 bg-contain bg-center bg-no-repeat opacity-100"
        style={{
          backgroundImage: `url(${backgroundImage})`,
        }}
      ></div>

      <div className="z-10 bg-black bg-opacity-70 p-6 rounded-lg text-center max-w-lg">
        <h1 className="text-6xl font-bold text-white">404</h1>
        <h2 className="text-3xl font-semibold text-white mt-4">
          Pagina non trovata
        </h2>
        <p className="text-white text-lg mt-4">
          Il gattino è qui, ma la pagina che cerchi non lo è.
        </p>
        <button
          onClick={() => (window.location.href = "/")}
          className="mt-6 px-6 py-3 text-lg font-medium text-purple-700 bg-white rounded-lg shadow-md hover:bg-gray-100 hover:shadow-lg transition duration-300"
        >
          Torna alla Home
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;
