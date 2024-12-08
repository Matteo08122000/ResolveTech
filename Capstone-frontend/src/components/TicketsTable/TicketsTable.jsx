import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const TicketsTable = ({ onEdit }) => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [filters, setFilters] = useState({ status: "", priority: "" });

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
    if (!window.confirm("Sei sicuro di voler eliminare questo ticket?")) return;

    try {
      const token = localStorage.getItem("token");
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
      toast.success("Ticket eliminato con successo!");
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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500"></div>
      </div>
    );

  if (error)
    return (
      <p className="text-center text-red-600 font-semibold">Errore: {error}</p>
    );

  return (
    <div>
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          name="status"
          placeholder="Status"
          value={filters.status}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, status: e.target.value }))
          }
          className="border p-2 rounded w-full"
        />
        <input
          type="text"
          name="priority"
          placeholder="Priority"
          value={filters.priority}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, priority: e.target.value }))
          }
          className="border p-2 rounded w-full"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100 text-gray-700 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left border border-gray-300">ID</th>
              <th className="py-3 px-6 text-left border border-gray-300">
                Titolo
              </th>
              <th className="py-3 px-6 text-left border border-gray-300">
                Descrizione
              </th>
              <th className="py-3 px-6 text-left border border-gray-300">
                Status
              </th>
              <th className="py-3 px-6 text-left border border-gray-300">
                Priorità
              </th>
              <th className="py-3 px-6 text-left border border-gray-300">
                Creato
              </th>
              <th className="py-3 px-6 text-left border border-gray-300">
                Azioni
              </th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {tickets.length > 0 ? (
              tickets.map((ticket) => (
                <tr
                  key={ticket._id}
                  className="border-b border-gray-200 hover:bg-gray-100"
                >
                  <td className="py-3 px-6 text-left border border-gray-300">
                    {ticket._id}
                  </td>
                  <td className="py-3 px-6 text-left border border-gray-300">
                    {ticket.title || "Non disponibile"}
                  </td>
                  <td className="py-3 px-6 text-left border border-gray-300">
                    {ticket.description || "Non disponibile"}
                  </td>
                  <td className="py-3 px-6 text-left border border-gray-300">
                    {ticket.status || "Non disponibile"}
                  </td>
                  <td className="py-3 px-6 text-left border border-gray-300">
                    {ticket.priority || "Non disponibile"}
                  </td>
                  <td className="py-3 px-6 text-left border border-gray-300">
                    {ticket.createdAt
                      ? new Date(ticket.createdAt).toLocaleDateString()
                      : "Non disponibile"}
                  </td>
                  <td className="py-3 px-6 text-left border border-gray-300">
                    <button
                      className="px-2 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 mr-2"
                      onClick={() => onEdit(ticket)}
                    >
                      Modifica
                    </button>
                    <button
                      className="px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                      onClick={() => handleDelete(ticket._id)}
                    >
                      Elimina
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="py-3 px-6 text-center border border-gray-300"
                >
                  Nessun ticket disponibile
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center mt-4">
        <button
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 disabled:bg-gray-200 disabled:text-gray-500"
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
        >
          Precedente
        </button>
        <span className="mx-4 text-gray-700">Pagina {page}</span>
        <button
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
          onClick={() => setPage((prev) => prev + 1)}
        >
          Successiva
        </button>
      </div>
    </div>
  );
};

export default TicketsTable;
