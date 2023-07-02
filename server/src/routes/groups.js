const express = require("express");
const mysql = require("mysql2/promise");
const DB_CONFIG = require("../db-config");
const jwt = require("jsonwebtoken");
const { authenticate } = require("../middleware");

const router = express.Router();
const dbPool = mysql.createPool(DB_CONFIG);

router.get("/", async (req, res) => {
  try {
    const [data] = await dbPool.execute("SELECT * FROM groupss");
    console.log(data);
    res.status(201).send(data);
  } catch (err) {
    console.log(err);
    res.status(500).end;
  }
});

router.post("/", authenticate, async (req, res) => {
  const payload = req.body;
  try {
    const [data] = await dbPool.execute(
      "INSERT INTO groupss (name) VALUES(?)",
      [payload.name],
    );
    res.status(201).send(data);
  } catch (err) {
    console.group(err);
    res.status(500).end;
  }
});

module.exports = router;
