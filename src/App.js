import logo from './logo.svg';
import './App.css'
import "./index.css";
import { useState, useEffect } from "react"; 
import IndivNote from "./indivNote"



//TODO change useState notes and saveName

const initialDragOrder = {
  column:{
    'column-1':{
      id:"column-1",
      noteOrder:['note-1', 'note-2'],
    }, 
    'column-2':{
      id:"column-2",
      noteOrder:['note-3']
    }

  },
  columnOrder:['column-1', 'column-2'],
}


function App() { 
  let nextID = '3'; 
  

  const defaultNotes = [
    {id: "note-1", name: "first note", description: "testing" },
    { id: "note-2", name: "second note", description: "testing" },
    { id: "note-3", name: "second note", description: "testing" }
  ]; 

  
  const arrayState = JSON.parse(localStorage.getItem('todo')); 
  
  const [dragOrder, setDragOrder] = useState(initialDragOrder);
  const [notes, setNotes] = useState(defaultNotes);  
  const [noteID, setID] = useState(nextID) 
  const [filter,setFilter] = useState('')


  
  useEffect(()=>{ 
    localStorage.setItem('todo', JSON.stringify(notes)) 
    console.log('triggered')
  }, [notes])


  function addNote(columnID){ 
    console.log('add note');
    const newNote = {id:`note-${noteID}`, name:"new note", description:"new note"}  
    setNotes(prevNote => [
      ...prevNote, 
      newNote
    ])   
    setDragOrder(prevDragOrder => {
      let tempColumn = dragOrder.column[columnID];
      tempColumn.noteOrder = [...tempColumn.noteOrder, `note-${noteID}`]; 
      console.log(tempColumn.noteOrder)
      const newDragOrder = {
        column:{
          ...prevDragOrder.column, 
          [tempColumn.id]: tempColumn
        },
        columnOrder: prevDragOrder.columnOrder
      }
      return newDragOrder;
    })
    setID(noteID => String(Number(noteID)+1));

  }

  function filterNote(e){
    setFilter(e.target.value) 

  }




  //const returnNotes = notes.filter(note=> note.name.includes(filter)).map((note) => <IndivNote note={note} />)
  
  function Column({column, notes}){  
    console.log(notes)
    return(
      notes.filter(note=> note.name.includes(filter)).map((note) => <IndivNote 
      column = {column} 
      note={note} 
      setNotes={setNotes}
      setDragOrder={setDragOrder}
      />)
    )
  }
  return (
    <div className="App">
      
      <div className='header'>
      <h1 className='todo-main-title'>To Do App</h1>
      {filter === '' &&<button className = "button add"onClick={()=>addNote(dragOrder.columnOrder[0])}>Add</button>}
      <input 
        placeholder='filter your list' 
        onChange={(e) => filterNote(e)} 
        value = {filter}
      ></input>
      </div>
     
     <div className='mainBody'>
     {/* <ul className='notes'>{returnNotes}</ul>  original code*/} 
     {dragOrder.columnOrder.map(columnID => {
      const column = dragOrder.column[columnID]; 
      const columnNotes = column.noteOrder.map(noteID => notes.find(note => note.id===noteID));
      console.log(column);
      return ( 
        <>
        <p>{column.id}</p>
        <Column column = {column} notes = {columnNotes} />
        </>
      )
     })}
     </div>
      
      
    </div>
  );
}


export default App;
