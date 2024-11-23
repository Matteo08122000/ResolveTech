const mongoose = require("mongoose");

const DepartmentsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      maxlength: 100,
      minlength: 10,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("DepartmentsModel", DepartmentsSchema, "Departments");
