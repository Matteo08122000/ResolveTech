const express = require("express");
const users = express.Router();
const Usersmodel = require("../models/Usersmodel");
const validateUserId = require("../middlware/validateUserId");

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

users.post("/users/create", async (req, res, next) => {
  const { name, email, password, gender, dob, role } = req.body;

  if (!name || !email || !password || !gender || !dob || !role) {
    return res.status(400).send({
      statusCode: 400,
      message: "All fileds are required",
    });
  }

  const Newuser = new Usersmodel({
    name: name,
    email: email,
    password: password,
    gender: gender,
    dob: dob,
    role: role,
  });

  try {
    const user = await Newuser.save();
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
      user: req.user,
    });
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      message: "Internal server error",
    });
  }
});

users.patch("/users/update/:userId", validateUserId, async (req, res) => {
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
});

users.delete("/users/delete/:userId", validateUserId, async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await Usersmodel.findByIdAndDelete(userId);
    res.status(200).send({
      statusCode: 200,
      message: "User deleted successfully",
      user: req.user,
    });
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      message: "Internal server error",
    });
  }
});

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
