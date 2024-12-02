const express = require("express");
const mongoose = require("mongoose");
const init = require("./db");
require("dotenv").config();
const cors = require("cors");
const usersRoute = require("./routes/users");
const ticketsRoute = require("./routes/tickets");
const departmentsRoute = require("./routes/departments");
const commentsRoute = require("./routes/comments");
const logsRoute = require("./routes/logs");
const loginRoute = require("./routes/login");
const logoutRoute = require("./routes/logoutAuth")
const googleRoute = require("./routes/google");

const PORT = 5050;

const server = express();

server.use(express.json());
server.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
  }));

server.use("/", usersRoute);
server.use("/", ticketsRoute);
server.use("/", departmentsRoute);
server.use("/", commentsRoute);
server.use("/", logsRoute);
server.use("/", loginRoute);
server.use("/", logoutRoute);
server.use("/", googleRoute);

init();

server.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));
