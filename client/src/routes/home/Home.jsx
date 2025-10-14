import styles from "./Home.module.css";
import React, { useEffect, useState } from "react";
import Button from "../../components/buttons/Button";
import MachineForm from "../../components/forms/machine-form/MachineForm";
import { useAuth } from "../../context/AuthContext";

const formMap = {
  1: "fridge",
  2: "washer",
  3: "dryer",
  4: "range",
};

const Home = () => {
  const { user } = useAuth();
  const [machineType, setMachineType] = useState(formMap[user.role] || null);
  const [activeButton, setActiveButton] = useState(user.role || 1);

  // useEffect(() => {
  //   console.log(machineType);
  // }, [machineType]);

  const handleChange = (t) => {
    setMachineType(formMap[t]);
    setActiveButton(t);
  };

  return (
    <>
      <h1>Start Repair</h1>
      <div className={styles.buttonBlockHorizontal}>
        <Button
          label="Fridge"
          onClick={() => handleChange(1)}
          className={activeButton === 1 ? styles.activeButton : ""}
        />
        <Button
          label="Washer"
          onClick={() => handleChange(2)}
          className={activeButton === 2 ? styles.activeButton : ""}
        />
        <Button
          label="Dryer"
          onClick={() => handleChange(3)}
          className={activeButton === 3 ? styles.activeButton : ""}
        />
        <Button
          label="Range"
          onClick={() => handleChange(4)}
          className={activeButton === 4 ? styles.activeButton : ""}
        />
      </div>
      <div className={styles.formContainer}>
        <MachineForm machine_type={machineType || "fridge"} />
      </div>
    </>
  );
};

export default Home;
