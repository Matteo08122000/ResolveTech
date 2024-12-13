import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Header from "../components/Header/Header";
import Spinner from "../components/LoadingSpinner/LoadingSpinner";
import Sidebar from "../components/Sidebar/Sidebar";
import DepartmentsModal from "../components/DepartmentsModal/DepartmentsModal";

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [techniciansList, setTechniciansList] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser?.role === "admin") {
      setIsAdmin(true);
    }
  }, []);

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_BASE_URL}/departments`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (!response.ok) {
        throw new Error("Errore durante il caricamento dei dipartimenti.");
      }

      const data = await response.json();
      setDepartments(data.departments || []);
    } catch (err) {
      setError(err.message || "Errore durante il caricamento dei dipartimenti.");
    } finally {
      setLoading(false);
    }
  };

  const fetchTechnicians = async () => {
    if (!isAdmin) return;
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_BASE_URL}/users/technician`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      if (!response.ok) {
        throw new Error("Errore durante il caricamento dei tecnici.");
      }
      const data = await response.json();
      setTechniciansList(data.technicians || []);
    } catch (err) {
      setError(err.message || "Errore durante il caricamento dei tecnici.");
    }
  };

  useEffect(() => {
    fetchDepartments();
    fetchTechnicians();
  }, [isAdmin]);

  const openModal = (department = null) => {
    setSelectedDepartment(department);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDepartment(null);
  };

  const saveDepartment = async (departmentData) => {
    try {
      const formData = new FormData();
      formData.append("name", departmentData.name);
      formData.append("description", departmentData.description);
      formData.append(
        "technicians",
        JSON.stringify(departmentData.technicians || [])
      );

      const url = departmentData.id
        ? `${import.meta.env.VITE_SERVER_BASE_URL}/departments/update/${departmentData.id}`
        : `${import.meta.env.VITE_SERVER_BASE_URL}/departments/create`;

      const method = departmentData.id ? "PATCH" : "POST";
      const response = await fetch(url, {
        method,
        body: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Errore ${response.status}: ${errorText || "Errore sconosciuto"}`
        );
      }
      await fetchDepartments();
      closeModal();
    } catch (err) {
      console.error("Error saving department:", err.message);
      setError(err.message || "Errore durante il salvataggio del dipartimento.");
    }
  };

  const deleteDepartment = async (id) => {
    if (!isAdmin) return;

    try {
      const result = await Swal.fire({
        title: "Sei sicuro?",
        text: "Non potrai più recuperare questo dipartimento una volta eliminato!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sì, elimina!",
        cancelButtonText: "Annulla",
      });

      if (result.isConfirmed) {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Token non trovato. Effettua il login.");
        }

        const response = await fetch(
          `${import.meta.env.VITE_SERVER_BASE_URL}/departments/delete/${id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Errore durante l'eliminazione del dipartimento.");
        }

        await fetchDepartments();

        Swal.fire(
          "Eliminato!",
          "Il dipartimento è stato eliminato con successo.",
          "success"
        );
      }
    } catch (err) {
      console.error("Errore durante l'eliminazione del dipartimento:", err);
      Swal.fire("Errore", err.message || "Errore durante l'eliminazione.", "error");
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <div className="flex-shrink-0 shadow-md">
        <Header />
      </div>
      <div className="flex flex-grow overflow-hidden">
        <div className="hidden md:block w-64 bg-gray-800 text-white">
          <Sidebar />
        </div>
        <div className="flex-grow p-4 md:p-6 overflow-y-auto">
          <h1 className="text-xl md:text-2xl font-bold mb-4">
            Gestione Dipartimenti
          </h1>

          {error && <p className="text-red-500">{error}</p>}

          <div className="overflow-x-auto bg-white shadow-md rounded-lg">
            <table className="min-w-full border-collapse border border-gray-200 text-sm md:text-base">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-2 md:px-4 py-2">Nome</th>
                  <th className="border px-2 md:px-4 py-2">Descrizione</th>
                  {isAdmin && (
                    <th className="border px-2 md:px-4 py-2">Azioni</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {departments.length > 0 ? (
                  departments.map((dept) => (
                    <tr key={dept._id} className="hover:bg-gray-50">
                      <td className="border px-2 md:px-4 py-2">{dept.name}</td>
                      <td className="border px-2 md:px-4 py-2">
                        {dept.description}
                      </td>
                      {isAdmin && (
                        <td className="border px-2 md:px-4 py-2">
                          <button
                            onClick={() => openModal(dept)}
                            className="bg-yellow-500 text-white px-2 py-1 text-xs md:text-sm rounded-lg hover:bg-yellow-600 mr-2"
                          >
                            Modifica
                          </button>
                          <button
                            onClick={() => deleteDepartment(dept._id)}
                            className="bg-red-500 text-white px-2 py-1 text-xs md:text-sm rounded-lg hover:bg-red-600"
                          >
                            Elimina
                          </button>
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={isAdmin ? 3 : 2}
                      className="text-center py-4 text-gray-500"
                    >
                      Nessun dipartimento trovato.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {isAdmin && (
            <div className="mt-4">
              <button
                onClick={() => openModal()}
                className="bg-purple-500 text-white px-4 py-2 text-sm md:text-base rounded-lg shadow hover:bg-purple-800 transition"
              >
                Aggiungi Dipartimento
              </button>
            </div>
          )}

          {isModalOpen && (
            <DepartmentsModal
              department={selectedDepartment}
              techniciansList={techniciansList}
              onClose={closeModal}
              onSave={saveDepartment}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Departments;
