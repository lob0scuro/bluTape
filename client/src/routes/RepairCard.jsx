import styles from "../style/RepairCard.module.css";
import React, { useEffect, useState, useActionState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Notes from "../components/Notes.jsx";
import {
  fetchOneMachine,
  formatDate,
  finishRepair,
  fetchAllTechs,
  machineMap,
  deleteMachine,
  deleteNote,
} from "../utils.jsx";
import toast from "react-hot-toast";

const RepairCard = () => {
  const { id, typeOf } = useParams();
  const [machine, setMachine] = useState({});
  const [techs, setTechs] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [addingNote, setAddingNote] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMachine = async () => {
      const fetchedMachine = await fetchOneMachine(typeOf, id);
      setMachine(fetchedMachine);
      // setNotes(fetchedMachine.notes || []);
    };
    fetchMachine();
    const techList = async () => {
      const technicians = await fetchAllTechs();
      setTechs(technicians);
    };
    techList();
  }, []);

  const submitNewNote = async (e) => {
    e.preventDefault();
    const formValues = {
      content: newNote,
      machine_id: machine.id,
    };
    try {
      const response = await fetch("/create/add_note", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formValues),
      });
      const data = await response.json();
      if (!response.ok) {
        toast.error(data.error);
        throw new Error(data.error);
      }
      toast.success(data.message);

      // Add the new note to the machine state directly
      const newNoteObj = data.new_note; // assuming your backend returns the full note object
      setMachine((prev) => ({
        ...prev,
        notes: [...(prev.notes || []), newNoteObj], // Update notes directly in machine state
      }));
      setNewNote("");
      return data.message;
    } catch (error) {
      toast.error(error.message || "Failed to add note");
      return error;
    }
  };

  const deleteNote = async (id) => {
    try {
      const response = await fetch(`delete/delete_note/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMsg = "Failed to delete note";
        throw new Error(errorMsg);
      }

      toast.success(data?.message || "Note deleted");

      setMachine((prev) => ({
        ...prev,
        notes: prev.notes.filter((note) => note.id !== id),
      }));
    } catch (error) {
      toast.error("Error in yo butt");
      return error;
    }
  };

  const handleDelete = async () => {
    const result = await deleteMachine(machine.id);

    if (result?.success) {
      toast.success(result.message || "Machine deleted!");
      navigate("/active");
    } else {
      toast.error(result?.error || "Something went wrong.");
    }
  };

  const handleFinishedRepair = async (id) => {
    const result = await finishRepair(id);
    toast.success("Repair has been finished!");
    navigate("/finished");
  };

  return (
    <>
      <div className={styles.cardButtonBlock}>
        <button>Label</button>
        <button onClick={() => navigate(`/edit/${machine.id}`)}>Edit</button>
        {machine.in_progress && (
          <button onClick={() => finishRepair(machine.id)}>Finished</button>
        )}

        <button onClick={() => handleDelete()}>Trash</button>
      </div>
      <div className={styles.mainCardBlock}>
        {/* <div className={styles.infoBlock}>
          <ul className={styles.cardInfo}>
            <li>
              ID: <small>{machine.id}</small>
            </li>
            <li>
              Started On: <small>{formatDate(machine.created_on)}</small>
            </li>
            <li>
              Brand:{" "}
              <small>
                {machine.brand} {machineMap[machine.machine_type]}
              </small>
            </li>
            <li>
              Model: <small>{machine.model}</small>
            </li>
            <li>
              Serial: <small>{machine.serial}</small>
            </li>
            <li>
              Color: <small>{machine.color}</small>
            </li>
            <li>
              Style: <small>{machine.style}</small>
            </li>
            <li>
              Vendor: <small>{machine.vendor}</small>
            </li>
            <li>
              Condition: <small>{machine.condition}</small>
            </li>
            {machine.heat_type && (
              <li>
                Heat Type: <small>{machine.heat_type}</small>
              </li>
            )}
          </ul>
        </div> */}
        <div className={styles.notesBlock}>
          <h3>
            Notes{" "}
            <button onClick={() => setAddingNote(!addingNote)}>
              {addingNote ? "-" : "+"}
            </button>
          </h3>
          <div className={styles.noteItems}>
            {machine.notes?.map((note) => {
              const tech = techs.find((t) => t.id === note.tech_id);
              return (
                <div className={styles.noteItem} key={note.id}>
                  <p>{note.content}</p>
                  <div className={styles.noteItemFooter}>
                    <div>
                      <p>~ {tech?.first_name}</p>
                      <p>{formatDate(note.created_on)}</p>
                    </div>
                    <button onClick={() => deleteNote(note.id)}>X</button>
                  </div>
                </div>
              );
            })}
          </div>
          {addingNote && (
            <form onSubmit={submitNewNote} className={styles.addNoteForm}>
              <textarea
                name="content"
                id="content"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
              ></textarea>
              <button type="submit">Submit</button>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default RepairCard;
