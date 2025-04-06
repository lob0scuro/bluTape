import styles from "../style/RepairForm.module.css";
import { useActionState } from "react";

const brands = {
  Admiral: "Admiral",
  Amana: "Amana",
  Avanti: "Avanti",
  Bosch: "Bosch",
  Crosley: "Crosley",
  Cuisinart: "Cuisinart",
  Danby: "Danby",
  Fridgidaire: "Fridgidaire",
  GE: "GE",
  Haier: "Haier",
  Hotpoint: "Hotpoint",
  Kenmore: "Kenmore",
  Kitchenaid: "Kitchenaid",
  LG: "LG",
  Maytag: "Maytag",
  Roper: "Roper",
  Samsung: "Samsung",
  Whirlpool: "Whirlpool",
};

const colors = {
  Black: "Black",
  White: "White",
  Stainless: "Stainless",
  BlackStainless: "Black Stainless",
  Blue: "Blue",
  Cream: "Cream",
  Red: "Red",
};

const machineStyles = [
  {
    TopAndBottom: "Top and Bottom",
    SideBySide: "Side by Side",
    FrenchDoor: "French Door",
    BottomTop: "Bottom Top",
    Freezer: "Freezer",
  },
  {
    TopLoad: "Top Load",
    FrontLoad: "Front Load",
  },
  {
    TopLoad: "Top Load",
    FrontLoad: "Front Load",
  },
  {
    GlassTop: "Glass Top",
    Coil: "Coil",
  },
];

const fridgeStyles = {
  TopAndBottom: "Top and Bottom",
  SideBySide: "Side by Side",
  FrenchDoor: "French Door",
  BottomTop: "Bottom Top",
  Freezer: "Freezer",
};
const washerDryerStyles = {
  TopLoad: "Top Load",
  FrontLoad: "Front Load",
};

const rangeStyles = {
  GlassTop: "Glass Top",
  Coil: "Coil",
};

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
      alert(data.message);
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

  const renderOptions = (obj) => {
    return (
      Object.entries(obj).map(([key, value]) => (
        <option key={key} value={key}>
          {value}
        </option>
      )) || null
    );
  };

  return (
    <>
      <h1 style={{ marginTop: "1rem" }}>{title}</h1>
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
