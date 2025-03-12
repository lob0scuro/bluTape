import styles from "./StartRepair.module.css";
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/UserContext";
import FridgeForm from "../components/FridgeForm";
import WasherForm from "../components/WasherForm";
import DryerForm from "../components/DryerForm";
import RangeForm from "../components/RangeForm";

const StartRepair = () => {
  const { user } = useAuth();
  const [ComponentToRender, setComponentToRender] = useState(null);
  const [activeButton, setActiveButton] = useState(null);

  const chosenForm = (c) => {
    setActiveButton(c);
    switch (c) {
      case 0:
        setComponentToRender(<FridgeForm />);
        break;
      case 1:
        setComponentToRender(<WasherForm />);
        break;
      case 2:
        setComponentToRender(<DryerForm />);
        break;
      case 3:
        setComponentToRender(<RangeForm />);
        break;
      default:
        setComponentToRender(<p>Pick a form</p>);
    }
  };

  return (
    <>
      <div className={styles.formButtonGroup}>
        <button
          className={activeButton === 0 ? styles.activated : ""}
          onClick={() => chosenForm(0)}
        >
          Fridge
        </button>
        <button
          className={activeButton === 1 ? styles.activated : ""}
          onClick={() => chosenForm(1)}
        >
          Washer
        </button>
        <button
          className={activeButton === 2 ? styles.activated : ""}
          onClick={() => chosenForm(2)}
        >
          Dryer
        </button>
        <button
          className={activeButton === 3 ? styles.activated : ""}
          onClick={() => chosenForm(3)}
        >
          Range
        </button>
      </div>
      <div className={styles.renderedForm}>{ComponentToRender}</div>
    </>
  );
};

export default StartRepair;
