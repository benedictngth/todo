import logo from "./logo.svg";
import "./App.css";
import "./index.css";
import { useState, useEffect } from "react";
import IndivNote from "./indivNote";
import { DragDropContext, Droppable } from "react-beautiful-dnd";

//TODO change useState notes and saveName

const initialDragOrder = {
  column: {
    "column-1": {
      id: "column-1",
      noteOrder: ["note-1", "note-2"],
    },
    "column-2": {
      id: "column-2",
      noteOrder: ["note-3"],
    },
  },
  columnOrder: ["column-1", "column-2"],
};

function App() {
  let nextID = "4";

  const defaultNotes = [
    { id: "note-1", name: "first note", description: "testing" },
    { id: "note-2", name: "second note", description: "testing" },
    { id: "note-3", name: "third note", description: "testing" },
  ];

  const arrayState = JSON.parse(localStorage.getItem("todo"));

  const [dragOrder, setDragOrder] = useState(initialDragOrder);
  const [notes, setNotes] = useState(defaultNotes);
  const [noteID, setID] = useState(nextID);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    localStorage.setItem("todo", JSON.stringify(notes));
    console.log("triggered");
  }, [notes]);

  function addNote(columnID) {
    console.log("add note");
    const newNote = {
      id: `note-${noteID}`,
      name: "new note",
      description: "new note",
    };
    setNotes((prevNote) => [...prevNote, newNote]);
    setDragOrder((prevDragOrder) => {
      let tempColumn = dragOrder.column[columnID];
      tempColumn.noteOrder = [...tempColumn.noteOrder, `note-${noteID}`];
      const newDragOrder = {
        column: {
          ...prevDragOrder.column,
          [tempColumn.id]: tempColumn,
        },
        columnOrder: prevDragOrder.columnOrder,
      };
      console.log(newDragOrder);
      return newDragOrder;
    });
    setID((noteID) => String(Number(noteID) + 1));
  }

  function filterNote(e) {
    setFilter(e.target.value);
  }

  //const returnNotes = notes.filter(note=> note.name.includes(filter)).map((note) => <IndivNote note={note} />)

  function Column({ column, notes }) {
    return (
      <Droppable droppableId={column.id}>
        {(provided) => (
          <div
            className="note-column"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {notes.map((note, index) => (
              <IndivNote
                index={index}
                column={column}
                note={note}
                setNotes={setNotes}
                setDragOrder={setDragOrder}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    );
  }

  function handleonDragEnd(result) {
    console.log(result);
    const { destination, source, draggableId } = result;
    if (!destination) {
      return;
    } else if (
      destination.droppableId === source.draggableId &&
      destination.index === source.index
    ) {
      return;
    }
    //within the same colum
    else if (destination.droppableId === source.droppableId) {
      const column = dragOrder.column[source.droppableId];
      const newNoteOrder = Array.from(column.noteOrder);
      newNoteOrder.splice(source.index, 1);
      newNoteOrder.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...column,
        noteOrder: newNoteOrder,
      };
      const newDragOrder = {
        ...initialDragOrder,
        column: {
          ...initialDragOrder.column,
          [newColumn.id]: newColumn,
        },
      };
      console.log(newDragOrder);
      setDragOrder(newDragOrder);
    }
    //not in the same column
    else if (destination.droppableId != source.droppableId) {
      const sourceColumn = dragOrder.column[source.droppableId];
      const destinationColumn = dragOrder.column[destination.droppableId];
      const sourceNoteOrder = Array.from(sourceColumn.noteOrder);
      const destinationNoteOrder = Array.from(destinationColumn.noteOrder);

      sourceNoteOrder.splice(source.index, 1);
      destinationNoteOrder.splice(destination.index, 0, draggableId);
      const newSourceColumn = {
        ...sourceColumn,
        noteOrder: sourceNoteOrder,
      };
      const newDestinationColumn = {
        ...destinationColumn,
        noteOrder: destinationNoteOrder,
      };
      const newDragOrder = {
        ...initialDragOrder,
        column: {
          ...initialDragOrder.column,
          [newSourceColumn.id]: newSourceColumn,
          [newDestinationColumn.id]: newDestinationColumn,
        },
      };
      console.log(newDragOrder);
      setDragOrder(newDragOrder);
    }
  }

  return (
    <div className="App">
      <div className="header">
        <h1 className="todo-main-title">To Do App</h1>
        {filter === "" && (
          <button
            className="button add"
            onClick={() => addNote(dragOrder.columnOrder[0])}
          >
            Add
          </button>
        )}
        <input
          placeholder="filter your list"
          onChange={(e) => filterNote(e)}
          value={filter}
        ></input>
      </div>

      <div className="note-columns">
        <DragDropContext onDragEnd={handleonDragEnd}>
          {/* <ul className='notes'>{returnNotes}</ul>  original code*/}
          {dragOrder.columnOrder.map((columnID) => {
            const column = dragOrder.column[columnID];
            const columnNotes = column.noteOrder.map((noteID) =>
              notes.find((note) => note.id === noteID)
            );
            return (
              <div className="note-column">
                <p>{column.id}</p>
                <Column column={column} notes={columnNotes} />
              </div>
            );
          })}
        </DragDropContext>
      </div>
    </div>
  );
}

export default App;
