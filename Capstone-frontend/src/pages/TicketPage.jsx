import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar/Sidebar";
import Header from "../components/Header/Header";
import TicketsTable from "../components/TicketsTable/TicketsTable";
import CreateTicketModal from "../components/CreateTicketModal/CreateTicketModal";
import EditTicketModal from "../components/EditTicketModal/EditTiketModal";
import Spinner from "../components/LoadingSpinner/LoadingSpinner";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TicketPage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const decodedToken = JSON.parse(atob(token.split(".")[1]));
          setUserRole(decodedToken.role);
          setCurrentUserId(decodedToken.userId);
        } else {
          console.error("Token non trovato.");
        }
      } catch (error) {
        console.error("Errore nel recuperare i dettagli utente:", error);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 500);
      }
    };

    fetchUserDetails();
  }, []);

  const handleCreateTicket = async (ticketData) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_BASE_URL}/tickets/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(ticketData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Errore durante la creazione del ticket"
        );
      }

      toast.success("Ticket creato con successo!");
      setIsCreateModalOpen(false);
    } catch (error) {
      toast.error("Errore: " + error.message);
    }
  };

  const handleEditSubmit = async (ticketId, ticketData) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_BASE_URL}/tickets/update/${ticketId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(ticketData),
        }
      );

      if (!response.ok)
        throw new Error("Errore durante l'aggiornamento del ticket");

      toast.success("Ticket aggiornato con successo!");
      setIsEditModalOpen(false);
    } catch (error) {
      toast.error("Errore: " + error.message);
    }
  };

  const handleEdit = (ticket) => {
    setSelectedTicket(ticket);
    setIsEditModalOpen(true);
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

        <div className="flex-grow bg-white p-4 md:p-6 overflow-y-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <h1 className="text-xl md:text-2xl font-semibold text-gray-700">
              Gestione Ticket
            </h1>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 py-2 md:px-5 md:py-3 bg-purple-300 text-white font-medium rounded-lg shadow-md hover:bg-purple-500 transition-all duration-300"
            >
              Crea Nuovo Ticket
            </button>
          </div>

          <div className="overflow-x-auto">
            <TicketsTable
              onEdit={handleEdit}
              userRole={userRole}
              currentUserId={currentUserId}
            />
          </div>

          <CreateTicketModal
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            onSubmit={handleCreateTicket}
            ticket={selectedTicket}
          />

          <EditTicketModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            onSubmit={handleEditSubmit}
            ticket={selectedTicket}
          />
        </div>
      </div>
    </div>
  );
};

export default TicketPage;
