const express = require("express");
const logoutAuth = express.Router();

logoutAuth.get("/logout", (req, res) => {
  try {
    if (!req.user) {
      return res.status(403).send({
        statusCode: 403,
        message: "User is not authenticated",
      });
    }

    req.session.destroy((err) => {
      if (err) {
        throw new Error("Failed to destroy session");
      }
      return res.status(200).send({
        statusCode: 200,
        message: "User logged out successfully",
      });
    });
  } catch (error) {
    return res.status(500).send({
      statusCode: 500,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

module.exports = logoutAuth;
