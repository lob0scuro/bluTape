import styles from "./RepairCard.module.css";
import React, { useState, useEffect, useContext } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { deleteMachine, addToInventory, getTechs } from "../api/Calls";
import { PrintLabel, PrintNotes } from "../utils";
import { LoginContext } from "../App";
import PrintPage from "../components/PrintPage";

const RepairCard = () => {
  const [machine, setMachine] = useState({});
  const [noteCount, setNoteCount] = useState(0);
  const [newNote, setNewNote] = useState("");
  const location = useLocation();
  const { id } = useParams();
  const { loggedIn, setLoggedIn, user, setUser } = useContext(LoginContext);

  useEffect(() => {
    fetch(`/api/get_machine/${id}`)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setMachine(data.machine);
      })
      .catch((error) => {
        ch(`/api/delete/${id}`, {
          methods: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((response) => {
            return response.json();
          })
          .then((data) => {
            console.log(data.message);
          })
          .catch((error) => {
            console.error(error);
          });
        console.error(error);
      });
  }, [noteCount]);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`/api/add_note/${machine.id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ note: newNote }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data);
        setNoteCount(noteCount + 1);
      })
      .catch((error) => {
        console.error(error);
      });
    setNewNote("");
  };

  const handleDelete = (id) => {
    fetch(`/api/delete_note/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data);
        setNoteCount(noteCount - 1);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const renderNotes = (notes = []) => {
    return notes.map((note) => (
      <li className={styles.noteItem} key={note.id}>
        <div>
          <div>{note.content}</div>
          <div>{note.created_on}</div>
        </div>
        <button
          onClick={() => handleDelete(note.id)}
          className={styles.deleteNote}
        >
          X
        </button>
      </li>
    ));
  };

  return (
    <>
      <div className={styles.card}>
        <h1 className={styles.cardHeader}>
          {machine.make} <small>{machine.style}</small>
        </h1>
        <h2 className={styles.cardSubHeader}>
          Model: {machine.model} | Serial: {machine.serial}
        </h2>
        {/* qr code block for printing */}
        <div id="qr-block" className={styles.qrBlock}>
          <PrintPage machine={machine} />
        </div>
        {/* end qr block */}
        <div className={styles.handleMachine}>
          <button
            className={styles.printLabelButton}
            onClick={() => PrintLabel("qr-block")}
          >
            Print Label
          </button>

          {machine.in_progress && (
            <Link
              to="/inventory-list"
              onClick={() => addToInventory(machine.id)}
            >
              Add to Inventory
            </Link>
          )}
          <Link to={`/edit-machine/${machine.id}`}>Edit</Link>
          <Link
            to="/active-repairs"
            onClick={() => deleteMachine(machine.id)}
            className={styles.trash}
          >
            Trash
          </Link>
        </div>

        <div id="notes-block" className={styles.notesBlock}>
          <ul>{renderNotes(machine.notes)}</ul>
        </div>
        <button
          className={styles.printNotesButton}
          onClick={() => PrintNotes("notes-block", machine)}
        >
          Print Notes
        </button>
      </div>
      <div>
        <form className={styles.addNoteForm} onSubmit={handleSubmit}>
          <div>
            <label htmlFor="toAdd">
              <div>Add Note</div>
              <textarea
                className={styles.addNoteArea}
                name="toAdd"
                id="toAdd"
                rows="10"
                // cols="45"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
              ></textarea>
            </label>
          </div>
          <input type="submit" value="Submit" />
        </form>
      </div>
    </>
  );
};

export default RepairCard;
