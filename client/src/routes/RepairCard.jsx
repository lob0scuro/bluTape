import styles from "../style/RepairCard.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPrint,
  faPlus,
  faMinus,
  faSquareCheck,
  faTrash,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import {
  fetchOneMachine,
  formatDate,
  finishRepair,
  fetchAllTechs,
  machineMap,
  deleteMachine,
  brands,
  renderOptions,
  colors,
  machineStyles,
  vendors,
  conditions,
} from "../utils.jsx";
import toast from "react-hot-toast";
import { useAuth } from "../context/UserContext.jsx";

const RepairCard = () => {
  const { id, typeOf } = useParams();
  const { user } = useAuth();
  const [machine, setMachine] = useState({});
  const [techs, setTechs] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [addingNote, setAddingNote] = useState(false);
  const [editMachine, setEditMachine] = useState(false);
  const [editValue, setEditValue] = useState({});
  const navigate = useNavigate();
  const location = useLocation();

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
  }, [editMachine]);

  useEffect(() => {
    if (editMachine && machine) {
      setEditValue({
        brand: machine.brand || "",
        model: machine.model || "",
        serial: machine.serial || "",
        color: machine.color || "",
        style: machine.style || "",
        vendor: machine.vendor || "",
        condition: machine.condition || "",
        heat_type: machine.heat_type || "",
      });
    }
  }, [editMachine, machine]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditValue((prev) => ({ ...prev, [name]: value }));
  };

  const submitNewNote = async (e) => {
    e.preventDefault();
    if (newNote.trim() === "") {
      setAddingNote(false);
      return;
    }
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
      setAddingNote(false);
      return data.message;
    } catch (error) {
      toast.error(error.message || "Failed to add note");
      return error;
    }
  };

  const deleteNote = async (id) => {
    if (!confirm("Delete note?")) {
      return;
    }
    try {
      const response = await fetch(`/delete/delete_note/${id}`, {
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
      toast.error(error.error);
      return error;
    }
  };

  const handleDelete = async () => {
    const assurance = confirm("Delete Machine?");
    if (!assurance) {
      return;
    }
    const result = await deleteMachine(machine.id);

    if (result?.success) {
      toast.success(result.message || "Machine deleted!");
      navigate("/active");
    } else {
      toast.error(result?.error || "Something went wrong.");
    }
  };

  const handleMachineEdit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/update/edit/${machine.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editValue),
      });
      const data = await response.json();
      if (!response.ok) {
        toast.error(data.error);
        throw new Error(data.error);
      }
      toast.success(data.message);
      setEditMachine(false);
      return data.message;
    } catch (error) {
      toast.error(error.error);
      return error;
    }
  };

  const handleFinishedRepair = async (id) => {
    const assurance = confirm("Finish Repair?");
    if (!assurance) {
      return;
    }
    const result = await finishRepair(id);
    toast.success(result);
    navigate("/finished");
  };

  return (
    <>
      {!user && (
        <p style={{ fontSize: "18px", marginBottom: "2rem" }}>
          **
          <Link
            to="/login"
            state={{ from: location }}
            style={{ color: "#6d7db2", fontSize: "22px" }}
          >
            Login
          </Link>{" "}
          to edit machine and add notes**
        </p>
      )}
      {user && (
        <div className={styles.cardButtonBlock}>
          <button disabled={editMachine}>Label</button>
          {user ? (
            <button onClick={() => setEditMachine(!editMachine)}>
              {editMachine ? "Editing.." : "Edit"}
            </button>
          ) : (
            <button onClick={() => navigate("/login")}>Login to edit</button>
          )}
          {machine.in_progress && (
            <button
              disabled={editMachine && user}
              onClick={() => handleFinishedRepair(machine.id)}
            >
              <FontAwesomeIcon icon={faCheck} />
            </button>
          )}
          <button disabled={editMachine} onClick={() => handleDelete()}>
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
      )}
      <div className={styles.mainCardBlock}>
        <div className={styles.infoBlock}>
          <form onSubmit={handleMachineEdit} className={styles.editMachineForm}>
            <ul className={styles.cardInfo}>
              <li>
                ID: <small>{machine.id}</small>
              </li>
              <li>
                Started On: <small>{formatDate(machine.created_on)}</small>
              </li>
              <li>
                Brand:{" "}
                {editMachine ? (
                  <select
                    value={editValue.brand}
                    onChange={handleChange}
                    name="brand"
                    id="brand"
                  >
                    {renderOptions(brands)}
                  </select>
                ) : (
                  <small>
                    {machine.brand} {machineMap[machine.machine_type]}
                  </small>
                )}
              </li>
              <li>
                Model:
                {editMachine ? (
                  <input
                    type="text"
                    name="model"
                    id="model"
                    value={editValue.model}
                    onChange={handleChange}
                  />
                ) : (
                  <small>{machine.model}</small>
                )}
              </li>
              <li>
                Serial:
                {editMachine ? (
                  <input
                    type="text"
                    name="serial"
                    id="serial"
                    value={editValue.serial}
                    onChange={handleChange}
                  />
                ) : (
                  <small>{machine.serial}</small>
                )}
              </li>
              <li>
                Color:
                {editMachine ? (
                  <select
                    name="color"
                    id="color"
                    value={editValue.color}
                    onChange={handleChange}
                  >
                    {renderOptions(colors)}
                  </select>
                ) : (
                  <small>{machine.color}</small>
                )}
              </li>
              <li>
                Style:
                {editMachine ? (
                  <select
                    name="style"
                    id="style"
                    value={editValue.style}
                    onChange={handleChange}
                  >
                    {renderOptions(machineStyles[machine.machine_type])}
                  </select>
                ) : (
                  <small>{machine.style}</small>
                )}
              </li>
              <li>
                Vendor:
                {editMachine ? (
                  <select
                    value={editValue.vendor}
                    onChange={handleChange}
                    name="vendor"
                    id="vendor"
                  >
                    {renderOptions(vendors)}
                  </select>
                ) : (
                  <small>{machine.vendor}</small>
                )}
              </li>
              <li>
                Condition:
                {editMachine ? (
                  <select
                    value={editValue.condition}
                    onChange={handleChange}
                    name="condition"
                    id="condition"
                  >
                    {renderOptions(conditions)}
                  </select>
                ) : (
                  <small>{machine.condition}</small>
                )}
              </li>
            </ul>
            {editMachine && <button type="submit">Submit</button>}
          </form>
        </div>
        <div className={styles.notesBlock}>
          <h3>
            Notes{" "}
            <div className={styles.noPrint}>
              <button
                className={styles.printNotesButton}
                onClick={() => window.print()}
              >
                <FontAwesomeIcon icon={faPrint} />
              </button>
              {user && (
                <button onClick={() => setAddingNote(!addingNote)}>
                  {addingNote && user ? (
                    <FontAwesomeIcon icon={faMinus} />
                  ) : (
                    <FontAwesomeIcon icon={faPlus} />
                  )}
                </button>
              )}
            </div>
          </h3>
          <div className={styles.noteItems}>
            <p className={styles.onlyPrint}>
              Model: {machine.model} // {machine.color} {machine.style} <br />
              <br />
            </p>
            {machine.notes?.length === 0 && !addingNote ? (
              <p style={{ margin: "5px auto 12px auto" }}>
                Click + to add note
              </p>
            ) : (
              machine.notes?.map((note) => {
                const tech = techs.find((t) => t.id === note.tech_id);
                return (
                  <div className={styles.noteItem} key={note.id}>
                    <p>{note.content}</p>
                    <div className={styles.noteItemFooter}>
                      <div>
                        <p>~ {tech?.first_name}</p>
                        <p>[{formatDate(note.created_on)}]</p>
                      </div>
                      {user && (
                        <button
                          className={styles.noPrint}
                          onClick={() => deleteNote(note.id)}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
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
