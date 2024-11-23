const mongoose = require("mongoose");

const LogsSchema = new mongoose.Schema(
  {
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TicketsModel",
      required: true,
    },
    action: {
      type: String,
      required: true,
      enum: ["created", "updated", "deleted", "closed"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("LogsModel", LogsSchema, "Logs");
