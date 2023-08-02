import './App.css';
import "./index.css";
import {useState} from "react"; 


function EditNote(props){
  return(
    <div className='indiv-note edit'>
      {<input className = "input-name"value = {props.inputName} onChange={e=>props.setName(e.target.value)}></input>}

      Description: {<input className = "input-name" value = {props.inputDescription} onChange={e=>props.setDescription(e.target.value)}></input>}
      
    </div>
  )
}


function IndivNote({column, note, setNotes, setDragOrder}) {
    const [edit, setEdit] = useState(false);
    const [inputName, setName] = useState(note.name);
    const [inputDescription, setDescription] = useState(note.description);

    function RenderNote(e) {
      const note = e.note; 
      return (
        <div className='indiv-note content'>
          <p>Name: {note.name}</p> 
          <p>Description: <span>{note.description}</span></p>
        </div>
      );
    }

    function saveNote(inputName,inputDescription, selectedNote){
      setNotes(prevState => {
          let newNote = prevState.map(note => 
            selectedNote.id === note.id ? 
            {...note, name: inputName, description:inputDescription}:note)
          return newNote;
      }
    )}

    function deleteNote(selectColumn, selectedNote){ 
      setNotes(prevState=>{
          const newNote = prevState.filter(note => note.id != selectedNote.id); 
          return newNote;
      })
      setDragOrder(prevDragOrder => {  
        selectColumn.noteOrder = selectColumn.noteOrder.filter(noteID => noteID != selectedNote.id);
        const newDragOrder = {
          column:{
            ...prevDragOrder.column,
            [selectColumn.id]: selectColumn},
          columnOrder: prevDragOrder.columnOrder,
          }
  
        return newDragOrder;
  
        }
      )
      }

    return (
      <li className = "indiv-note-box" key={note.id}>
        {!edit && <RenderNote note={note} />}


        {edit && <EditNote 
        inputName = {inputName} 
        setName = {setName} 
        inputDescription = {inputDescription}
        setDescription = {setDescription}/>}
        
        <button
        className = "button edit"
          onClick={() => { 
            if (!edit){setEdit(true);}
            else{
              {saveNote(inputName,inputDescription, note);}
            }
            
          }}
        >
          {edit ? "Input" : "Edit"}
        </button>
        <button className='button edit' onClick={() => deleteNote(column, note)}>Delete</button>
      </li>
    );
  
    }

    export default IndivNote;