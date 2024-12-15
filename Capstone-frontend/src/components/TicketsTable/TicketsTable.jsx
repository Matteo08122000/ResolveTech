import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const TicketsTable = ({ onEdit, onCreate, userRole }) => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5;

  const fetchTickets = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Token non trovato. Effettua il login.");
        setLoading(false);
        return;
      }

      const queryString = new URLSearchParams({
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
      setTotalPages(Math.ceil((data.totalTickets || 0) / limit));
    } catch (error) {
      console.error("Errore nel recupero dei ticket:", error);
      setError(error.message || "Errore sconosciuto");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = (newTicket) => {
    setTickets((prevTickets) => [newTicket, ...prevTickets]);
    toast.success("Ticket creato con successo!");
  };

  const handleEdit = async (updatedTicket) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token non trovato.");

      const response = await fetch(
        `${import.meta.env.VITE_SERVER_BASE_URL}/tickets/${updatedTicket._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedTicket),
        }
      );

      if (!response.ok) {
        throw new Error("Errore nell'aggiornamento del ticket");
      }

      setTickets((prevTickets) =>
        prevTickets.map((ticket) =>
          ticket._id === updatedTicket._id ? updatedTicket : ticket
        )
      );
      toast.success("Ticket aggiornato con successo!");
    } catch (error) {
      toast.error("Errore durante l'aggiornamento del ticket.");
    }
  };
  useEffect(() => {
    fetchTickets();
  }, [page, tickets]);

  const handleDelete = async (ticketId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Token non trovato. Effettua il login.");
      return;
    }

    const confirmDelete = await Swal.fire({
      title: "Sei sicuro?",
      text: "Non potrai recuperare questo ticket!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sì, elimina!",
      cancelButtonText: "Annulla",
    });

    if (confirmDelete.isConfirmed) {
      try {
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
          throw new Error("Errore nell'eliminazione del ticket");
        }

        setTickets((prevTickets) =>
          prevTickets.filter((ticket) => ticket._id !== ticketId)
        );

        Swal.fire("Eliminato!", "Il ticket è stato eliminato.", "success");
      } catch (error) {
        console.error("Errore nell'eliminazione del ticket:", error);
        Swal.fire(
          "Errore",
          "Non è stato possibile eliminare il ticket.",
          "error"
        );
      }
    }
  };

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
              <th className="py-2 px-3 text-left border">ID</th>
              <th className="py-2 px-3 text-left border">Titolo</th>
              <th className="py-2 px-3 text-left border">Descrizione</th>
              <th className="py-2 px-3 text-left border">Stato</th>
              <th className="py-2 px-3 text-left border">Priorità</th>
              <th className="py-2 px-3 text-left border">Creato da</th>
              <th className="py-2 px-3 text-left border">Assegnato a</th>
              {userRole === "admin" || userRole === "technician" ? (
                <th className="py-2 px-3 text-left border">Azioni</th>
              ) : null}
            </tr>
          </thead>
          <tbody>
            {tickets.length > 0 ? (
              tickets.map((ticket) => (
                <tr key={ticket._id} className="border-b hover:bg-gray-100">
                  <td className="py-2 px-3 border">{ticket._id}</td>
                  <td className="py-2 px-3 border">{ticket.title}</td>
                  <td className="py-2 px-3 border">{ticket.description}</td>
                  <td className="py-2 px-3 text-center border">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-medium text-white ${
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
                  <td className="py-2 px-3 text-center border">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-medium text-white ${
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
                  <td className="py-2 px-3 border">
                    {ticket.createdBy?.name || ticket.createdBy?.email || "N/A"}
                  </td>
                  <td className="py-2 px-3 border">
                    {ticket.assignedTo?.name ||
                      ticket.assignedTo?.email ||
                      "Non assegnato"}
                  </td>

                  {userRole === "admin" || userRole === "technician" ? (
                    <td className="py-2 px-3 text-center border">
                      <button
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-700 mr-2"
                        onClick={() => onEdit(ticket)}
                      >
                        Modifica
                      </button>
                      <button
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                        onClick={() => handleDelete(ticket._id)}
                      >
                        Elimina
                      </button>
                    </td>
                  ) : null}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={
                    userRole === "admin" || userRole === "technician" ? 8 : 7
                  }
                  className="py-3 px-3 text-center border"
                >
                  Nessun ticket disponibile
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex flex-col sm:flex-row items-center justify-center mt-4 space-y-2 sm:space-y-0 sm:space-x-4">
        <button
          className="px-2 sm:px-4 py-2 bg-purple-600 text-white text-xs sm:text-sm font-medium rounded-md shadow-md hover:bg-purple-700 disabled:bg-gray-300 disabled:text-gray-500 transition-all duration-300 w-full sm:w-auto"
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
        >
          Precedente
        </button>
        <span className="text-black font-semibold text-xs sm:text-sm">
          Pagina {page} di {totalPages}
        </span>
        <button
          className="px-2 sm:px-4 py-2 bg-purple-300 text-white text-xs sm:text-sm font-medium rounded-md shadow-md hover:bg-purple-500 transition-all duration-300 w-full sm:w-auto"
          onClick={() => setPage((prev) => prev + 1)}
          disabled={page === totalPages}
        >
          Successiva
        </button>
      </div>
    </div>
  );
};

export default TicketsTable;
