import styles from "./AddMachine.module.css";
import { useState } from "react";
import RepairForm from "../../components/RepairForm";
import { machineStyles } from "../../utils/Schemas";
import clsx from "clsx";

const AddMachine = () => {
  const [machineType, setMachineType] = useState({});
  const [active, setActive] = useState(0);

  const set = (t, n) => {
    setMachineType(t);
    setActive(n);
  };

  return (
    <>
      <div className={styles.formBlock}>
        <div className={styles.formSelector}>
          <button
            className={clsx(
              styles.formButton,
              active === 1 && styles.formButtonActive
            )}
            onClick={() => set(machineStyles.fridge, 1)}
          >
            Fridge
          </button>
          <button
            className={clsx(
              styles.formButton,
              active === 2 && styles.formButtonActive
            )}
            onClick={() => set(machineStyles.washer, 2)}
          >
            Washer
          </button>
          <button
            className={clsx(
              styles.formButton,
              active === 3 && styles.formButtonActive
            )}
            onClick={() => set(machineStyles.dryer, 3)}
          >
            Dryer
          </button>
          <button
            className={clsx(
              styles.formButton,
              active === 4 && styles.formButtonActive
            )}
            onClick={() => set(machineStyles.range, 4)}
          >
            Range
          </button>
        </div>
        <RepairForm machineType={machineType} type_id={active} />
        <br />
        <br />
        {active === 0 && (
          <p>
            <i>**Select Machine Type**</i>
          </p>
        )}
      </div>
    </>
  );
};

export default AddMachine;
