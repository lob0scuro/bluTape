import RepairForm from "../components/RepairForm";
import { useAuth } from "../context/UserContext";
import styles from "../style/StartRepair.module.css";
import React, { useState } from "react";

const formTitles = ["Refrigerator", "Washer", "Dryer", "Range"];

const StartRepair = () => {
  const [chosenForm, setChosenForm] = useState(null);
  const [activeButton, setActiveButton] = useState(null);

  const renderForm = (f) => {
    switch (f) {
      case 0:
        setChosenForm(<RepairForm title={formTitles[f]} machineType={f} />);
        setActiveButton(f);
        break;
      case 1:
        setChosenForm(<RepairForm title={formTitles[f]} machineType={f} />);
        setActiveButton(f);
        break;
      case 2:
        setChosenForm(<RepairForm title={formTitles[f]} machineType={f} />);
        setActiveButton(f);
        break;
      case 3:
        setChosenForm(<RepairForm title={formTitles[f]} machineType={f} />);
        setActiveButton(f);
        break;
    }
  };
  return (
    <>
      <div className={styles.startRepairButtonGroup}>
        {[0, 1, 2, 3].map((f) => (
          <button
            key={f}
            onClick={() => renderForm(f)}
            className={f === activeButton ? styles.activeButton : ""}
          >
            {formTitles[f]}
          </button>
        ))}
      </div>
      {!chosenForm ? <h1>Choose Form</h1> : chosenForm}
    </>
  );
};

export default StartRepair;
