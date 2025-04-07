import RepairForm from "../components/RepairForm";
import { useAuth } from "../context/UserContext";
import styles from "../style/StartRepair.module.css";
import React, { useState } from "react";

const formTitles = ["Refrigerator", "Washer", "Dryer", "Range"];

const StartRepair = () => {
  const { user } = useAuth();
  const [chosenForm, setChosenForm] = useState(
    <RepairForm title={formTitles[user.role]} machineType={user.role} />
  );

  const renderForm = (f) => {
    switch (f) {
      case 0:
        setChosenForm(<RepairForm title={formTitles[f]} machineType={f} />);
        break;
      case 1:
        setChosenForm(<RepairForm title={formTitles[f]} machineType={f} />);
        break;
      case 2:
        setChosenForm(<RepairForm title={formTitles[f]} machineType={f} />);
        break;
      case 3:
        setChosenForm(<RepairForm title={formTitles[f]} machineType={f} />);
        break;
    }
  };
  return (
    <>
      {/* <h1>Start Repair</h1> */}
      <div className={styles.startRepairButtonGroup}>
        <button onClick={() => renderForm(0)}>Refrigerator</button>
        <button onClick={() => renderForm(1)}>Washer</button>
        <button onClick={() => renderForm(2)}>Dryer</button>
        <button onClick={() => renderForm(3)}>Range</button>
      </div>
      {chosenForm}
    </>
  );
};

export default StartRepair;
