const express = require("express");
const cors = require("cors");
require("dotenv").config();
const register = require("./src/routes/register");
const login = require("./src/routes/login");

const server = express();

server.use(cors());
server.use(express.json());

server.use("/register", register);
server.use("/login", login);
const PORT = process.env.PORT;

server.listen(8080, () => console.log(`server is running on ${PORT} `));
