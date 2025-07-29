import styles from "./Card.module.css";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/UserContext";
import {
  fetchMachine,
  fetchMachineNotes,
  submitForm,
  changeStatus,
} from "../../utils/API";
import toast from "react-hot-toast";
import Button from "../../components/Button";
import { renderOptions, formatDate } from "../../utils/Tools";
import {
  machineStyles,
  brands,
  colors,
  conditions,
  vendors,
} from "../../utils/Schemas";
import clsx from "clsx";

const styleMap = [
  machineStyles.fridge,
  machineStyles.washer,
  machineStyles.dryer,
  machineStyles.range,
];

const Card = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [machine, setMachine] = useState({});
  const [notes, setNotes] = useState([]);
  const [editing, setEditing] = useState(false);
  const [formValues, setFormValues] = useState({});
  const [editNotes, setEditNotes] = useState(false);
  const [noteFormValues, setNoteFormValues] = useState({
    content: "",
  });
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const get = async () => {
      const got = await fetchMachine(id);
      if (!got.success) {
        toast.error(got.error);
        setMachine(null);
      }
      setMachine(got.machine);
    };
    get();
  }, [editing, refreshTrigger]);

  useEffect(() => {
    const getNotes = async () => {
      try {
        const gotNotes = await fetchMachineNotes(id);
        if (!gotNotes.success) {
          console.error(gotNotes.error);
          setNotes([]);
          return;
        }
        setNotes(gotNotes.notes);
      } catch (error) {
        toast.error(error.message);
      }
    };
    getNotes();
  }, [editNotes, refreshTrigger]);

  useEffect(() => {
    if (editing && machine) {
      setFormValues({
        brand: machine.brand || "",
        model: machine.model || "",
        serial: machine.serial || "",
        color: machine.color || "",
        style: machine.style || "",
        vendor: machine.vendor || "",
        condition: machine.condition || "",
      });
    }
  }, [editing, machine]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };
  const handleNoteChange = (e) => {
    const { name, value } = e.target;
    setNoteFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleMachineForm = async (e) => {
    e.preventDefault();
    const inputs = formValues;
    const { success, message, error } = await submitForm({
      endpoint: `/update/update_machine/${id}`,
      method: "PATCH",
      inputs: inputs,
    });
    if (!success) {
      toast.error(error);
      return;
    }
    toast.success(message);
    setEditing(false);
  };

  const handleNoteForm = async (e) => {
    e.preventDefault();
    const inputs = noteFormValues;
    const { success, message, error } = await submitForm({
      endpoint: `/create/add_note/${id}`,
      method: "POST",
      inputs: inputs,
    });
    if (!success) {
      toast.error(error);
      return;
    }
    toast.success(message);
    setNoteFormValues((noteFormValues.content = ""));
    setEditNotes(false);
  };

  const handleMachineDelete = async () => {
    if (!confirm("Delete machine?")) {
      return;
    }
    const { success, message, error } = await submitForm({
      endpoint: `/delete/delete_machine/${id}`,
      method: "DELETE",
    });
    if (!success) {
      toast.error(error);
      return;
    }
    toast.success(message);
    navigate("/queue");
  };

  const handleNoteDelete = async (note_id) => {
    if (!confirm("Delete note?")) {
      return;
    }
    const { success, message, error } = await submitForm({
      endpoint: `/delete/delete_note/${note_id}`,
      method: "DELETE",
    });
    if (!success) {
      toast.error("An error occured: ", error);
      return;
    }
    toast.success(message);
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleMachineStatus = async (id, status, value) => {
    if (!confirm("Update status?")) return;
    const sendUpdate = await changeStatus(id, status, value);
    if (!sendUpdate.success) {
      toast.error(sendUpdate.error);
      return;
    }
    toast.success(sendUpdate.message);
    setRefreshTrigger((prev) => prev + 1);
  };

  if (!machine) {
    return <p>Looking for machine...</p>;
  }

  return (
    <div className={styles.machineCard}>
      {user && ["Technician", "Office"].includes(user.position) && (
        <Button
          title={editing ? "Cancel Edit" : "Edit Machine"}
          isSecondary
          onClick={() => setEditing(!editing)}
        />
      )}
      <form className={styles.cardForm} onSubmit={handleMachineForm}>
        <ul className={styles.machineData}>
          <li
            style={{
              alignSelf: "center",
              width: "100%",
              justifyContent: "center",
              color: "var(--textSecondary)",
              fontSize: "1rem",
              fontWeight: "800",
            }}
          >
            {!machine.is_clean && !machine.is_exported && (
              <p>{machine.machine_type} queued - pending clean</p>
            )}
            {machine.is_clean && !machine.is_exported && (
              <p>{machine.machine_type} cleaned - pending export</p>
            )}
            {machine.is_clean && machine.is_exported && (
              <p>{machine.machine_type} inventoried</p>
            )}
          </li>
          <li>
            <p>Brand:</p>
            {editing ? (
              <select
                type="text"
                name="brand"
                id="brand"
                value={formValues.brand}
                onChange={handleChange}
              >
                <option value="">--select brand--</option>
                {renderOptions(brands)}
              </select>
            ) : (
              <p>{machine.brand}</p>
            )}
          </li>
          <li>
            <p>Model:</p>
            {editing ? (
              <input
                type="text"
                name="model"
                id="model"
                value={formValues.model}
                onChange={handleChange}
              />
            ) : (
              <p>{machine.model}</p>
            )}
          </li>
          <li>
            <p>Serial:</p>
            {editing ? (
              <input
                type="text"
                name="serial"
                id="serial"
                value={formValues.serial}
                onChange={handleChange}
              />
            ) : (
              <p>{machine.serial}</p>
            )}
          </li>
          <li>
            <p>Style:</p>
            {editing ? (
              <select
                type="text"
                name="style"
                id="style"
                value={formValues.style}
                onChange={handleChange}
              >
                <option value="">--select style--</option>
                {renderOptions(styleMap[machine.type_id - 1])}
              </select>
            ) : (
              <p>{machine.style}</p>
            )}
          </li>
          <li>
            <p>Color:</p>
            {editing ? (
              <select
                type="text"
                name="color"
                id="color"
                value={formValues.color}
                onChange={handleChange}
              >
                <option value="">--select color--</option>
                {renderOptions(colors)}
              </select>
            ) : (
              <p>{machine.color}</p>
            )}
          </li>
          <li>
            <p>Condition:</p>
            {editing ? (
              <select
                type="text"
                name="condition"
                id="condition"
                value={formValues.condition}
                onChange={handleChange}
              >
                <option value="">--select condition--</option>
                {renderOptions(conditions)}
              </select>
            ) : (
              <p>{machine.condition}</p>
            )}
          </li>
          <li>
            <p>Vendor:</p>
            {editing ? (
              <select
                type="text"
                name="vendor"
                id="vendor"
                value={formValues.vendor}
                onChange={handleChange}
              >
                <option value="">--select vendor--</option>
                {renderOptions(vendors)}
              </select>
            ) : (
              <p>{machine.vendor}</p>
            )}
          </li>
          <br />
          {editing && <Button title="Submit" isSecondary type="submit" />}
        </ul>
      </form>
      <div className={styles.noteBlock}>
        <h3>
          <p>Notes</p>
          {user && (
            <p
              className={styles.addNoteBtn}
              onClick={() => setEditNotes(!editNotes)}
            >
              {editNotes ? "-" : "+"}
            </p>
          )}
        </h3>
        <ul>
          {notes?.map(({ id, content, created_on, created_by, user_id }) => (
            <li key={id}>
              <div>
                <p>{content}</p>
                <p>~ {created_by}</p>
                <p>[{formatDate(created_on)}]</p>
              </div>
              {user_id === user?.id && (
                <button onClick={() => handleNoteDelete(id)}>x</button>
              )}
            </li>
          ))}
          {editNotes && (
            <form className={styles.noteForm} onSubmit={handleNoteForm}>
              <textarea
                name="content"
                id="content"
                value={noteFormValues.content}
                onChange={handleNoteChange}
                autoFocus
              ></textarea>
              <Button title="Submit" type="submit" isSecondary />
            </form>
          )}
        </ul>
      </div>
      <div className={styles.handleMachineButtonBlock}>
        {user && user?.is_admin && machine.is_clean && (
          <button
            onClick={() =>
              handleMachineStatus(
                machine.id,
                "is_exported",
                machine.is_exported ? false : true
              )
            }
          >
            {machine.is_exported ? "Undo Export" : "Export Machine"}
          </button>
        )}
        {(user?.is_admin ||
          (user &&
            ["Cleaner", "Office"].includes(user.position) &&
            !machine.is_exported)) && (
          <button
            onClick={() =>
              handleMachineStatus(
                machine.id,
                "is_clean",
                machine.is_clean ? false : true
              )
            }
          >
            {machine.is_clean ? "Undo Cleaning" : "Finish Cleaning"}
          </button>
        )}

        {user && ["Technician", "Office"].includes(user.position) && (
          <button
            onClick={handleMachineDelete}
            className={styles.deleteMachineBtn}
          >
            Delete Machine
          </button>
        )}
      </div>
    </div>
  );
};

export default Card;
