const express = require("express");
const mongoose = require("mongoose");
const init = require("./db");
require("dotenv").config();
const cors = require("cors");
const usersRoute = require("./routes/users");
const ticketsRoute = require("./routes/tickets");
const departmentsRoute = require("./routes/departments");
const commentsRoute = require("./routes/comments");
const googleRoute = require("./routes/google");

const PORT = 5050;

const server = express();

server.use(express.json());
server.use(cors());

server.use("/", usersRoute);
server.use("/", ticketsRoute);
server.use("/", departmentsRoute);
server.use("/", commentsRoute);
server.use("/", googleRoute);

init();

server.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));
