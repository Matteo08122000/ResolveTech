const express = require("express");
const logoutAuth = express.Router();

logoutAuth.post("/logout", (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).send({
      statusCode: 401,
      message: "Token mancante o non valido",
    });
  }

  const token = authHeader.split(" ")[1];

  return res.status(200).send({
    statusCode: 200,
    message: "Logout effettuato con successo",
  });
});

module.exports = logoutAuth;
