const express = require("express");
const tickets = express.Router();
const Ticketsmodel = require("../models/Ticketsmodel");
const authorizeTicketAcess = require("../middlware/authorizeTicketAccess");
const assignTechnician = require("../middlware/assignTechnician");

tickets.get("/tickets", async (req, res) => {
  try {
    const { status, priority, department, page = 1, limit = 10 } = req.query;

    const filters = {};
    if (status) filters.status = status;
    if (priority) filters.priority = priority;
    if (department) filters.department = department;
    const skip = (page - 1) * limit;

    const tickets = await Ticketsmodel.find(filters)
      .skip(skip)
      .limit(parseInt(limit))
      .populate("createdBy", "name email")
      .populate("assignedTo", "name email")
      .populate("department", "name");

    const totalTickets = await Ticketsmodel.countDocuments(filters);

    if (!tickets || tickets.length === 0) {
      return res.status(404).send({
        statusCode: 404,
        message: "Tickets not found",
      });
    }
    const totalPages = Math.ceil(totalTickets / limit);

    res.status(200).send({
      statusCode: 200,
      message: "Tickets found",
      tickets,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalTickets,
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      message: "Internal server error",
    });
  }
});

tickets.post("/tickets/create", async (req, res) => {
  try {
    const {
      title,
      description,
      status,
      priority,
      createdBy,
      assignedTo,
      department,
    } = req.body;

    if (
      !title ||
      !description ||
      !status ||
      !priority ||
      !createdBy ||
      !assignedTo ||
      !department
    ) {
      return res.status(400).send({
        statusCode: 400,
        message: "All fields are required",
      });
    }

    const newTicket = await Ticketsmodel({
      title,
      description,
      status,
      priority,
      createdBy,
      assignedTo,
      department,
    });

    const ticket = await newTicket.save();
    res.status(201).send({
      statusCode: 201,
      message: "Ticket created successfully",
      ticket,
    });
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      message: "Internal server error",
    });
  }
});

tickets.get("/tickets/:ticketId", async (req, res) => {
  try {
    const { ticketId } = req.params;

    const ticket = await Ticketsmodel.findById(ticketId)
      .populate("createdBy", "name email")
      .populate("assignedTo", "name email")
      .populate("department", "name");

    if (!ticket) {
      return res.status(404).send({
        statusCode: 404,
        message: "Ticket not found",
      });
    }

    res.status(200).send({
      statusCode: 200,
      message: "Ticket found",
      ticket,
    });
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      message: "Internal server error",
    });
  }
});

tickets.patch(
  "/tickets/update/:ticketId",
  authorizeTicketAcess,
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

tickets.delete(
  "/tickets/delete/:ticketId",
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
      });
    } catch (error) {
      res.status(500).send({
        statusCode: 500,
        message: "Internal server error",
      });
    }
  }
);

tickets.get("/tickets/assigned-to/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const tickets = await Ticketsmodel.find({ assignedTo: userId })
      .populate("createdBy", "name email")
      .populate("assignedTo", "name email")
      .populate("department", "name");

    if (!tickets || tickets.lenght === 0) {
      return res.status(404).send({
        statusCode: 404,
        message: "Tickets not found",
      });
    }

    res.status(200).send({
      statusCode: 200,
      message: "Tickets found",
      tickets,
    });
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      message: "Internal server error",
    });
  }
});

tickets.patch(
  "/tickets/update/assign/:ticketId",
  authorizeTicketAcess,
  assignTechnician
);

module.exports = tickets;
