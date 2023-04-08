const express = require("express");
const fetchUser = require("../middleware/fetchUser");
const router = express.Router();
const Note = require("../models/Note");
const { body, validationResult } = require("express-validator");

// endpoint to fetch all notes for a logged in user
router.get("/fetchAllNotes", fetchUser, async (req, res) => {
  const notes = await Note.find({ user: req.user.id });
  res.json(notes);
});

// endpoint to add notes by logged in user
router.get(
  "/addNote",
  fetchUser,
  [
    body("title", "enter a valid title."),
    body("description", "enter a valid description.").isLength({ min: 5 }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const note = new Note({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const savedNote = await note.save();
      res.json(savedNote);
    } catch (err) {
      res.status(500).send("Some error occured.");
    }
  }
);

module.exports = router;
