import Ticketsmodel from "../models/Ticketsmodel";

const assignTicketToTechnician = async (req, res) => {
  try {
    const { ticketId, assignedTo } = req.body;

    if (req.user.role !== "admin") {
      return res.status(403).json({
        statusCode: 403,
        message: "Non authorized",
      });
    }

    const updatedTicket = await Ticketsmodel.findByIdAndUpdate(
      ticketId,
      { assignedTo },
      { new: true }
    ).populate("assignedTo", "name email");

    if (!updatedTicket) {
      return res.status(404).json({
        statusCode: 404,
        message: "Ticket not found",
      });
    }

    return res.status(200).json({
      statusCode: 200,
      message: "Ticket assegned to technician",
      updatedTicket,
    });
  } catch (error) {
    console.error("Errore durante l'assegnazione del ticket:", error);
    return res.status(500).json({
      statusCode: 500,
      message: "Error  server",
    });
  }
};

export default assignTicketToTechnician;
