const TicketsModel = require("../models/Ticketsmodel");

const restrictFieldsForUser = async (req, res, next) => {
  const { role, id: userId } = req.user;
  const { ticketId } = req.params;

  try {
    if (req.method === "POST") {
      if (role !== "admin" && role !== "technician") {
        if ("priority" in req.body || "status" in req.body) {
          return res.status(400).json({
            statusCode: 400,
            message:
              "Non puoi specificare i campi 'status' o 'priority' durante la creazione del ticket",
          });
        }

        req.body.priority = "Low";
        req.body.status = "Open";
        req.body.creatorId = userId;
      }
    } else if (req.method === "PATCH") {
      const ticket = await TicketsModel.findById(ticketId);

      if (!ticket) {
        return res.status(404).json({
          statusCode: 404,
          message: "Ticket non trovato",
        });
      }

      if (role !== "admin" && role !== "technician") {
        if (ticket.creatorId.toString() !== userId) {
          return res.status(403).json({
            statusCode: 403,
            message: "Non sei autorizzato a modificare questo ticket",
          });
        }

        const allowedUpdates = ["title", "description"];
        Object.keys(req.body).forEach((field) => {
          if (!allowedUpdates.includes(field)) {
            delete req.body[field];
          }
        });
      }
    } else if (req.method === "DELETE") {
      if (role !== "admin" && role !== "technician") {
        return res.status(403).json({
          statusCode: 403,
          message: "Non sei autorizzato a eliminare i ticket",
        });
      }
    }

    next();
  } catch (error) {
    console.error("Errore durante la verifica del ticket:", error);
    return res.status(500).json({
      statusCode: 500,
      message: "Errore interno del server",
    });
  }
};

module.exports = restrictFieldsForUser;
