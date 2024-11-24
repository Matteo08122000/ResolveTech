const express = require("express");
const Logs = express.Router();
const Logsmodel = require("../models/Logsmodel");
const Ticketsmodel = require("../models/Ticketsmodel");
const validateUserId = require("../middlware/validateUserId");
const authorizeAdmin = require("../middlware/authorizeAdmin");
const assignTechnician = require("../middlware/assignTechnician");
const ValidateLog = require("../middlware/ValidateLogs");


Logs.post(
  "/logs/create/:userId",
  validateUserId,
  ValidateLog,
  async (req, res) => {
    try {
      const { ticket, action } = req.body;
      const { userId } = req.params;

      const ticketData = await Ticketsmodel.findById(ticket);
      if (!ticketData) {
        return res.status(400).send({
          statusCode: 400,
          message: "Ticket not found",
        });
      }

      const userRole = req.user.role;

      if (userRole === "admin") {
        const newLog = new Logsmodel({ ticket, action, createdBy: userId });
        await newLog.save();

        return res.status(200).send({
          statusCode: 200,
          message: "Log created successfully",
          newLog,
        });
      }
      if (
        !ticketData.assignedTo ||
        ticketData.assignedTo.toString() !== userId
      ) {
        return res.status(403).send({
          statusCode: 403,
          message:
            "Access denied. Only admin or assigned technician can create logs",
        });
      }
      const newLog = new Logsmodel({ ticket, action, createdBy: userId });
      await newLog.save();

      return res.status(200).send({
        statusCode: 200,
        message: "Log created successfully",
        newLog,
      });
    } catch (error) {
      res.status(500).send({
        statusCode: 500,
        message: "Error creating log",
      });
    }
  }
);

Logs.get("/logs/:userId", validateUserId, async (req, res) => {
  try {
    const{userId} = req.params;
    const { page = 1, limit = 10 } = req.query;
    const logs = await Logsmodel.find({ createdBy: userId })
      .populate("ticket")
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const totalLogs = await Logsmodel.countDocuments({ createdBy: userId });

    res.status(200).send({
      statusCode: 200,
      message: "Logs retrieved successfully",
      totalLogs,
      totalPages: Math.ceil(totalLogs / limit),
      currentPage: page,
      logs,
    });
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      message: "Error retrieving logs",
    });
  }
});

Logs.get(
  "/logs/:userId/:logId",
  validateUserId,
  assignTechnician,
  async (req, res) => {
    try {
      const { logId, userId } = req.params;
      const log = await Logsmodel.findById(logId).populate("ticket");

      if (!log) {
        return res.status(404).send({
          statusCode: 404,
          message: "Log not found",
        });
      }

      if (log.createdBy.toString() !== userId) {
        return res.status(403).send({
          statusCode: 403,
          message: "Access denied",
        });
      }

      res.status(200).send({
        statusCode: 200,
        message: "Log retrieved successfully",
        log,
      });
    } catch (error) {
      res.status(500).send({
        statusCode: 500,
        message: "Error retrieving log",
      });
    }
  }
);

Logs.patch(
  "/logs/update/:userId/:logId",
  validateUserId,
  authorizeAdmin,
  async (req, res) => {
    try {
      const { logId, userId } = req.params;
      const { ticket, action } = req.body;

      if (!ticket || !action) {
        return res.status(400).send({
          statusCode: 400,
          message: "Ticket ID and action are required to update",
        });
      }

      const updateLog = await Logsmodel.findByIdAndUpdate(
        logId,
        { ticket, action },
        { new: true }
      );

      if (!updateLog) {
        return res.status(404).send({
          statusCode: 404,
          message: "Log not found",
        });
      }

      if (updateLog.createdBy.toString() !== userId) {
        return res.status(403).send({
          statusCode: 403,
          message: "Access denied",
        });
      }

      res.status(200).send({
        statusCode: 200,
        message: "Log updated successfully",
        updateLog,
      });
    } catch (error) {
      res.status(500).send({
        statusCode: 500,
        message: "Error updating log",
      });
    }
  }
);

Logs.delete(
  "/logs/delete/:userId/:logId",
  validateUserId,
  authorizeAdmin,
  async (req, res) => {
    try {
      const { logId, userId } = req.params;

      const deletedLogs = await Logsmodel.findByIdAndDelete(logId);

      if (!deletedLogs) {
        return res.status(404).send({
          statusCode: 404,
          message: "Log not found",
        });
      }

      if (deletedLogs.createdBy.toString() !== userId) {
        return res.status(403).send({
          statusCode: 403,
          message: "Access denied",
        });
      }

      res.status(200).send({
        statusCode: 200,
        message: "Log deleted successfully",
        deletedLogs,
      });
    } catch (error) {
      res.status(500).send({
        statusCode: 500,
        message: "Error deleting log",
      });
    }
  }
);

module.exports = Logs;
