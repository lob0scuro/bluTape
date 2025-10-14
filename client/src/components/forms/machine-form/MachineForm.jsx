import styles from "./MachineForm.module.css";
import React, { useEffect, useState } from "react";
import { brands, colors, machineStyles } from "../../../utils/Schemas";
import {
  VENDORS,
  MACHINE_CONDITIONS,
  STATUS,
  TYPES,
} from "../../../utils/Enums";
import { renderOptions } from "../../../utils/Tools";
import Button from "../../buttons/Button";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const MachineForm = ({ machine_type }) => {
  const navigate = useNavigate();
  const [formInputs, setFormInputs] = useState({
    brand: "",
    model: "",
    serial: "",
    style: "",
    color: "",
    condition: "",
    vendor: "",
  });

  const handleChange = (e) => {
    setFormInputs({
      ...formInputs,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    formInputs.type_of = machine_type;
    try {
      const response = await fetch(`/api/create/add_machine`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formInputs),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }
      toast.success(data.message);
      navigate(`/card/${data.machine_id}`);
    } catch (error) {
      console.error(error);
      toast.error(error.message);
      return;
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.machineForm}>
      <div>
        <label htmlFor="brand">Brand</label>
        <select
          name="brand"
          id="brand"
          value={formInputs.brand}
          onChange={handleChange}
          required
        >
          <option value="">--Select Brand--</option>
          {renderOptions(brands)}
        </select>
      </div>
      <div>
        <label htmlFor="model">Model</label>
        <input
          type="text"
          name="model"
          id="model"
          value={formInputs.model}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="serial">Serial</label>
        <input
          type="text"
          name="serial"
          id="serial"
          value={formInputs.serial}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="style">Style</label>
        <select
          name="style"
          id="style"
          value={formInputs.style}
          onChange={handleChange}
        >
          <option value="">--Select Machine Style</option>
          {renderOptions(machineStyles[machine_type])}
        </select>
      </div>
      <div>
        <label htmlFor="color">Color</label>
        <select
          name="color"
          id="color"
          value={formInputs.color}
          onChange={handleChange}
        >
          <option value="">--Select Color--</option>
          {renderOptions(colors)}
        </select>
      </div>
      <div>
        <label htmlFor="condition">Condition</label>
        <select
          name="condition"
          id="condition"
          value={formInputs.condition}
          onChange={handleChange}
        >
          <option value="">--Select Condition--</option>
          {renderOptions(MACHINE_CONDITIONS)}
        </select>
      </div>
      <div>
        <label htmlFor="vendor">Vendor</label>
        <select
          name="vendor"
          id="vendor"
          value={formInputs.vendor}
          onChange={handleChange}
        >
          <option value="">--Select Vendor--</option>
          {renderOptions(VENDORS)}
        </select>
      </div>
      <Button label={"Submit"} type="submit" />
    </form>
  );
};

export default MachineForm;
