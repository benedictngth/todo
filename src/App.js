import logo from './logo.svg';
import './App.css';
import "./index.css";
import { useState, useEffect } from "react";





const initialData = {
  notes:{
    'note-1': { id: 1, name: "first note", description: "testing" }, 
    'note-2':{ id: 2, name: "second note", description: "testing" },
  },
  column:{
    'column-1':{
      id:"column-1",
      noteOrder:['note-1', 'note-2'],
    }

  },
  columnOrder:['column-1'],
}


function App() { 
  let nextID = 3; 
  

  const defaultNotes = [
    { id: 1, name: "first note", description: "testing" },
    { id: 2, name: "second note", description: "testing" }
  ];
  
  const arrayState = JSON.parse(localStorage.getItem('todo')); 

  
  const [notes, setNotes] = useState(arrayState ?? defaultNotes); 
  const [id, setID] = useState(nextID) 
  const [filter,setFilter] = useState('')


  
  useEffect(()=>{ 
    localStorage.setItem('todo', JSON.stringify(notes)) 
    console.log('triggered')
  }, [notes])



  

  function saveName(inputName,inputDescription, selectedNote){
    setNotes(prevState => {
        let newNote = prevState.map(note => 
          selectedNote.id === note.id ? 
          {...note, name: inputName, description:inputDescription}:note)
        return newNote;
    }
  )}

  function addNote(){
    const newNote = {id:id, name:"new note", description:"new note"} 
    setNotes(prevNote => [...prevNote, newNote])  
    setID(id => id+=1);

  }

  function deleteNote(selectedNote){ 
    setNotes(prevState=>{
        const newNote = prevState.filter(note => note.id != selectedNote.id);
        return newNote;
    })
  }

  function filterNote(e){
    setFilter(e.target.value) 
    //const filterNote = notes.filter(note=>note.include(e.target.value))
    //console.log(filterNote)

  }

  function RenderNote(e) {
    const note = e.note; 
    return (
      <div className='indiv-note content'>
        <p>Name: {note.name}</p> 
        <p>Description: <span>{note.description}</span></p>
      </div>
    );
  } 

  function EditNote(props){
    console.log(props)
    return(
      <div className='indiv-note edit'>
        {<input className = "input-name"value = {props.inputName} onChange={e=>props.setName(e.target.value)}></input>}

        Description: {<input className = "input-name" value = {props.inputDescription} onChange={e=>props.setDescription(e.target.value)}></input>}
        
      </div>
    )

  }
  

  function IndivNote(e) {
    let note = e.note;
    const [edit, setEdit] = useState(false);
    const [inputName, setName] = useState(note.name);
    const [inputDescription, setDescription] = useState(note.description);

    return (
      <li className = "indiv-note-box"key={note.id}>
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
              {saveName(inputName,inputDescription, note);}
            }
            
          }}
        >
          {edit ? "Input" : "Edit"}
        </button>
        <button className='button edit' onClick={() => deleteNote(note)}>Delete</button>
      </li>
    );
  
        }

  const returnNotes = notes.filter(note=> note.name.includes(filter)).map((note) => <IndivNote note={note} />)
  function Column({column, notes}){
    return(
      notes.filter(note=> note.name.includes(filter)).map((note) => <IndivNote note={note} />)
    )
  }
  return (
    <div className="App">
      
      <div className='header'>
      <h1 className='todo-main-title'>To Do App</h1>
      {filter === '' &&<button className = "button add"onClick={()=>addNote()}>Add</button>}
      <input 
        placeholder='filter your list' 
        onChange={(e) => filterNote(e)} 
        value = {filter}
      ></input>
      </div>
     
     <div className='mainBody'>
     {/* <ul className='notes'>{returnNotes}</ul>  original code*/} 
     {initialData.columnOrder.map(columnID => {
      const column = initialData.column[columnID]; 
      const notes = column.noteOrder.map(note => initialData.notes[note]);
      return ( 
        <>
        <p>{column.id}</p>
        <Column column = {column} notes = {notes} />
        </>
      )
     })}
     </div>
      
      
    </div>
  );
}


export default App;
