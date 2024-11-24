const express = require("express");
const login = express.Router();
const Usersmodel = require("../models/Usersmodel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

login.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send({
        statuscode: 400,
        message: "Email or Password are required",
      });
    }

    const user = await Usersmodel.findOne({ email });
    if (!user) {
      return res.status(400).send({
        statusCode: 400,
        message: "User not Found",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).send({
        statusCode: 400,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        email: user.email,
        name: user.name,
        role: user.role,
        dob: user.dob,
        _id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.header("authorization", `Bearer ${token}`).status(200).send({
      statusCode: 200,
      message: "Login successful",
      token,
    });
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      message: "server error login",
    });
  }
});

module.exports = login;
