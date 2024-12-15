const express = require("express");
const tickets = express.Router();
const Ticketsmodel = require("../models/Ticketsmodel");
const authorizeTicketAcess = require("../middlware/authorizeTicketAccess");
const assignTechnician = require("../middlware/assignTechnician");
const verifyToken = require("../middlware/VerifyToken");
const validateTicketFields = require("../middlware/validateTicketFields");
const restrictFieldsForUser = require("../middlware/restrictFieldsForUser");

tickets.get("/tickets", verifyToken, async (req, res) => {
  try {
    const {
      status,
      priority,
      department,
      title,
      page = 1,
      limit = 10,
    } = req.query;

    const filters = {};
    if (status) filters.status = { $regex: status, $options: "i" };
    if (priority) filters.priority = { $regex: priority, $options: "i" };
    if (department) filters.department = department;
    if (title) filters.title = { $regex: title, $options: "i" };

    const skip = (page - 1) * limit;

    const tickets = await Ticketsmodel.find(filters)
      .skip(skip)
      .limit(parseInt(limit))
      .populate("createdBy", "name email")
      .populate("assignedTo", "name email")
      .populate("department", "name")
      .exec()
      .catch((err) => {
        console.error("Error populating data:", err.message);
        return [];
      });

    const totalTickets = await Ticketsmodel.countDocuments(filters);

    res.status(200).send({
      statusCode: 200,
      message: "Tickets found",
      tickets,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalTickets / limit),
        totalTickets,
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    console.error("Error fetching tickets:", error);
    res.status(500).send({
      statusCode: 500,
      message: "Internal server error",
    });
  }
});

tickets.post(
  "/tickets/create",
  validateTicketFields,
  verifyToken,
  async (req, res) => {
    try {
      const { title, description, status, priority, assignedTo, department } =
        req.body;

      const newTicket = new Ticketsmodel({
        title,
        description,
        status,
        priority,
        createdBy: req.user._id,
        assignedTo: assignedTo || null,
        department: department || null,
      });

      const ticket = await newTicket.save();

      res.status(201).send({
        statusCode: 201,
        message: "Ticket creato con successo",
        ticket,
      });
    } catch (error) {
      res.status(500).send({
        statusCode: 500,
        message: "Errore interno del server",
        error: error.message,
      });
    }
  }
);

tickets.get("/tickets/assigned-to/:userId", verifyToken, async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).send({
        statusCode: 400,
        message: "Invalid User ID",
      });
    }

    const tickets = await Ticketsmodel.find({ assignedTo: userId })
      .populate("createdBy", "name email")
      .populate("assignedTo", "name email")
      .populate("department", "name");

    if (tickets.length === 0) {
      return res.status(404).send({
        statusCode: 404,
        message: "No tickets found for this user.",
      });
    }

    res.status(200).send({
      statusCode: 200,
      message: "Tickets retrieved successfully",
      tickets,
    });
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      message: "Internal server error",
      error,
    });
  }
});

tickets.patch(
  "/tickets/update/:ticketId",
  verifyToken,
  restrictFieldsForUser,
  validateTicketFields,
  async (req, res) => {
    try {
      const { ticketId } = req.params;
      const updates = req.body;

      const updatedTicket = await Ticketsmodel.findByIdAndUpdate(
        ticketId,
        updates,
        {
          new: true,
        }
      )
        .populate("createdBy", "name email")
        .populate("assignedTo", "name email")
        .populate("department", "name");

      if (!updatedTicket) {
        return res.status(404).send({
          statusCode: 404,
          message: "Ticket not found",
        });
      }

      res.status(200).send({
        statusCode: 200,
        message: "Ticket updated successfully",
        notification: `Il ticket "${updatedTicket.title}" è stato aggiornato.`,
        updatedTicket,
      });
    } catch (error) {
      res.status(500).send({
        statusCode: 500,
        message: "Internal server error",
      });
    }
  }
);

tickets.patch(
  "/tickets/assign/:ticketId",
  verifyToken,
  restrictFieldsForUser,
  async (req, res) => {
    try {
      const { ticketId } = req.params;
      const { assignedTo } = req.body;

      if (!assignedTo) {
        return res.status(400).send({
          statusCode: 400,
          message: "Technician ID is required",
        });
      }

      const updatedTicket = await Ticketsmodel.findByIdAndUpdate(
        ticketId,
        { assignedTo },
        { new: true }
      )
        .populate("createdBy", "name email")
        .populate("assignedTo", "name email")
        .populate("department", "name");

      if (!updatedTicket) {
        return res.status(404).send({
          statusCode: 404,
          message: "Ticket not found",
        });
      }

      res.status(200).send({
        statusCode: 200,
        message: "Technician assigned successfully",
        updatedTicket,
      });
    } catch (error) {
      res.status(500).send({
        statusCode: 500,
        message: "Internal server error",
        error,
      });
    }
  }
);

tickets.delete(
  "/tickets/delete/:ticketId",
  verifyToken,
  authorizeTicketAcess,
  async (req, res) => {
    try {
      const { ticketId } = req.params;

      const deletedTicket = await Ticketsmodel.findByIdAndDelete(ticketId);

      if (!deletedTicket) {
        return res.status(404).send({
          statusCode: 404,
          message: "Ticket not found",
        });
      }

      res.status(200).send({
        statusCode: 200,
        message: "Ticket deleted successfully",
        notification: `Il ticket "${deletedTicket.title}" è stato eliminato.`,
      });
    } catch (error) {
      res.status(500).send({
        statusCode: 500,
        message: "Internal server error",
      });
    }
  }
);

tickets.patch(
  "/tickets/update/assign/:ticketId",
  verifyToken,
  authorizeTicketAcess,
  assignTechnician,
  async (req, res) => {
    try {
      const { ticketId } = req.params;
      const { assignedTo } = req.body;
      if (!assignedTo) {
        return res.status(400).send({
          statusCode: 400,
          message: "Assigned technician is required",
        });
      }

      const updatedTicket = await Ticketsmodel.findByIdAndUpdate(
        ticketId,
        { assignedTo },
        { new: true }
      )
        .populate("createdBy", "name email")
        .populate("assignedTo", "name email")
        .populate("department", "name");

      if (!updatedTicket) {
        return res.status(404).send({
          statusCode: 404,
          message: "Ticket not found",
        });
      }

      res.status(200).send({
        statusCode: 200,
        message: "Technician assigned successfully",
        updatedTicket,
      });
    } catch (error) {
      res.status(500).send({
        statusCode: 500,
        message: "Internal server error",
      });
    }
  }
);

module.exports = tickets;
