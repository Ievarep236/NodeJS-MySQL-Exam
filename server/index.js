const express = require("express");
const cors = require("cors");
require("dotenv").config();
const register = require("./src/routes/register");
const login = require("./src/routes/login");
const groups = require("./src/routes/groups");
const accounts = require("./src/routes/accounts");
const bills = require("./src/routes/bills");

const server = express();

server.use(cors());
server.use(express.json());

server.use("/register", register);
server.use("/login", login);
server.use("/groups", groups);
server.use("/accounts", accounts);
server.use("/bills", bills);
const PORT = process.env.PORT;

server.listen(8080, () => console.log(`server is running on ${PORT} `));
