const express = require("express");
const mysql = require("mysql2/promise");
const DB_CONFIG = require("../db-config");
const Joi = require("joi");
const bcript = require("bcrypt");
const userScemaInport = require("../scema");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.get("/", (req, res) => {
  res.send("veikia");
});

const dbPool = mysql.createPool(DB_CONFIG);

const userScema = userScemaInport;

router.post("/", async (req, res) => {
  let payload = req.body;

  try {
    payload = await userScema.validateAsync(payload);
  } catch (err) {
    console.log(err);
    return res.status(400).send({ Error: "Password or email wrong" });
  }

  try {
    const [data] = await dbPool.execute("SELECT * from users WHERE email = ?", [
      payload.email,
    ]);

    if (!data.length) {
      return res.status(400).send({ Error: "Password or email wrong" });
    }

    const passwordmaching = await bcript.compare(
      payload.password,
      data[0].password,
    );

    if (passwordmaching) {
      const token = jwt.sign(
        {
          full_name: data[0].full_name,
          email: data[0].email,
          id: data[0].id,
        },
        process.env.JWT_SECRET,
      );
      return res.status(200).send({ token });
    } else {
      return res.status(400).send({ Error: "Password or email wrong" });
    }
  } catch (err) {
    console.log(err);
    return res.status(400).send({ Error: "Password or email wrong" });
  }
});

module.exports = router;
