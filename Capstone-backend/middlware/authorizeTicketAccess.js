const Ticketsmodel = require("../models/Ticketsmodel");

const authorizeTicketAcess = async (req, res, next) => {
  const { ticketId } = req.params;
  try {
    const ticket = await Ticketsmodel.findById(ticketId);
    if (!ticket) {
      return res.status(404).send({
        statusCode: 404,
        message: "Ticket not found",
      });
    }

    const userRole = req.user.role;

    if (userRole === "admin" || userRole === "technician") {
      req.ticket = ticket;
      return next();
    }

    return res.status(403).send({
      statusCode: 403,
      message: "Access denied. Invalid role",
    });
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      message: "An error occurred while validating ticket access",
    });
  }
};

module.exports = authorizeTicketAcess;
