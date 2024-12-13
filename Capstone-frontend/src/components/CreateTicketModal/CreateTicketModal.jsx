import React, { useState } from "react";

const CreateTicketModal = ({ isOpen, onClose, onSubmit, userRole }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "Low",
    status: "Open",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-md shadow-md w-11/12 sm:w-96">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          Crea Nuovo Ticket
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Titolo
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Descrizione
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              required
            />
          </div>
          {(userRole === "admin" || userRole === "technician") && (
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Priorità
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              >
                <option value="Low">Bassa</option>
                <option value="Medium">Media</option>
                <option value="High">Alta</option>
              </select>
            </div>
          )}
          {(userRole === "admin" || userRole === "technician") && (
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Stato
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              >
                <option value="Open">Aperto</option>
                <option value="In Progress">In corso</option>
                <option value="Resolved">Risolto</option>
                <option value="Closed">Chiuso</option>
              </select>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-[#c82333] rounded-md hover:bg-[#c82333] text-white"
            >
              Annulla
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700"
            >
              Crea
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTicketModal;
