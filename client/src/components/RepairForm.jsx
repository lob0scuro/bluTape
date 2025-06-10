import styles from "../style/RepairForm.module.css";
import { useState } from "react";
import {
  brands,
  colors,
  machineStyles,
  renderOptions,
  vendors,
  conditions,
} from "../utils.jsx";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import BarcodeScanner from "./BarcodeScanner.jsx";

const RepairForm = ({ title, machineType }) => {
  const navigate = useNavigate();
  const [scanningField, setScanningField] = useState(null); //model|serial
  const [formValues, setFormValues] = useState({ model: "", serial: "" });

  const submitForm = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    // const inputs = Object.fromEntries(formData.entries());
    const inputs = {
      ...Object.fromEntries(formData.entries()),
      model: formValues.model,
      serial: formValues.serial,
    };
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
        toast.error(data.error);
        return {
          error: data.error || `There was an error: ${response.statusText}`,
        };
      }
      toast.success(data.message);
      navigate(`/card/${data.machine.id}/${0}`);
      return { message: data.message };
    } catch (error) {
      toast.error(`There was an unexpected error: ${error.message}`);
      return { error: "There was an unexpected error." };
    }
  };

  return (
    <>
      {/* <h1 className={styles.repairHeader}>{title}</h1> */}
      <form className={styles.repairForm} onSubmit={submitForm}>
        <div>
          <label htmlFor="brand">Brand: </label>
          <select name="brand" id="brand" required>
            <option value="">--Select Brand--</option>
            {renderOptions(brands)}
          </select>
        </div>
        <div>
          <label htmlFor="model">Model: </label>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <input
              type="text"
              name="model"
              id="model"
              required
              value={formValues.model}
              onChange={(e) =>
                setFormValues({ ...formValues, model: e.target.value })
              }
            />
            <button type="button" onClick={() => setScanningField("model")}>
              Scan
            </button>
          </div>
          {/* <input type="text" name="model" id="model" required /> */}
        </div>
        <div>
          <label htmlFor="serial">Serial: </label>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <input
              type="text"
              name="serial"
              id="serial"
              required
              value={formValues.serial}
              onChange={(e) =>
                setFormValues({ ...formValues, serial: e.target.value })
              }
            />
            <button
              type="button"
              onClick={() => {
                setScanningField("serial");
                console.log(scanningField);
              }}
            >
              Scan
            </button>
          </div>
          {/* <input type="text" name="serial" id="serial" required /> */}
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
            {renderOptions(conditions)}
          </select>
        </div>

        <div>
          <label htmlFor="vendor">Vendor: </label>
          <select name="vendor" id="vendor">
            <option value="">--Select Vendor--</option>
            {renderOptions(vendors)}
          </select>
        </div>
        <div className={styles.noteBlock}>
          <label htmlFor="note">Note</label>
          <textarea name="note" id="note"></textarea>
        </div>
        <button type="submit">Submit</button>
        {scanningField && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.8)",
              zIndex: 1000,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "1rem",
            }}
          >
            <BarcodeScanner
              onResult={(value) => {
                setFormValues((prev) => ({ ...prev, [scanningField]: value }));
                toast.success(`Scanned ${scanningField}: ${value}`);
                // setScanningField(null);
              }}
              onCancel={() => setScanningField(null)}
            />
          </div>
        )}
      </form>
    </>
  );
};

export default RepairForm;
