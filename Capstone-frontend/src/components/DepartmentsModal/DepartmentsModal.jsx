import React, { useState } from "react";

const DepartmentsModal = ({ department, techniciansList, onClose, onSave }) => {
  const [name, setName] = useState(department?.name || "");
  const [description, setDescription] = useState(department?.description || "");
  const [image] = useState(null);
  const [selectedTechnicians, setSelectedTechnicians] = useState(
    department?.technicians || []
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(
      {
        id: department?._id,
        name,
        description,
        technicians: selectedTechnicians,
      },
      image
    );
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">
          {department ? "Modifica Dipartimento" : "Aggiungi Dipartimento"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Nome Dipartimento</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Descrizione</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none"
              required
            />
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-400 text-white rounded-lg"
            >
              Annulla
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg"
            >
              Salva
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DepartmentsModal;
