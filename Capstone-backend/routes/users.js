const express = require("express");
const users = express.Router();
const Usersmodel = require("../models/Usersmodel");
const validateUserId = require("../middlware/validateUserId");
const verifyToken = require("../middlware/VerifyToken");
const authorizeAdmin = require("../middlware/authorizeAdmin");
const bcrypt = require("bcrypt");

users.use(verifyToken);

users.get("/users", async (req, res) => {
  try {
    const users = await Usersmodel.find();
    if (users.length === 0) {
      return res.status(404).send({
        statusCode: 404,
        message: "Users not found",
      });
    }

    res.status(200).send({
      statusCode: 200,
      message: "Users found",
      users,
    });
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      message: "Internal server error",
    });
  }
});

users.get("/users/technician", verifyToken, async (req, res) => {
  try {
    const technicians = await Usersmodel.find({ role: "technician" }).select(
      "name email"
    );
    res.status(200).send({
      statusCode: 200,
      message: "Technicians retrieved successfully",
      technicians,
    });
  } catch (error) {
    console.error("Error fetching technicians:", error.message);
    res.status(500).send({
      statusCode: 500,
      message: "Error fetching technicians",
      error: error.message,
    });
  }
});

users.post("/users/create", async (req, res, next) => {
  const { name, email, password, gender, dob } = req.body;

  if (!name || !email || !password) {
    return res.status(400).send({
      statusCode: 400,
      message: "Name, email, and password are required",
    });
  }

  try {
    const existingUser = await Usersmodel.findOne({ email });
    if (existingUser) {
      return res.status(400).send({
        statusCode: 400,
        message: "Email already in use",
      });
    }

    const newUser = new Usersmodel({
      name,
      email,
      password,
      gender: gender || "not specified",
      dob: dob || null,
      role: "user",
    });

    const user = await newUser.save();
    res.status(201).send({
      statusCode: 201,
      message: "User created successfully",
      user,
    });
  } catch (error) {
    next(error);
  }
});

users.get("/users/:userId", validateUserId, async (req, res) => {
  const { userId } = req.params;
  if (!userId) {
    return res.status(400).send({
      statusCode: 400,
      message: "User id is required",
    });
  }

  try {
    const user = await Usersmodel.findById(userId);
    if (!user) {
      return res.status(400).send({
        statusCode: 400,
        message: "User id not found",
      });
    }

    res.status(200).send({
      statusCode: 200,
      message: "User id Found",
      user,
    });
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      message: "Internal server error",
    });
  }
});

users.patch(
  "/users/update/:userId",
  validateUserId,
  authorizeAdmin,
  async (req, res) => {
    const { userId } = req.params;

    try {
      const dataToupdate = req.body;
      const options = { new: true };
      const result = await Usersmodel.findByIdAndUpdate(
        userId,
        dataToupdate,
        options
      );
      res.status(200).send({
        statusCode: 200,
        message: "User updated successfully",
        result,
      });
    } catch (error) {
      res.status(500).send({
        statusCode: 500,
        message: "Internal server error",
      });
    }
  }
);

users.delete(
  "/users/delete/:userId",
  validateUserId,
  authorizeAdmin,
  async (req, res) => {
    const { userId } = req.params;

    try {
      const user = await Usersmodel.findByIdAndDelete(userId);
      res.status(200).send({
        statusCode: 200,
        message: "User deleted successfully",
        user,
      });
    } catch (error) {
      res.status(500).send({
        statusCode: 500,
        message: "Internal server error",
      });
    }
  }
);

users.get("/users/by-email/:email", async (req, res) => {
  const { email } = req.params;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).send({
      statusCode: 400,
      message: "Invalid email format",
    });
  }

  try {
    const user = await Usersmodel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        statusCode: 404,
        message: "User not found",
      });
    }

    res.status(200).send({
      statusCode: 200,
      message: "User found",
      user,
    });
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      message: "Oops, something went wrong",
    });
  }
});

module.exports = users;
