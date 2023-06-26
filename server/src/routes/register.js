const express = require("express");
const mysql = require("mysql2");
const DB_CONFIG = require("../db-config");

const router = express.Router();
router.get("/", (req, res) => {
  res.send("veikia");
});

module.exports = router;
