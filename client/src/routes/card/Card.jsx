import styles from "./Card.module.css";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Button from "../../components/buttons/Button";
import { brands, colors, machineStyles } from "../../utils/Schemas";
import { renderOptions, formatDate } from "../../utils/Tools";
import { VENDORS, MACHINE_CONDITIONS } from "../../utils/Enums";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Card = () => {
  const { id } = useParams();
  const [machine, setMachine] = useState(null);
  const [editing, setEditing] = useState(false);
  const [addNote, setAddNote] = useState(false);
  const [formData, setFormData] = useState({});
  const [newNote, setNewNote] = useState("");

  useEffect(() => {
    const getMachine = async () => {
      try {
        const response = await fetch(`/api/read/get_machine/${id}`);
        const data = await response.json();
        if (!response.ok || !data.success) {
          setMachine(null);
          toast.error(data.message || "Machine not found");
          return;
        }
        setMachine(data.data);
        setFormData({
          brand: data.data.brand || "",
          model: data.data.model || "",
          serial: data.data.serial || "",
          style: data.data.style || "",
          color: data.data.color || "",
          condition: data.data.condition || "",
          vendor: data.data.vendor || "",
        });
      } catch (error) {
        console.error(error);
        toast.error(error.message);
        setMachine(null);
      }
    };
    getMachine();
  }, [id]);

  useEffect(() => {
    if (machine && Object.keys(machine).length > 0) {
      setFormData({
        brand: machine.brand || "",
        model: machine.model || "",
        serial: machine.serial || "",
        style: machine.style || "",
        color: machine.color || "",
        condition: machine.condition || "",
        vendor: machine.vendor || "",
      });
    }
  }, [machine]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const UpdateMachineStatus = async (newStatus) => {
    if (!confirm("Update Status?")) {
      return;
    }
    try {
      const response = await fetch(`/api/update/update_machine/${id}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }
      if (data.machine) {
        setMachine(data.machine);
      }
      toast.success(`Machine marked as ${newStatus}`);
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  const handleMachineForm = async (e) => {
    e.preventDefault();
    try {
      const inputs = {
        ...formData,
        model: formData.model.toUpperCase(),
        serial: formData.serial.toUpperCase(),
      };
      const response = await fetch(`/api/update/update_machine/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(inputs),
      });
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }
      if (data.machine) {
        setMachine(data.machine);
      }
      setEditing(false);
      toast.success(data.message);
      return;
    } catch (error) {
      console.error(error);
      toast.error(error.message);
      return;
    }
  };

  const handleNoteForm = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/create/add_note/${id}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: newNote }),
      });
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }
      setMachine((prev) => ({
        ...prev,
        notes: [...prev.notes, data.note],
      }));
      setNewNote("");
      setAddNote(false);
      toast.success(data.message);
    } catch (error) {
      console.error(error);
      toast.error(error.message);
      return;
    }
  };

  const deleteNote = async (note_id) => {
    if (!confirm("Delete Note?")) {
      return;
    }
    try {
      const response = await fetch(`/api/delete/delete_note/${note_id}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }
      setMachine((prev) => ({
        ...prev,
        notes: prev.notes.filter((note) => note.id !== note_id),
      }));
      toast.success(data.message);
      return;
    } catch (error) {
      console.error(error);
      toast.error(error.message);
      return;
    }
  };

  const sendLabelData = async () => {
    if (!confirm("Print label?")) {
      return;
    }
    const response = await fetch("/api/labels/print_label", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: machine.id,
        model: machine.model,
        serial: machine.serial,
        brand: machine.brand,
        style: machine.style,
        color: machine.color,
      }),
    });
    const data = await response.json();
    if (!data.success) {
      toast.error(data.message);
      return;
    } else {
      toast.success(data.message);
    }
  };

  if (machine === null) return <h1>Machine Not Found....</h1>;

  if (!machine) return <h1>Loading...</h1>;

  return (
    <div className={styles.card}>
      <Button
        label={editing ? "QUIT" : "EDIT"}
        onClick={() => setEditing(!editing)}
        className={styles.toggleEditButton}
      />

      <form className={styles.machineEditForm} onSubmit={handleMachineForm}>
        <ul className={styles.machineDataList}>
          <li>
            <span>Brand</span>
            {editing ? (
              <select
                name="brand"
                id="brand"
                value={formData.brand}
                onChange={handleChange}
              >
                <option value="">--Select Brand--</option>
                {renderOptions(brands)}
              </select>
            ) : (
              <span>{machine.brand}</span>
            )}
          </li>
          <li>
            <span>Model</span>
            {editing ? (
              <input
                type="text"
                name="model"
                id="model"
                value={formData.model}
                onChange={handleChange}
              />
            ) : (
              <span>{machine.model}</span>
            )}
          </li>
          <li>
            <span>Serial</span>
            {editing ? (
              <input
                type="text"
                name="serial"
                id="serial"
                value={formData.serial}
                onChange={handleChange}
              />
            ) : (
              <span>{machine.serial}</span>
            )}
          </li>
          <li>
            <span>Style</span>
            {editing ? (
              <select
                name="style"
                id="style"
                value={formData.style}
                onChange={handleChange}
              >
                <option value="">--Select Style--</option>
                {renderOptions(machineStyles[machine.type_of])}
              </select>
            ) : (
              <span>{machine.style}</span>
            )}
          </li>
          <li>
            <span>Color</span>
            {editing ? (
              <select
                name="color"
                id="color"
                value={formData.color}
                onChange={handleChange}
              >
                <option value="">--Select Color--</option>
                {renderOptions(colors)}
              </select>
            ) : (
              <span>{machine.color}</span>
            )}
          </li>
          <li>
            <span>Condition</span>
            {editing ? (
              <select
                name="condition"
                id="condition"
                value={formData.condition}
                onChange={handleChange}
              >
                <option value="">--Select Color--</option>
                {renderOptions(MACHINE_CONDITIONS)}
              </select>
            ) : (
              <span>{machine.condition}</span>
            )}
          </li>
          <li>
            <span>Vendor</span>
            {editing ? (
              <select
                name="vendor"
                id="vendor"
                value={formData.vendor}
                onChange={handleChange}
              >
                <option value="">--Select Vendor--</option>
                {renderOptions(VENDORS)}
              </select>
            ) : (
              <span>{machine.vendor}</span>
            )}
          </li>
          {editing && (
            <li className={styles.buttonLi}>
              <Button
                className={styles.machineFormButton}
                label={"Submit"}
                type="submit"
              />
            </li>
          )}
        </ul>
      </form>
      <div className={styles.noteSection}>
        <p>
          NOTES <Button label={"+"} onClick={() => setAddNote(!addNote)} />
        </p>
        <ul className={styles.currentNotes}>
          {machine.notes?.map((note) => (
            <li key={note.id} onClick={() => deleteNote(note.id)}>
              <div>
                {note.content}

                <span>{formatDate(note.date)}</span>
              </div>
              <div>
                <span>{note.author_name}</span>
              </div>
            </li>
          ))}
          {addNote && (
            <form className={styles.noteForm} onSubmit={handleNoteForm}>
              <li>
                <textarea
                  name="content"
                  id="content"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  autoFocus
                ></textarea>
              </li>
              <Button
                className={styles.noteFormSubmit}
                label={"Submit"}
                type="submit"
              />
            </form>
          )}
        </ul>
      </div>
      <div className={styles.machineControls}>
        <Button label={"Print Label"} onClick={sendLabelData} />
        {machine.status === "in_progress" ? (
          <>
            <Button
              label={"Complete Repair"}
              onClick={() => UpdateMachineStatus("completed")}
            />
            <Button
              label={"Trash"}
              className={styles.trashButtonControl}
              onClick={() => UpdateMachineStatus("trashed")}
            />
          </>
        ) : (
          <Button
            label={"Continue Repair"}
            onClick={() => UpdateMachineStatus("in_progress")}
          />
        )}
      </div>
    </div>
  );
};

export default Card;
