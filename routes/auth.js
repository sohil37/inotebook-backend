const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");

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
      // create new user
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      });
      res.json({ message: "User created successfully.", user: user });
    } catch (err) {
      res.status(500).send("Some error occured.");
    }
  }
);

module.exports = router;
