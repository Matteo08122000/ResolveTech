import React, { useState, useEffect } from "react";

const EditTicketModal = ({ isOpen, onClose, onSubmit, ticket }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "Low",
    status: "Open",
  });

  useEffect(() => {
    if (ticket) {
      setFormData({
        title: ticket.title || "",
        description: ticket.description || "",
        priority: ticket.priority || "Low",
        status: ticket.status || "Open",
      });
    }
  }, [ticket]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(ticket._id, formData); 
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-md shadow-md w-11/12 sm:w-96">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          Modifica Ticket
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
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
            >
              Annulla
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Salva
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTicketModal;
