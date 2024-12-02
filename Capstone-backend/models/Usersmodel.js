const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const allowedGenders = ["male", "female", "not specified"];

const UsersSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: [/.+@.+\..+/, "Please enter a valid email"],
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    gender: {
      type: String,
      required: false,
      default: "not specified",
      enum: allowedGenders,
    },

    dob: {
      type: Date,
      required: false,
    },

    role: {
      type: String,
      required: true,
      enum: ["user", "admin", "technician"],
      default: "user",
      index: true,
    },
  },
  { timestamps: true, strict: true }
);

UsersSchema.pre("save", async function (next) {
  const user = this;

  if (!user.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("UsersModel", UsersSchema, "Users");
