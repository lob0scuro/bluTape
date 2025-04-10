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
    const assurance = confirm("Submit edits?");
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
  const [isEditable, setIsEditable] = useState({
    brand: false,
    model: false,
    serial: false,
    color: false,
    style: false,
    condition: false,
    heat_type: false,
  });

  useEffect(() => {
    const getMachine = async () => {
      const gotMachine = await fetchOneMachine(0, id);
      setMachine(gotMachine);
    };
    getMachine();
  }, []);

  return (
    <>
      <h1>
        {machine.brand} {machineMap[machine.machine_type]}
      </h1>
      <form action={formAction}>
        <ul className={styles.machineInfo}>
          <li>
            Brand: <small>{machine.brand}</small>
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
      </form>
    </>
  );
};

export default Update;
