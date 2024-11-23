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
      required: true,
      enum: ["Open", "In progress", "Resolved", "Closed"],
      default: "Open",
      index: true,
    },
    priority: {
      type: String,
      required: true,
      enum: ["Low", "Medium", "High"],
      index: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UsersModel",
      required: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UsersModel",
      required: false,
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DepartmentsModel",
      required:true,
    },
  },
  {
    timestamps: true, 
  }
);

module.exports = mongoose.model("TicketsModel", TicketsSchema, "Tickets");
