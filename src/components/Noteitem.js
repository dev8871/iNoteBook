import React, { useContext } from 'react'
import noteContext from "../context/notes/noteContext"

const Noteitem = (props) => {
    const { note, updateNote } = props;

    const context = useContext(noteContext);
  const { deleteNote } = context;
    return (
        <div className='col-md-3'>
            <div className="card my-3" >
                    <div className="card-body">
                        <h5 className="card-title">{note.title}</h5>
                        <p className="card-text">{note.description}</p>
                        <a href="/" className="btn btn-danger mx-2" onClick={(e)=>{
                            e.preventDefault();
                            deleteNote(note._id);
                            props.showAlert("Note Deleted Successfully","success")

                        }}>Delete</a>
                        <a href="/" className="btn btn-primary mx-2" onClick={(e)=>{
                            e.preventDefault();
                            updateNote(note);
                            

                        }}>Edit</a>
                    </div>
            </div>
        </div>
    )
}

export default Noteitem
