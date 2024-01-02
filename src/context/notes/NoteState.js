import { useState } from "react";
import NoteContext from "./noteContext";

const NoteState = (props) => {
  const notesInitial = []

  const [notes, setNotes] = useState(notesInitial);

  //fetching all notes
  const getNotes = async() => {
    //API call
    const url = "http://localhost:5000/api/notes/fetchallnotes";
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        'auth-token': localStorage.getItem('token')
      },
    });
    const json=await response.json();
    setNotes(json);
  }


  //Add note
  const addNote = async(title, description, tag) => {
    //API call
    const url = "http://localhost:5000/api/notes/addnote";
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'auth-token': localStorage.getItem('token')
      },
      body: JSON.stringify({title,description,tag}),

    });
    const note =await response.json();
   
    setNotes(notes.concat(note));
  }
  //Delete a note
  const deleteNote =async (id) => {
    //API call
    const url = "http://localhost:5000/api/notes/deletenote/" + id;
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'content-type': 'application/json',
        'auth-token': localStorage.getItem('token')
      },
    });
response.json();


    //Deleting in client
    const newNotes = notes.filter((note) => {
      return note._id !== id
    })
    setNotes(newNotes);
  }
  // Edit a note
  const editNote = async (id, title, description, tag) => {
    //API call
    const url = "http://localhost:5000/api/notes/updatenote/" + id;
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'content-type': 'application/json',
        'auth-token': localStorage.getItem('token')
      },
      body: JSON.stringify({title,description,tag})

    });
    response.json ();


    //editing in client
    let newNotes=JSON.parse(JSON.stringify(notes));
    for (let index = 0; index < newNotes.length; index++) {
      const element = newNotes[index];
      if (element._id === id) {
        newNotes[index].title = title;
        newNotes[index].description = description;
        newNotes[index].tag = tag;
        break;
      }
    }
    setNotes(newNotes);
  }
  return (
    <NoteContext.Provider value={{ notes, addNote, editNote, deleteNote, getNotes }}>
      {props.children}
    </NoteContext.Provider>
  )
}
export default NoteState;