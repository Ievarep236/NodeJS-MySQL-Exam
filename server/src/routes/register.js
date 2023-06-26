const express = require("express");
const mysql = require("mysql2/promise");
const DB_CONFIG = require("../db-config");
const Joi = require("joi");
const bcript = require("bcrypt");
const jwt = require("jsonwebtoken");

const router = express.Router();
const pool = mysql.createPool(DB_CONFIG);

router.get("/", (req, res) => {
  res.send("veikia");
});

const userScema = Joi.object({
  full_name: Joi.string().trim().required(),
  email: Joi.string().email().trim().lowercase().required(),
  password: Joi.string().required(),
});

router.post("/", async (req, res) => {
  let payload = req.body;
  try {
    payload = await userScema.validateAsync(payload);
  } catch (err) {
    return res.status(400).send({ Error: "Mistake in registration " });
  }

  try {
    const encriptedPassword = await bcript.hash(payload.password, 10);

    const [response] = await pool.execute(
      "INSERT INTO users (full_name, email, password) VALUES (?,?,?)",
      [payload.full_name, payload.email, encriptedPassword],
    );

    const token = jwt.sign(
      {
        full_name: payload.full_name,
        email: payload.email,
        id: response.insertId,
      },
      process.env.JWT_SECRET,
    );
    console.log(response.insertId);

    return res.status(201).json({ token });
  } catch (err) {
    console.log(err);
    return res.status(500).end;
  }
});

module.exports = router;
