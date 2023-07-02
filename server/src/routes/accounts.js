const express = require("express");
const mysql = require("mysql2/promise");
const DB_CONFIG = require("../db-config");
const jwt = require("jsonwebtoken");
const { authenticate } = require("../middleware");

const router = express.Router();
const dbPool = mysql.createPool(DB_CONFIG);

router.post("/", authenticate, async (req, res) => {
  let payload = req.body;
  try {
    const [data] = await dbPool.execute(
      "INSERT INTO accounts (group_id, user_id) VALUES (?,?)",
      [payload.group_id, req.user.id],
    );
    res.status(201).send(data);
  } catch (err) {
    console.log(err);
    res.status(400).end;
  }
});

router.get("/", authenticate, async (req, res) => {
  try {
    const [data] = await dbPool.execute(
      "SELECT group_id, name FROM accounts JOIN groupss on groupss.id = accounts.group_id WHERE user_id = ?",
      [req.user.id],
    );
    res.status(201).send(data);
  } catch (err) {
    console.log(err);
    res.status(400).end;
  }
});

module.exports = router;
