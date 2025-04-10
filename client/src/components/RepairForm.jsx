import styles from "../style/RepairForm.module.css";
import { useActionState } from "react";
import { brands, colors, machineStyles, renderOptions } from "../utils.jsx";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const RepairForm = ({ title, machineType }) => {
  const submitForm = async (prevData, formData) => {
    const inputs = Object.fromEntries(formData);
    inputs.machine_type = machineType;
    try {
      const response = await fetch("/create/create_repair", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inputs),
      });
      const data = await response.json();
      if (!response.ok) {
        alert(data.error);
        return {
          error: data.error || `There was an error: ${response.statusText}`,
        };
      }
      toast.success(data.message);
      navigate(`/card/${data.machine.id}/${0}`);
      return { message: data.message };
    } catch (error) {
      alert("There was an unexpected error.");
      return { error: "There was an unexpected error." };
    }
  };

  const [state, formAction] = useActionState(submitForm, {
    message: "",
    error: "",
  });

  const navigate = useNavigate();

  return (
    <>
      <h1 className={styles.repairHeader}>{title}</h1>
      <form className={styles.repairForm} action={formAction}>
        <div>
          <label htmlFor="brand">Brand: </label>
          <select name="brand" id="brand">
            <option value="">--Select Brand--</option>
            {renderOptions(brands)}
          </select>
        </div>
        <div>
          <label htmlFor="model">Model: </label>
          <input type="text" name="model" id="model" />
        </div>
        <div>
          <label htmlFor="serial">Serial: </label>
          <input type="text" name="serial" id="serial" />
        </div>
        <div>
          <label htmlFor="color">Color: </label>
          <select name="color" id="color">
            <option value="">--Select Color--</option>
            {renderOptions(colors)}
          </select>
        </div>
        <div>
          <label htmlFor="style">Style: </label>
          <select name="style" id="style">
            <option value="">--Select Style--</option>
            {renderOptions(machineStyles[machineType])}
          </select>
        </div>
        <div>
          <label htmlFor="condition">Condition: </label>
          <select name="condition" id="condition">
            <option value="">--Select Condition--</option>
            <option value="USED">Used</option>
            <option value="NEW">New</option>
          </select>
        </div>
        {machineType !== 0 && machineType !== 1 && (
          <div>
            <label htmlFor="heat_type">Heat Type: </label>
            <select name="heat_type" id="heat_type">
              <option value="">--Select Heat Type--</option>
              <option value="Gas">Gas</option>
              <option value="Electric">Electric</option>
            </select>
          </div>
        )}
        <div className={styles.noteBlock}>
          <label htmlFor="note">Note</label>
          <textarea name="note" id="note"></textarea>
        </div>
        <button type="submit">Submit</button>
      </form>
    </>
  );
};

export default RepairForm;
