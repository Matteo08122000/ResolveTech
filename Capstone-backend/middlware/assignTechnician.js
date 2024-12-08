const Ticketsmodel = require("../models/ticketsmodel");
const Usersmodel = require("../models/Usersmodel");

const assignTechnician = async (req, res, next) => {
  const { ticketId, technicianId } = req.body;

  if (!ticketId || !technicianId) {
    return res.status(400).send({
      statusCode: 400,
      message: "Ticket ID and Technician ID are required.",
    });
  }

  try {
    const ticket = await Ticketsmodel.findById(ticketId);
    const technician = await Usersmodel.findById(technicianId);

    if (!ticket) {
      return res.status(404).send({
        statusCode: 404,
        message: "Ticket not found",
      });
    }

    if (!technician || technician.role !== "technician") {
      return res.status(400).send({
        statusCode: 400,
        message: "Technician not found or invalid role",
      });
    }

    if (ticket.assignedTo) {
      return res.status(400).send({
        statusCode: 400,
        message: "Ticket is already assigned to another technician",
      });
    }

    ticket.assignedTo = technician._id;
    const updatedTicket = await ticket.save();

    res.status(200).send({
      statusCode: 200,
      message: "Technician assigned successfully",
      ticket: updatedTicket,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      statusCode: 500,
      message: "An error occurred while assigning technician",
    });
  }
};

module.exports = assignTechnician;
