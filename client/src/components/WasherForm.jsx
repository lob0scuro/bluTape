import styles from "./WasherForm.module.css";
import React, { useActionState } from "react";
import { useNavigate } from "react-router-dom";

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
  Other: "Other",
};

const renderBrandOptions = Object.entries(brands).map(([key, value]) => (
  <option key={key} value={value}>
    {value}
  </option>
));

const WasherForm = () => {
  const submitForm = async (prevState, formData) => {
    // need to add route in flask for submitting new washer
    const response = await fetch("/fridges/create_fridge", {
      method: "POST",
      headers: {
        "content-Type": "application/json",
      },
      body: JSON.stringify(Object.fromEntries(formData)),
    });
    if (!response.ok) {
      alert("There was an issue");
      throw new Error("Error", response.statusText);
    }
    const data = await response.json();
    alert(data.message);
    navigate(`/repair-card/${data.machine.id}`);
    return data.machine;
  };
  const [state, formAction, isPending] = useActionState(submitForm);
  const navigate = useNavigate();
  return (
    <>
      <h2 className={styles.formHeader}>Washer Form</h2>
      <form action="" className={styles.washerForm}>
        <div>
          <label htmlFor="make">Brand: </label>
          <select name="make" id="make">
            <option value="">--Select Brand--</option>
            {renderBrandOptions}
          </select>
        </div>
        <div className={styles.modelField}>
          <label htmlFor="model">Model: </label>
          <input type="text" name="model" id="model" />
        </div>
        <div className={styles.serialField}>
          <label htmlFor="serial">Serial: </label>
          <input type="text" name="serial" id="serial" />
        </div>
        <div className={styles.colorField}>
          <label htmlFor="color">Color: </label>
          <select name="color" id="color">
            <option value="">--Select Color--</option>
            <option value="white">White</option>
            <option value="black">Black</option>
            <option value="stainless">Stainless</option>
            <option value="black-stainless">Black Stainless</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className={styles.styleField}>
          <label htmlFor="style">Style: </label>
          <select name="type" id="type">
            <option value="null">-- Select Style --</option>
            <option value="Top & Bottom">Top and Bottom</option>
            <option value="Side by Side">Side by Side</option>
            <option value="French Door">French Door</option>
            <option value="Freezer">Freezer</option>
            <option value="Bottom Top">Bottom Top</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className={styles.conditionField}>
          <label htmlFor="condition">Condition: </label>
          <select name="condition" id="condition">
            <option value="">--Select Condition--</option>
            <option value="USED">USED</option>
            <option value="NEW">NEW</option>
          </select>
        </div>
        <div className={styles.noteField}>
          <label htmlFor="note">Note</label>
          <textarea name="note" id="note"></textarea>
        </div>
        <button type="submit" disabled={isPending}>
          Submit
        </button>
      </form>
    </>
  );
};

export default WasherForm;
