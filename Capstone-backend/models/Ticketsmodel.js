const mongoose = require("mongoose");

const TicketsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      maxlength: 200,
      minlength: 10,
      trim: true,
    },
    status: {
      type: String,
      required: false,
      enum: ["Open", "In progress", "Resolved", "Closed"],
      default: "Open",
      index: true,
    },

    priority: {
      type: String,
      required: false,
      default: "Low",
      enum: ["Low", "Medium", "High"],
      index: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UsersModel",
      required: false,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UsersModel",
      required: false,
      default: null,
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DepartmentsModel",
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.models.TicketsModel ||
  mongoose.model("TicketsModel", TicketsSchema, "Tickets");
