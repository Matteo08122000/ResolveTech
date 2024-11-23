const mongoose = require("mongoose");

const CommentsSchema = new mongoose.Schema(
  {
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TicketsModel",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UsersModel",
      required: true,
    },
    content: {
      type: String,
      required: true,
      maxlength: 150,
      minlength: 10,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CommentsModel", CommentsSchema, "Comments");
