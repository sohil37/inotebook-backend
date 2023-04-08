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

// endpoint to update a note by logged in user
router.put(
  "/updateNote/:id",
  fetchUser,
  [
    body("title", "enter a valid title."),
    body("description", "enter a valid description.").isLength({ min: 5 }),
  ],
  async (req, res) => {
    try {
      // check if note already exist
      let note = await Note.findById(req.params.id);
      if (!note) {
        return res.status(404).send("Not found.");
      }
      // check if user is a valid user
      if (note.user.toString() != req.user.id) {
        return res.status(401).send("Not allowed");
      }
      // update note
      const { title, description, tag } = req.body;
      const newNote = {};
      if (title) {
        newNote.title = title;
      }
      if (description) {
        newNote.description = description;
      }
      if (tag) {
        newNote.tag = tag;
      }
      const updatedNote = await Note.findByIdAndUpdate(
        req.params.id,
        { $set: newNote },
        { new: true }
      );
      res.json(updatedNote);
    } catch (err) {
      res.status(500).send("Some error occured.");
    }
  }
);

// endpoint to delete a note by logged in user
router.delete("/deleteNote/:id", fetchUser, async (req, res) => {
  try {
    // check if note already exist
    let note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).send("Not found.");
    }
    // check if user is a valid user
    if (note.user.toString() != req.user.id) {
      return res.status(401).send("Not allowed");
    }
    // delete note
    const deletedNote = await Note.findByIdAndDelete(req.params.id);
    res.json({ success: "Note deleted successfully.", note: deletedNote });
  } catch (err) {
    res.status(500).send("Some error occured.");
  }
});

module.exports = router;
