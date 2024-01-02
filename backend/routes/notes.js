const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Notes = require('../models/Notes')
const fetchuser = require('../middleware/fetchUser')

// Route 1: Get all the notes- GET "/api/notes/fetchallnotes"
router.get('/fetchallnotes', fetchuser, async (req, res) => {
  const notes = await Notes.find({ user: req.user.id });
  res.json(notes);
})

// Route 2: Add a new note - GET "/api/notes/addnote"
router.post('/addnote', fetchuser, [
  body('title', "Enter valid Title").isLength({ min: 3 }),
  body('description', "description must be atleast 5 characters").isLength({ min: 5 }),
], async (req, res) => {
  try {
    const { title, description, tag } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const note = new Notes({
      title, description, tag, user: req.user.id
    })
    const savedNote = await note.save();
    res.json(savedNote);

  } catch (error) {
    console.error(error.message);
    res.status(500).send("internal server error");
  }

})

//Route 3: Update an existing note using put "/api/notes/updatenote"
router.put('/updatenote/:id', fetchuser, async (req, res) => {
  try {
    const { title, description, tag } = req.body;
    //Create a newNote object
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
  
    //Find the note to be updated
    let note= await Notes.findById(req.params.id);
    if(!note){
      return res.status(404).send("not found")
    }
    if(note.user.toString()!==req.user.id){
      return res.status(401).send("not allowed");
    }
    note=await Notes.findByIdAndUpdate(req.params.id,{$set:newNote}, {new:true});
    return res.json({note});
    
  } catch (error) {
    console.error(error.message);
    res.status(500).send("internal server error");
  }
})

//Route 4: delete an existing note using DELETE "/api/notes/deletenote"  Login required
router.delete('/deletenote/:id', fetchuser, async (req, res) => {

  try {    
    const { title, description, tag } = req.body;  
    //Find the note to be deleted
    let note= await Notes.findById(req.params.id);
    if(!note){
      return res.status(404).send("not found")
    }
    if(note.user.toString()!==req.user.id){
      return res.status(401).send("not allowed");
    }
    note=await Notes.findByIdAndDelete(req.params.id);
    return res.json({"Success": "Noted has been deleted"});
  } catch (error) {
    console.error(error.message);
    res.status(500).send("internal server error");
  }
})
module.exports = router; 