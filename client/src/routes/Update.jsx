import styles from "../style/Update.module.css";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useActionState } from "react";
import { useAuth } from "../context/UserContext.jsx";
import toast from "react-hot-toast";
import {
  brands,
  colors,
  machineStyles,
  renderOptions,
  fetchOneMachine,
  machineMap,
  vendors,
} from "../utils.jsx";

const Update = () => {
  const { id, typeOf } = useParams();
  const { user } = useAuth();
  const [machine, setMachine] = useState({});
  const navigate = useNavigate();

  const [editing, setEditing] = useState({
    brand: false,
    model: false,
    serial: false,
    color: false,
    style: false,
    vendor: false,
    condition: false,
    heat_type: false,
  });

  const [formData, setFormData] = useState({
    brand: machine.brand,
    model: machine.model,
    serial: machine.serial,
    color: machine.color,
    style: machine.style,
    vendor: machine.vendor,
    condition: machine.condition,
    heat_type: machine.heat_type,
  });

  useEffect(() => {
    const getMachine = async () => {
      const gotMachine = await fetchOneMachine(0, id);
      setMachine(gotMachine);
    };
    getMachine();
  }, []);

  useEffect(() => {
    if (machine && Object.keys(machine).length > 0) {
      setFormData({
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
  }, [machine]);

  const fieldConfig = [
    {
      name: "brand",
      label: "Brand",
      type: "select",
      options: brands,
    },
    { name: "model", label: "Model", type: "text" },
    { name: "serial", label: "Serial", type: "text" },
    {
      name: "color",
      label: "Color",
      type: "select",
      options: colors,
    },
    {
      name: "style",
      label: "Style",
      type: "select",
      options: machineStyles[machine.machine_type],
    },
    {
      name: "vendor",
      label: "Vendor",
      type: "select",
      options: vendors,
    },
    {
      name: "condition",
      label: "Condition",
      type: "select",
      options: ["NEW", "USED"],
    },
    {
      name: "heat_type",
      label: "Heat Type",
      type: "select",
      options: ["Gas", "Electric"],
      showIf: [2, 3].includes(machine.machine_type),
    },
  ];

  const submitForm = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/update/edit/${machine.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) {
        toast.error("There was an error");
        console.error(`Error: ${response.statusText}`);
        return;
      }
      toast.success(data.message);
      navigate(`/card/${machine.id}/${0}`);
    } catch (error) {
      console.error(error);
      toast.error(error);
      return error;
    }
  };

  return (
    <>
      <h1>
        {machine.brand} {machineMap[machine.machine_type]}
      </h1>
      <p>
        <b>**Click field to edit info**</b>
      </p>
      <form className={styles.editForm} onSubmit={submitForm}>
        <ul className={styles.machineInfo}>
          {fieldConfig
            .filter((field) => field.showIf === undefined || field.showIf)
            .map(({ name, label, type, options }) => (
              <li key={name}>
                {editing[name] ? (
                  <>
                    {type === "text" ? (
                      <>
                        {label}:
                        <input
                          type="text"
                          name={name}
                          value={formData[name]}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              [name]: e.target.value,
                            }))
                          }
                          onBlur={() =>
                            setEditing((prev) => ({ ...prev, [name]: false }))
                          }
                          autoFocus
                        />
                      </>
                    ) : (
                      <>
                        {label}:
                        <select
                          name={name}
                          value={formData[name]}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              [name]: e.target.value,
                            }))
                          }
                          onBlur={() =>
                            setEditing((prev) => ({ ...prev, [name]: false }))
                          }
                          autoFocus
                        >
                          <option value="">--Select {label}</option>
                          {Array.isArray(options)
                            ? options.map((opt) => (
                                <option key={opt} value={opt}>
                                  {opt}
                                </option>
                              ))
                            : Object.entries(options).map(([key, value]) => (
                                <option key={key} value={value}>
                                  {value}
                                </option>
                              ))}
                        </select>
                      </>
                    )}
                  </>
                ) : (
                  <span
                    onClick={() =>
                      setEditing((prev) => ({ ...prev, [name]: true }))
                    }
                  >
                    {label}: <small>{formData[name]}</small>
                  </span>
                )}
              </li>
            ))}
        </ul>
        <button type="submit">Submit</button>
      </form>
    </>
  );
};

export default Update;
