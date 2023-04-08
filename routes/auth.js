const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const jwtSecret = "iNoteBook";

// endpoint to create a new user
router.post(
  "/createUser",
  [
    body("email", "enter a valid email.").isEmail(),
    body("name", "enter a valid name.").isLength({ min: 2 }),
    body("password", "enter a valid password.").isLength({ min: 8 }),
  ],
  async (req, res) => {
    try {
      // if any error in validation, return bad request
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      // check if user with same email already exist
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ error: "Sorry, a user with same email already exist" });
      }
      // create secure password
      const salt = bcrypt.genSaltSync(10);
      const secPass = bcrypt.hashSync(req.body.password, salt);
      // create new user
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      });
      // create authToken
      const data = { user: { id: user.id } };
      const authToken = jwt.sign(data, jwtSecret);
      res.json({ authToken });
    } catch (err) {
      res.status(500).send("Some error occured.");
    }
  }
);

// endpoint to login a user
router.post(
  "/login",
  [
    body("email", "enter a valid email.").isEmail(),
    body("password", "enter a valid password.").isLength({ min: 8 }),
  ],
  async (req, res) => {
    try {
      // if any error in validation, return bad request
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      // check if user exist
      let user = await User.findOne({ email: req.body.email });
      if (!user) {
        return res.status(400).json({
          error: "Invalid credentials. Please try with correct credentials.",
        });
      }
      // compare password
      const isPassCorrect = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      // create authToken
      if (isPassCorrect) {
        const data = { user: { id: user.id } };
        const authToken = jwt.sign(data, jwtSecret);
        res.json({ authToken });
      } else
        res.status(400).json({
          error: "Invalid credentials. Please try with correct credentials.",
        });
    } catch (err) {
      res.status(500).send("Some error occured.");
    }
  }
);

module.exports = router;
