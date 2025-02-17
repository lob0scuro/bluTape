import styles from "./RepairCard.module.css";
import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { deleteMachine, addToInventory, fetchMachine } from "../api/Calls";
import { PrintLabel, PrintNotes, printZPL } from "../utils";
import { useAuth } from "../context/UserContext";
import PrintPage from "../components/PrintPage";

const RepairCard = () => {
  const { id } = useParams();
  const [machine, setMachine] = useState({});
  const [noteCount, setNoteCount] = useState(0);
  const [newNote, setNewNote] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    fetchMachine(id, setMachine);
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
    const assurance = confirm("Delete note?");
    if (!assurance) {
      return;
    }
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
    return [...notes].reverse().map((note) => (
      <li className={styles.noteItem} key={note.id}>
        <div>
          <div>{note.content}</div>
          <div>{note.created_on}</div>
        </div>
        {user && (
          <button
            onClick={() => handleDelete(note.id)}
            className={styles.deleteNote}
          >
            X
          </button>
        )}
      </li>
    ));
  };

  return (
    <>
      <div className={styles.card}>
        <h1 className={styles.cardHeader}>{machine.make}</h1>
        <p className={styles.machineStyle}>{machine.style}</p>
        <h2 className={styles.cardSubHeader}>
          Model: <span>{machine.model}</span> | Serial:{" "}
          <span>{machine.serial}</span>
        </h2>
        <p className={styles.condition}>({machine.condition})</p>
        {/* qr code block for printing */}
        <div id="qr-block" className={styles.qrBlock}>
          <PrintPage machine={machine} />
        </div>
        {/* end qr block */}
        <div className={styles.handleMachine}>
          {user ? (
            <>
              <button
                className={styles.printLabelButton}
                // onClick={() => PrintLabel("qr-block")}
                onClick={() => printZPL(machine)}
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
            </>
          ) : (
            <>
              {/* The button to print QR label */}
              <button
                className={styles.printLabelButton}
                // onClick={() => PrintLabel("qr-block")}
                onClick={() => printZPL(machine)}
              >
                Print Label
              </button>
              <Link to="/login-page">Login</Link>
            </>
          )}
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

      {user && (
        <form className={styles.addNoteForm} onSubmit={handleSubmit}>
          <div>
            <label htmlFor="toAdd">Add Note</label>
            <textarea
              className={styles.addNoteArea}
              name="toAdd"
              id="toAdd"
              rows="10"
              // cols="45"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
            ></textarea>
          </div>
          <input type="submit" value="Submit" />
        </form>
      )}
    </>
  );
};

export default RepairCard;
