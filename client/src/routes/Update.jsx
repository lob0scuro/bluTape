import styles from "../style/Update.module.css";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useActionState } from "react";
import { useAuth } from "../context/UserContext.jsx";
import {
  brands,
  colors,
  machineStyles,
  renderOptions,
  fetchOneMachine,
  machineMap,
} from "../utils.jsx";

const Update = () => {
  const submitForm = async (prevData, formData) => {
    const fields = Object.fromEntries(formData);
    assurance = confirm("Submit edits?");
    if (!assurance) {
      return;
    }
    try {
      const response = await fetch(`/update/edit/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(fields),
      });
      const data = await response.json();
      if (!response.ok) {
        return {
          error: data.error || `There was an error: ${response.statusText}`,
        };
      }
      return { message: data.message };
    } catch (error) {
      alert("There was an error");
      return error;
    }
  };

  const { id } = useParams();
  const { user } = useAuth();
  const [machine, setMachine] = useState({});
  const [state, formAction] = useActionState(submitForm, {
    message: "",
    error: "",
  });

  useEffect(() => {
    const getMachine = async () => {
      const gotMachine = await fetchOneMachine(0, id);
      setMachine(gotMachine);
    };
    getMachine();
  }, []);

  console.log(machine);

  return (
    <>
      <h1>Update Machine</h1>
      {machine && (
        <form action={formAction} className={styles.editForm}>
          <div>
            <label htmlFor="brand">Brand: </label>
            <select name="brand" id="brand" defaultValue={machine.brand}>
              {renderOptions(brands)}
            </select>
          </div>
          <div>
            <label htmlFor="model">Model: </label>
            <input
              type="text"
              name="model"
              id="model"
              defaultValue={machine.model}
            />
          </div>
          <div>
            <label htmlFor="serial">Serial: </label>
            <input
              type="text"
              name="serial"
              id="serial"
              defaultValue={machine.serial}
            />
          </div>
          <div>
            <label htmlFor="color">Color: </label>
            <select name="color" id="color" defaultValue={machine.color}>
              {renderOptions(colors)}
            </select>
          </div>
          {machine.style && (
            <div>
              <label htmlFor="style">Style: </label>
              <select name="style" id="style" defaultValue={machine.style}>
                {renderOptions(machineStyles[machine.machine_type])}
              </select>
            </div>
          )}
          <div>
            <label htmlFor="condition">Condition: </label>
            <select
              name="condition"
              id="condition"
              defaultValue={machine.condition}
            >
              <option value="USED">Used</option>
              <option value="NEW">New</option>
            </select>
          </div>
          {machine.heat_type && (
            <div>
              <label htmlFor="heat_type">Heat Type: </label>
              <select
                name="heat_type"
                id="heat_type"
                defaultValue={machine.heat_type}
              >
                <option value="Gas">Gas</option>
                <option value="Electric">Electric</option>
              </select>
            </div>
          )}
          <button type="submit">Submit</button>
        </form>
      )}
    </>
  );
};

export default Update;
