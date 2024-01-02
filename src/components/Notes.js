import React, { useContext, useState, useEffect, useRef } from 'react'
import noteContext from "../context/notes/noteContext"
import Noteitem from './Noteitem';
import { useNavigate } from 'react-router-dom';

const Notes = (props) => {
  const context = useContext(noteContext);
  let navigate=useNavigate();
  const { notes, addNote, getNotes, editNote } = context;
  useEffect(() => {
    if(localStorage.getItem('token')){

      getNotes();
    }else{
      navigate("/login");
    }
  }, []);

  const [note, setNote] = useState({
    title: "",
    description: "",
    tag: ""
  })

  const [enote, setENote] = useState({
    eid: "",
    etitle: "",
    edescription: "",
    etag: ""
  })

  const ref = useRef(null);
  const refClose = useRef(null);
  const updateNote = (currNote) => {
    ref.current.click();
    setENote({
      eid: currNote._id, etitle: currNote.title,
      edescription: currNote.description,
      etag: currNote.tag
    });
  }
  const handleClick = (e) => {
    e.preventDefault();
    addNote(note.title, note.description, note.tag);
    setNote({
      title: "",
      description:"",
      tag:""
    });
    props.showAlert("Note Added Successfully","success")


  }

  const handleEdit = (e) => {
    editNote(
      enote.eid,
      enote.etitle,
      enote.edescription,
      enote.etag
    )
    refClose.current.click();
    props.showAlert("Note Updated Successfully","success")
  }

  const onEChange = (e) => {
    setENote({ ...enote, [e.target.name]: e.target.value })
  }
  const onChange = (e) => {
    setNote({ ...note, [e.target.name]: e.target.value })
  }
  return (
    <>
      <div className='container'>
        {/* <!-- Button trigger modal --> */}
        <button ref={ref} type="button" className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#exampleModal">
          Launch demo modal
        </button>

        {/* <!-- Modal --> */}
        <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="exampleModalLabel">Edit Note</h1>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="mb-3">
                    <label htmlFor="etitle" className="form-label">Title</label>
                    <input type="email" className="form-control" id="etitle" name='etitle' aria-describedby="emailHelp" onChange={onEChange} value={enote.etitle} />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="edescription" className="form-label">Description</label>
                    <input type="text" className="form-control" id="edescription" name='edescription' onChange={onEChange} value={enote.edescription} />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="etag" className="form-label">Tag</label>
                    <input type="text" className="form-control" id="etag" name='etag' onChange={onEChange} value={enote.etag} />
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button ref={refClose} type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" className="btn btn-primary" onClick={handleEdit}>Save changes</button>
              </div>
            </div>
          </div>
        </div>
        <h1>Add a Note</h1>
        <form>
          <div className="mb-3">
            <label htmlFor="title" className="form-label">Title</label>
            <input type="email" value={note.title} className="form-control" id="title" name='title' aria-describedby="emailHelp" onChange={onChange} />
          </div>
          <div className="mb-3">
            <label htmlFor="description" className="form-label">Description</label>
            <input type="text" value={note.description} className="form-control" id="description" name='description' onChange={onChange} />
          </div>
          <div className="mb-3">
            <label htmlFor="tag" className="form-label">Tag</label>
            <input type="text" value={note.tag} className="form-control" id="tag" name='tag' onChange={onChange} />
          </div>

          <button type="submit" className="btn btn-primary" onClick={handleClick}>Add</button>
        </form>
      </div>
      <div className="container">
        <div className='row my-3'>
          <h1>Your Notes</h1>
          {notes.length === 0 ? 'No notes to display' : ""}
          {notes.map((note) => {
            return <Noteitem key={note._id} note={note} updateNote={updateNote} showAlert={props.showAlert}/>;
          })}
        </div>
      </div>
    </>
  )
}

export default Notes
