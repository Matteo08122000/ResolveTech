import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const TicketsTable = ({ onEdit, userRole }) => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [filters] = useState({ status: "", priority: "" });

  const fetchTickets = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Token non trovato. Effettua il login.");
        setLoading(false);
        return;
      }

      const queryString = new URLSearchParams({
        ...filters,
        page,
        limit,
      }).toString();

      const response = await fetch(
        `${import.meta.env.VITE_SERVER_BASE_URL}/tickets?${queryString}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Errore nella risposta del server");
      }

      const data = await response.json();
      setTickets(data.tickets || []);
    } catch (error) {
      console.error("Errore nel recupero dei ticket:", error);
      setError(error.message || "Errore sconosciuto");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (ticketId) => {
    try {
      const result = await Swal.fire({
        title: "Sei sicuro?",
        text: "Non potrai più recuperare questo ticket una volta eliminato!",
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
          `${import.meta.env.VITE_SERVER_BASE_URL}/tickets/delete/${ticketId}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Errore durante l'eliminazione del ticket");
        }

        setTickets((prev) => prev.filter((ticket) => ticket._id !== ticketId));

        Swal.fire(
          "Eliminato!",
          "Il ticket è stato eliminato con successo.",
          "success"
        );
      }
    } catch (error) {
      console.error("Errore durante l'eliminazione del ticket:", error);
      toast.error("Errore durante l'eliminazione del ticket");
    }
  };

  useEffect(() => {
    fetchTickets();

    const interval = setInterval(() => {
      fetchTickets();
    }, 2000);

    return () => clearInterval(interval);
  }, [page, limit, filters]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-purple-300"></div>
      </div>
    );

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100 text-gray-700 uppercase text-xs sm:text-sm leading-normal">
              <th className="py-2 px-3 sm:py-3 sm:px-6 text-left border border-gray-300">
                ID
              </th>
              <th className="py-2 px-3 sm:py-3 sm:px-6 text-left border border-gray-300">
                Titolo
              </th>
              <th className="py-2 px-3 sm:py-3 sm:px-6 text-left border border-gray-300">
                Descrizione
              </th>
              <th className="py-2 px-3 sm:py-3 sm:px-6 text-left border border-gray-300">
                Stato
              </th>
              <th className="py-2 px-3 sm:py-3 sm:px-6 text-left border border-gray-300">
                Priorità
              </th>
              {(userRole === "admin" || userRole === "technician") && (
                <th className="py-2 px-3 sm:py-3 sm:px-6 text-left border border-gray-300">
                  Azioni
                </th>
              )}
            </tr>
          </thead>

          <tbody className="text-gray-600 text-xs sm:text-sm font-light">
            {tickets.length > 0 ? (
              tickets.map((ticket) => (
                <tr
                  key={ticket._id}
                  className="border-b border-gray-200 hover:bg-gray-100"
                >
                  <td className="py-2 px-3 text-left">{ticket._id}</td>
                  <td className="py-2 px-3 text-left">{ticket.title}</td>
                  <td className="py-2 px-3 text-left">{ticket.description}</td>
                  <td className="py-2 px-3 text-center">
                    <span
                      className={`inline-block px-2 sm:px-3 py-1 rounded-full text-xs font-medium text-white ${
                        ticket.status === "Open"
                          ? "bg-blue-500"
                          : ticket.status === "In Progress"
                            ? "bg-yellow-500"
                            : ticket.status === "Resolved"
                              ? "bg-green-500"
                              : "bg-gray-500"
                      }`}
                    >
                      {ticket.status}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-center">
                    <span
                      className={`inline-block px-2 sm:px-3 py-1 rounded-full text-xs font-medium text-white ${
                        ticket.priority === "Low"
                          ? "bg-green-500"
                          : ticket.priority === "Medium"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                      }`}
                    >
                      {ticket.priority}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-center">
                    {(userRole === "admin" || userRole === "technician") && (
                      <>
                        <button
                          className="px-2 sm:px-3 py-1 bg-blue-500 text-white text-xs sm:text-sm font-medium rounded shadow-sm hover:bg-blue-700 transition-all duration-300 mr-2"
                          onClick={() => onEdit(ticket)}
                        >
                          Modifica
                        </button>
                        <button
                          className="px-2 sm:px-3 py-1 bg-red-500 text-white text-xs sm:text-sm font-medium rounded shadow-sm hover:bg-red-600 transition-all duration-300"
                          onClick={() => handleDelete(ticket._id)}
                        >
                          Elimina
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="py-3 px-3 text-center border border-gray-300 text-xs sm:text-sm"
                >
                  Nessun ticket disponibile
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-center mt-4">
        <button
          className="px-3 sm:px-4 py-2 bg-purple-600 text-white text-xs sm:text-sm font-medium rounded-md shadow-md hover:bg-purple-700 disabled:bg-gray-300 disabled:text-gray-500 transition-all duration-300"
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
        >
          Precedente
        </button>
        <span className="mx-4 text-black font-semibold text-xs sm:text-sm">
          Pagina {page}
        </span>
        <button
          className="px-3 sm:px-4 py-2 bg-purple-300 text-white text-xs sm:text-sm font-medium rounded-md shadow-md hover:bg-purple-500 transition-all duration-300"
          onClick={() => setPage((prev) => prev + 1)}
        >
          Successiva
        </button>
      </div>
    </div>
  );
};

export default TicketsTable;
