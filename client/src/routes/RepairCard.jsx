import styles from "../style/RepairCard.module.css";
import React, { useEffect, useState, useActionState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchOneMachine,
  formatDate,
  finishRepair,
  machineMap,
  deleteMachine,
} from "../utils.jsx";
import toast from "react-hot-toast";

const RepairCard = () => {
  const submitForm = async (prevData, formData) => {
    const fields = Object.fromEntries(formData);
    fields.machine_id = id;
    try {
      const response = await fetch("/create/add_note", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(fields),
      });
      const data = await response.json();
      if (!response.ok) {
        return { error: data.error || `Error: ${response.statusText}` };
      }
      toast.success("Note added");
      setNoteList((prev) => prev + 1);
      return { message: data.message };
    } catch (error) {
      alert("There was an error");
      return { error: error };
    }
  };

  const { id, typeOf } = useParams();
  const [machine, setMachine] = useState({});
  const [state, formAction] = useActionState(submitForm, {
    error: "",
    message: "",
  });
  const [noteList, setNoteList] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMachine = async () => {
      const fetchedMachine = await fetchOneMachine(typeOf, id);
      setMachine(fetchedMachine);
    };
    fetchMachine();
  }, [noteList]);

  const handleDelete = async () => {
    const result = await deleteMachine(machine.id);
    console.log("Delete result: ", result);

    if (result?.success) {
      toast.success(result.message || "Machine deleted!");
      navigate("/active");
    } else {
      toast.error(result?.error || "Something went wrong.");
    }
  };

  return (
    <>
      {state.error && <p style={{ color: "red" }}>{state.error.toString()}</p>}

      <div className={styles.cardButtonBlock}>
        <button>Label</button>
        <button onClick={() => navigate(`/edit/${machine.id}`)}>Edit</button>
        {machine.in_progress && (
          <button onClick={() => finishRepair(machine.id)}>Finished</button>
        )}

        <button onClick={() => handleDelete()}>Trash</button>
      </div>
      <div className={styles.mainCardBlock}>
        <div className={styles.infoBlock}>
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
              Condition: <small>{machine.condition}</small>
            </li>
            {machine.heat_type && (
              <li>
                Heat Type: <small>{machine.heat_type}</small>
              </li>
            )}
          </ul>
        </div>
        <div className={styles.notesBlock}>
          <ul className={styles.machineNotes}>
            <h3>Notes</h3>
            {machine.notes?.map((note, index) => (
              <li key={index}>
                <p>{note.content}</p>
                <p>
                  <small>{formatDate(note.created_on)}</small>
                </p>
              </li>
            ))}
          </ul>
          <form action={formAction}>
            <textarea name="content" id="content"></textarea>
            <button type="submit">Submit</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default RepairCard;
