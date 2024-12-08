import React, { useState } from "react";
import Sidebar from "../components/Sidebar/Sidebar";
import Header from "../components/Header/Header";
import TicketsTable from "../components/TicketsTable/TicketsTable";
import CreateTicketModal from "../components/CreateTicketModal/CreateTicketModal";
import EditTicketModal from "../components/EditTicketModal/EditTiketModal";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TicketPage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

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

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <div className="flex-shrink-0 shadow-md">
        <Header />
      </div>

      <div className="flex flex-grow overflow-hidden">
        <div className="w-64 bg-gray-800 text-white hidden md:block">
          <Sidebar />
        </div>

        <div className="flex-grow bg-white p-4 md:p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-700">
              Gestione Ticket
            </h1>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all"
            >
              Crea Nuovo Ticket
            </button>
          </div>

          <TicketsTable onEdit={handleEdit} />

          <CreateTicketModal
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            onSubmit={handleCreateTicket}
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
