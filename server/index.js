const express = require("express");
const cors = require("cors");
require("dotenv").config();
const register = require("./src/routes/register");

const server = express();

server.use(cors());
server.use(express.json());

server.use("/register", register);
const PORT = process.env.PORT;

server.listen(8080, () => console.log(`server is running on ${PORT} `));
