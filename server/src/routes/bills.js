const express = require("express");
const mysql = require("mysql2/promise");
const DB_CONFIG = require("../db-config");
const { route } = require("./register");

const router = express.Router();
const dbPool = mysql.createPool(DB_CONFIG);

router.get("/:group_id", async (req, res) => {
  try {
    const [data] = await dbPool.execute(
      "SELECT * FROM bills WHERE group_id = ?",
      [req.params.group_id],
    );
    res.status(201).send(data);
  } catch (err) {
    console.log(err), res.status(400).end;
  }
});

router.post("/", async (req, res) => {
  let payload = req.body;
  try {
    const [data] = await dbPool.execute(
      "INSERT INTO bills (group_id, amount, description) VALUES (?,?,?)",
      [payload.group_id, payload.amount, payload.description],
    );
    res.status(201).send(data);
  } catch (err) {
    console.log(err);
    res.status(400).end;
  }
});

module.exports = router;
